import { Storage, type FileMetadata } from '@google-cloud/storage';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { createHash, randomUUID } from 'node:crypto';
import {
  type FileHandle,
  open,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  assertMigrationObjectMetadata,
  buildNewsMediaManifest,
  isOwnedCloudinaryNewsUrl,
  migrationObjectMetadata,
  planNewsMediaApply,
  planNewsMediaRollback,
  type NewsMediaArticle,
  type NewsMediaArticleUpdate,
  type NewsMediaMigrationEntry,
  type NewsMediaMigrationManifest,
  validateNewsMediaManifest,
} from '../modules/news/news-media-migration';
import {
  MAX_NEWS_IMAGE_BYTES,
  validateNewsImage,
} from '../modules/news/news-media.service';

const USER_AGENT = 'gcs-skills/1.0 (skill:google-cloud-storage-basics)';
const MAX_REDIRECTS = 3;
const COMMANDS = new Set([
  'inventory',
  'copy',
  'verify',
  'apply',
  'verify-db',
  'rollback',
]);

const sha256 = (value: Buffer | string) =>
  createHash('sha256').update(value).digest('hex');

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function option(name: string, fallback?: string) {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--'))
    throw new Error(`--${name} requires a value`);
  return value;
}

function help() {
  console.log(`Usage:
  pnpm media:migrate:gcs inventory --manifest <ignored.json>
  pnpm media:migrate:gcs copy --manifest <ignored.json>
  pnpm media:migrate:gcs verify --manifest <ignored.json>
  pnpm media:migrate:gcs apply --manifest <ignored.json>
  pnpm media:migrate:gcs verify-db --manifest <ignored.json>
  pnpm media:migrate:gcs rollback --manifest <ignored.json>

Required environment:
  DATABASE_URL, GOOGLE_CLOUD_PROJECT, GCS_BUCKET
  SOURCE_CLOUDINARY_CLOUD_NAME (inventory only)
  Application Default Credentials (copy/verify only)

Every entity binding gets a distinct immutable GCS object. No command deletes
Cloudinary or GCS objects.`);
}

async function loadManifest(path: string) {
  const manifest = JSON.parse(
    await readFile(path, 'utf8'),
  ) as NewsMediaMigrationManifest;
  validateNewsMediaManifest(manifest);
  return manifest;
}

async function saveManifest(
  path: string,
  manifest: NewsMediaMigrationManifest,
) {
  validateNewsMediaManifest(manifest);
  const temp = `${path}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(manifest, null, 2)}\n`, {
    mode: 0o600,
  });
  await rename(temp, path);
}

async function withManifestLock<T>(path: string, run: () => Promise<T>) {
  const lockPath = `${path}.lock`;
  let lock: FileHandle;
  try {
    lock = await open(lockPath, 'wx', 0o600);
    await lock.writeFile(
      `${JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() })}\n`,
    );
  } catch (error) {
    throw new Error(`Migration lock exists or cannot be created: ${lockPath}`, {
      cause: error,
    });
  }
  try {
    return await run();
  } finally {
    await lock.close();
    await rm(lockPath, { force: true });
  }
}

function prismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: requiredEnv('DATABASE_URL') }),
  });
}

function storageClient() {
  return new Storage({
    projectId: requiredEnv('GOOGLE_CLOUD_PROJECT'),
    userAgent: USER_AGENT,
  });
}

async function loadArticles(prisma: PrismaClient): Promise<NewsMediaArticle[]> {
  return prisma.newsArticle.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      coverImageUrl: true,
      translations: {
        orderBy: { id: 'asc' },
        select: { id: true, locale: true, content: true },
      },
    },
  });
}

function metadataRecord(metadata: FileMetadata) {
  return (metadata.metadata ?? {}) as Record<string, string | undefined>;
}

async function fetchOwnedImage(
  initialUrl: string,
  cloudName: string,
): Promise<Awaited<ReturnType<typeof validateNewsImage>>> {
  let url = initialUrl;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!isOwnedCloudinaryNewsUrl(url, cloudName))
      throw new Error('Source URL left the owned Cloudinary news prefix');
    const response = await fetch(url, { redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirects === MAX_REDIRECTS)
        throw new Error('Invalid or excessive source redirect');
      url = new URL(location, url).toString();
      continue;
    }
    if (!response.ok)
      throw new Error(`Source image request failed: HTTP ${response.status}`);
    const declaredLength = Number(response.headers.get('content-length') ?? 0);
    if (declaredLength > MAX_NEWS_IMAGE_BYTES)
      throw new Error('Source image exceeds 20 MB');
    const buffer = Buffer.from(await response.arrayBuffer());
    const mimetype = response.headers
      .get('content-type')
      ?.split(';', 1)[0]
      .trim();
    if (!mimetype) throw new Error('Source image has no content type');
    return validateNewsImage({ buffer, mimetype, size: buffer.length });
  }
  throw new Error('Source image redirect loop');
}

async function inspectTarget(
  bucket: ReturnType<Storage['bucket']>,
  manifest: NewsMediaMigrationManifest,
  entry: NewsMediaMigrationEntry,
  expectedSha256?: string,
) {
  const file = bucket.file(entry.targetObject);
  const [metadata] = await file.getMetadata();
  const [contents] = await file.download({ validation: 'crc32c' });
  const digest = sha256(contents);
  assertMigrationObjectMetadata(
    manifest,
    entry,
    metadataRecord(metadata),
    expectedSha256 ?? digest,
  );
  if (expectedSha256 && digest !== expectedSha256)
    throw new Error(`GCS object SHA-256 mismatch: ${entry.entityKey}`);
  if (!metadata.generation || !metadata.crc32c || !metadata.contentType)
    throw new Error(`GCS verification metadata missing: ${entry.entityKey}`);
  if (Number(metadata.size) !== contents.length)
    throw new Error(`GCS object byte count mismatch: ${entry.entityKey}`);
  await validateNewsImage({
    buffer: contents,
    mimetype: metadata.contentType,
    size: contents.length,
  });
  return {
    bytes: contents.length,
    sha256: digest,
    generation: String(metadata.generation),
    crc32c: String(metadata.crc32c),
    contentType: metadata.contentType,
  };
}

async function inventory(path: string) {
  const prisma = prismaClient();
  try {
    const manifest = buildNewsMediaManifest(await loadArticles(prisma), {
      migrationId: randomUUID(),
      createdAt: new Date().toISOString(),
      sourceCloudName: requiredEnv('SOURCE_CLOUDINARY_CLOUD_NAME'),
      targetBucketName: requiredEnv('GCS_BUCKET'),
    });
    try {
      await open(path, 'wx', 0o600).then(async (file) => {
        try {
          await file.writeFile(`${JSON.stringify(manifest, null, 2)}\n`);
        } finally {
          await file.close();
        }
      });
    } catch (error) {
      throw new Error(`Refusing to overwrite inventory manifest: ${path}`, {
        cause: error,
      });
    }
    console.log(
      `Inventory complete: ${manifest.entries.length} entity bindings across ${new Set(manifest.entries.map((entry) => entry.articleId)).size} articles`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function copy(path: string) {
  await withManifestLock(path, async () => {
    const manifest = await loadManifest(path);
    if (manifest.targetBucketName !== requiredEnv('GCS_BUCKET'))
      throw new Error('GCS_BUCKET does not match the manifest');
    const bucket = storageClient().bucket(manifest.targetBucketName);
    const sourceCache = new Map<
      string,
      Awaited<ReturnType<typeof validateNewsImage>>
    >();
    let copied = 0;
    for (const entry of manifest.entries) {
      if (entry.state === 'verified' || entry.state === 'applied') continue;
      let image = sourceCache.get(entry.sourceUrl);
      if (!image) {
        image = await fetchOwnedImage(
          entry.sourceUrl,
          manifest.sourceCloudName,
        );
        sourceCache.set(entry.sourceUrl, image);
      }
      const digest = sha256(image.buffer);
      const file = bucket.file(entry.targetObject);
      try {
        await file.save(image.buffer, {
          resumable: false,
          validation: 'crc32c',
          preconditionOpts: { ifGenerationMatch: 0 },
          metadata: {
            contentType: image.contentType,
            cacheControl: 'public, max-age=31536000, immutable',
            metadata: migrationObjectMetadata(manifest, entry, digest),
          },
        });
      } catch (error) {
        if ((error as { code?: number }).code !== 412) throw error;
      }
      entry.copied = await inspectTarget(bucket, manifest, entry, digest);
      entry.state = 'copied';
      await saveManifest(path, manifest);
      copied += 1;
    }
    console.log(`Copy complete: ${copied} bindings copied/resumed`);
  });
}

async function verify(path: string) {
  await withManifestLock(path, async () => {
    const manifest = await loadManifest(path);
    if (manifest.targetBucketName !== requiredEnv('GCS_BUCKET'))
      throw new Error('GCS_BUCKET does not match the manifest');
    const bucket = storageClient().bucket(manifest.targetBucketName);
    let verified = 0;
    for (const entry of manifest.entries) {
      if (entry.state === 'applied') continue;
      if (!entry.copied)
        throw new Error(`Binding has not been copied: ${entry.entityKey}`);
      const observed = await inspectTarget(
        bucket,
        manifest,
        entry,
        entry.copied.sha256,
      );
      if (
        observed.bytes !== entry.copied.bytes ||
        observed.generation !== entry.copied.generation ||
        observed.crc32c !== entry.copied.crc32c ||
        observed.contentType !== entry.copied.contentType
      )
        throw new Error(`GCS object changed after copy: ${entry.entityKey}`);
      entry.state = 'verified';
      await saveManifest(path, manifest);
      verified += 1;
    }
    console.log(`Verification complete: ${verified} bindings verified`);
  });
}

async function persistUpdates(
  prisma: PrismaClient,
  current: NewsMediaArticle[],
  updates: NewsMediaArticleUpdate[],
) {
  const currentById = new Map(current.map((article) => [article.id, article]));
  await prisma.$transaction(async (transaction) => {
    for (const update of updates) {
      const before = currentById.get(update.id);
      if (!before) throw new Error(`Article disappeared: ${update.id}`);
      if (before.coverImageUrl !== update.coverImageUrl) {
        const articleResult = await transaction.newsArticle.updateMany({
          where: { id: update.id, coverImageUrl: before.coverImageUrl },
          data: { coverImageUrl: update.coverImageUrl },
        });
        if (articleResult.count !== 1)
          throw new Error(`Concurrent article change detected: ${update.id}`);
      }
      for (const translation of update.translations) {
        const oldTranslation = before.translations.find(
          (candidate) => candidate.id === translation.id,
        );
        if (!oldTranslation)
          throw new Error(`Translation disappeared: ${translation.id}`);
        if (oldTranslation.content === translation.content) continue;
        const translationResult =
          await transaction.newsArticleTranslation.updateMany({
            where: { id: translation.id, content: oldTranslation.content },
            data: { content: translation.content },
          });
        if (translationResult.count !== 1)
          throw new Error(
            `Concurrent translation change detected: ${translation.id}`,
          );
      }
    }
  });
}

async function applyOrRollback(path: string, direction: 'apply' | 'rollback') {
  await withManifestLock(path, async () => {
    const manifest = await loadManifest(path);
    const prisma = prismaClient();
    try {
      if (direction === 'apply') {
        if (manifest.targetBucketName !== requiredEnv('GCS_BUCKET'))
          throw new Error('GCS_BUCKET does not match the manifest');
        const bucket = storageClient().bucket(manifest.targetBucketName);
        for (const entry of manifest.entries) {
          if (!entry.copied)
            throw new Error(`Binding has not been copied: ${entry.entityKey}`);
          const observed = await inspectTarget(
            bucket,
            manifest,
            entry,
            entry.copied.sha256,
          );
          if (
            observed.bytes !== entry.copied.bytes ||
            observed.generation !== entry.copied.generation ||
            observed.crc32c !== entry.copied.crc32c ||
            observed.contentType !== entry.copied.contentType
          )
            throw new Error(
              `GCS object changed before apply: ${entry.entityKey}`,
            );
        }
      }
      const current = await loadArticles(prisma);
      const updates =
        direction === 'apply'
          ? planNewsMediaApply(current, manifest)
          : planNewsMediaRollback(current, manifest);
      await persistUpdates(prisma, current, updates);
      const observed = await loadArticles(prisma);
      const expected =
        direction === 'apply'
          ? planNewsMediaApply(observed, manifest)
          : planNewsMediaRollback(observed, manifest);
      const expectedIds = new Set(expected.map(({ id }) => id));
      const affectedObserved = observed.filter(({ id }) => expectedIds.has(id));
      if (JSON.stringify(affectedObserved) !== JSON.stringify(expected))
        throw new Error(`Database ${direction} verification failed`);
      manifest.entries.forEach(
        (entry) =>
          (entry.state = direction === 'apply' ? 'applied' : 'verified'),
      );
      await saveManifest(path, manifest);
      console.log(
        `${direction === 'apply' ? 'Apply' : 'Rollback'} complete: ${manifest.entries.length} bindings`,
      );
    } finally {
      await prisma.$disconnect();
    }
  });
}

async function verifyDatabase(path: string) {
  const manifest = await loadManifest(path);
  if (manifest.entries.some((entry) => entry.state !== 'applied'))
    throw new Error('Manifest is not fully applied');
  const prisma = prismaClient();
  try {
    const current = await loadArticles(prisma);
    const expected = planNewsMediaApply(current, manifest);
    const expectedIds = new Set(expected.map(({ id }) => id));
    const affectedCurrent = current.filter(({ id }) => expectedIds.has(id));
    if (JSON.stringify(affectedCurrent) !== JSON.stringify(expected))
      throw new Error('Database does not match the one-to-one GCS manifest');
    console.log(
      `Database verification complete: ${manifest.entries.length} bindings`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const command = process.argv[2];
  if (!command || command === '--help' || command === '-h') {
    help();
    return;
  }
  if (!COMMANDS.has(command)) throw new Error(`Unknown command: ${command}`);
  const manifestPath = resolve(option('manifest') ?? '');
  if (!option('manifest')) throw new Error('--manifest is required');
  if (command === 'inventory') return inventory(manifestPath);
  if (command === 'copy') return copy(manifestPath);
  if (command === 'verify') return verify(manifestPath);
  if (command === 'apply') return applyOrRollback(manifestPath, 'apply');
  if (command === 'verify-db') return verifyDatabase(manifestPath);
  return applyOrRollback(manifestPath, 'rollback');
}

void main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'News media migration failed',
  );
  process.exitCode = 1;
});
