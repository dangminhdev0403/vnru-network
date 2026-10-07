import { createHash } from 'node:crypto';
import { extname } from 'node:path';
import { publicGcsUrl } from './news-media.service';

export type MigrationEntryState = 'pending' | 'copied' | 'verified' | 'applied';

export interface NewsMediaArticle {
  id: string;
  coverImageUrl: string | null;
  translations: Array<{ id: string; locale: string; content: string }>;
}

export interface NewsMediaMigrationEntry {
  entityKey: string;
  articleId: string;
  binding:
    | { kind: 'cover' }
    | {
        kind: 'inline';
        translationId: string;
        locale: string;
        occurrence: number;
        start: number;
        end: number;
      };
  sourceUrl: string;
  sourceUrlSha256: string;
  sourceFieldSha256: string;
  targetFieldSha256: string;
  targetObject: string;
  targetUrl: string;
  state: MigrationEntryState;
  copied?: {
    bytes: number;
    sha256: string;
    generation: string;
    crc32c: string;
    contentType: string;
  };
}

export interface NewsMediaMigrationManifest {
  version: 1;
  migrationId: string;
  createdAt: string;
  sourceCloudName: string;
  targetBucketName: string;
  mappingSha256: string;
  entries: NewsMediaMigrationEntry[];
}

export interface NewsMediaArticleUpdate {
  id: string;
  coverImageUrl: string | null;
  translations: Array<{ id: string; locale: string; content: string }>;
}

const sha256 = (value: string | Buffer) =>
  createHash('sha256').update(value).digest('hex');

export function isOwnedCloudinaryNewsUrl(url: string, cloudName: string) {
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== 'res.cloudinary.com'
    )
      return false;
    return cloudName
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .some((name) => {
        const prefix = `/${name}/image/upload/`;
        return (
          parsed.pathname.startsWith(prefix) &&
          /^(?:v\d+\/)?vnru\/news\//.test(
            decodeURIComponent(parsed.pathname.slice(prefix.length)),
          )
        );
      });
  } catch {
    return false;
  }
}

function isCloudinaryUrl(url: string) {
  try {
    return new URL(url).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

function extensionFor(url: string) {
  const extension = extname(new URL(url).pathname).toLowerCase();
  return /^\.(?:jpe?g|png|webp)$/.test(extension) ? extension : '.bin';
}

function mappingDigest(entries: NewsMediaMigrationEntry[]) {
  return sha256(
    JSON.stringify(
      entries.map(
        ({
          entityKey,
          binding,
          sourceUrl,
          sourceUrlSha256,
          sourceFieldSha256,
          targetFieldSha256,
          targetObject,
          targetUrl,
        }) => ({
          entityKey,
          binding,
          sourceUrl,
          sourceUrlSha256,
          sourceFieldSha256,
          targetFieldSha256,
          targetObject,
          targetUrl,
        }),
      ),
    ),
  );
}

function targetFor(
  bucketName: string,
  articleId: string,
  bindingPath: string,
  entityKey: string,
  sourceUrl: string,
) {
  const objectName = `vnru/news/${articleId}/${bindingPath}/${sha256(entityKey).slice(0, 20)}${extensionFor(sourceUrl)}`;
  return { objectName, url: publicGcsUrl(bucketName, objectName) };
}

function planInlineField(
  content: string,
  entries: NewsMediaMigrationEntry[],
  direction: 'apply' | 'rollback',
) {
  const positions = entries.map((entry) => {
    if (entry.binding.kind !== 'inline') return { entry, start: -1 };
    const sourceStart = entry.binding.start;
    const precedingLengthDelta = entries
      .filter(
        (candidate) =>
          candidate.binding.kind === 'inline' &&
          candidate.binding.start < sourceStart,
      )
      .reduce(
        (total, candidate) =>
          total + candidate.targetUrl.length - candidate.sourceUrl.length,
        0,
      );
    return {
      entry,
      start:
        direction === 'apply'
          ? entry.binding.start
          : entry.binding.start + precedingLengthDelta,
    };
  });

  let output = content;
  for (const { entry, start } of positions.sort((a, b) => b.start - a.start)) {
    if (entry.binding.kind !== 'inline') continue;
    const expected = direction === 'apply' ? entry.sourceUrl : entry.targetUrl;
    const replacement =
      direction === 'apply' ? entry.targetUrl : entry.sourceUrl;
    if (output.slice(start, start + expected.length) !== expected)
      throw new Error(
        `Inline occurrence changed after inventory: ${entry.entityKey}`,
      );
    output =
      output.slice(0, start) +
      replacement +
      output.slice(start + expected.length);
  }
  return output;
}

export function buildNewsMediaManifest(
  articles: NewsMediaArticle[],
  input: {
    migrationId: string;
    createdAt: string;
    sourceCloudName: string;
    targetBucketName: string;
  },
): NewsMediaMigrationManifest {
  const entries: NewsMediaMigrationEntry[] = [];
  for (const article of articles) {
    if (
      article.coverImageUrl &&
      isCloudinaryUrl(article.coverImageUrl) &&
      !isOwnedCloudinaryNewsUrl(article.coverImageUrl, input.sourceCloudName)
    )
      throw new Error(`Unowned Cloudinary cover URL: article:${article.id}`);
    if (
      article.coverImageUrl &&
      isOwnedCloudinaryNewsUrl(article.coverImageUrl, input.sourceCloudName)
    ) {
      const entityKey = `article:${article.id}:cover`;
      const target = targetFor(
        input.targetBucketName,
        article.id,
        'cover',
        entityKey,
        article.coverImageUrl,
      );
      entries.push({
        entityKey,
        articleId: article.id,
        binding: { kind: 'cover' },
        sourceUrl: article.coverImageUrl,
        sourceUrlSha256: sha256(article.coverImageUrl),
        sourceFieldSha256: sha256(article.coverImageUrl),
        targetFieldSha256: sha256(target.url),
        targetObject: target.objectName,
        targetUrl: target.url,
        state: 'pending',
      });
    }

    for (const translation of article.translations) {
      const pattern = /https:\/\/res\.cloudinary\.com\/[^\s)'"<>]+/g;
      let occurrence = 0;
      for (const match of translation.content.matchAll(pattern)) {
        const sourceUrl = match[0];
        if (!isOwnedCloudinaryNewsUrl(sourceUrl, input.sourceCloudName))
          throw new Error(
            `Unowned Cloudinary inline URL: article:${article.id}:translation:${translation.id}`,
          );
        const start = match.index;
        const entityKey = `article:${article.id}:translation:${translation.id}:${translation.locale}:inline:${occurrence}`;
        const target = targetFor(
          input.targetBucketName,
          article.id,
          `${translation.id}/inline-${occurrence}`,
          entityKey,
          sourceUrl,
        );
        entries.push({
          entityKey,
          articleId: article.id,
          binding: {
            kind: 'inline',
            translationId: translation.id,
            locale: translation.locale,
            occurrence,
            start,
            end: start + sourceUrl.length,
          },
          sourceUrl,
          sourceUrlSha256: sha256(sourceUrl),
          sourceFieldSha256: sha256(translation.content),
          targetFieldSha256: '',
          targetObject: target.objectName,
          targetUrl: target.url,
          state: 'pending',
        });
        occurrence += 1;
      }
    }
  }

  for (const translation of articles.flatMap(
    (article) => article.translations,
  )) {
    const inlineEntries = entries.filter(
      (entry) =>
        entry.binding.kind === 'inline' &&
        entry.binding.translationId === translation.id,
    );
    if (!inlineEntries.length) continue;
    const targetFieldSha256 = sha256(
      planInlineField(translation.content, inlineEntries, 'apply'),
    );
    inlineEntries.forEach(
      (entry) => (entry.targetFieldSha256 = targetFieldSha256),
    );
  }

  const manifest: NewsMediaMigrationManifest = {
    version: 1,
    ...input,
    mappingSha256: mappingDigest(entries),
    entries,
  };
  validateNewsMediaManifest(manifest);
  return manifest;
}

export function migrationObjectMetadata(
  manifest: NewsMediaMigrationManifest,
  entry: NewsMediaMigrationEntry,
  contentSha256: string,
) {
  return {
    migrationId: manifest.migrationId,
    mappingSha256: manifest.mappingSha256,
    entityKeySha256: sha256(entry.entityKey),
    sourceUrlSha256: entry.sourceUrlSha256,
    contentSha256,
  };
}

export function assertMigrationObjectMetadata(
  manifest: NewsMediaMigrationManifest,
  entry: NewsMediaMigrationEntry,
  metadata: Record<string, string | undefined>,
  contentSha256: string,
) {
  const expected = migrationObjectMetadata(manifest, entry, contentSha256);
  if (Object.entries(expected).some(([key, value]) => metadata[key] !== value))
    throw new Error(`GCS object metadata mismatch: ${entry.entityKey}`);
}

export function validateNewsMediaManifest(
  manifest: NewsMediaMigrationManifest,
) {
  if (
    manifest.version !== 1 ||
    !manifest.migrationId ||
    !manifest.targetBucketName
  )
    throw new Error('Invalid news-media migration manifest');
  const entityKeys = new Set<string>();
  const targetObjects = new Set<string>();
  for (const entry of manifest.entries) {
    if (entityKeys.has(entry.entityKey))
      throw new Error(`Duplicate entity key: ${entry.entityKey}`);
    if (targetObjects.has(entry.targetObject))
      throw new Error(`Duplicate target object: ${entry.targetObject}`);
    if (entry.sourceUrlSha256 !== sha256(entry.sourceUrl))
      throw new Error(`Source URL hash mismatch: ${entry.entityKey}`);
    if (!entry.sourceFieldSha256 || !entry.targetFieldSha256)
      throw new Error(`Field hash missing: ${entry.entityKey}`);
    const bindingPath =
      entry.binding.kind === 'cover'
        ? 'cover'
        : `${entry.binding.translationId}/inline-${entry.binding.occurrence}`;
    const expectedTarget = targetFor(
      manifest.targetBucketName,
      entry.articleId,
      bindingPath,
      entry.entityKey,
      entry.sourceUrl,
    );
    if (entry.targetObject !== expectedTarget.objectName)
      throw new Error(`Target object mismatch: ${entry.entityKey}`);
    if (entry.targetUrl !== expectedTarget.url)
      throw new Error(`Target URL mismatch: ${entry.entityKey}`);
    if (entry.state === 'pending' && entry.copied)
      throw new Error(`Unexpected copied-object evidence: ${entry.entityKey}`);
    if (entry.state !== 'pending' && !entry.copied)
      throw new Error(`Copied-object evidence missing: ${entry.entityKey}`);
    if (
      entry.copied &&
      (!Number.isSafeInteger(entry.copied.bytes) ||
        entry.copied.bytes <= 0 ||
        !/^[a-f0-9]{64}$/.test(entry.copied.sha256) ||
        !entry.copied.generation ||
        !entry.copied.crc32c ||
        !/^image\/(?:jpeg|png|webp)$/.test(entry.copied.contentType))
    )
      throw new Error(`Copied-object evidence invalid: ${entry.entityKey}`);
    entityKeys.add(entry.entityKey);
    targetObjects.add(entry.targetObject);
  }
  if (manifest.mappingSha256 !== mappingDigest(manifest.entries))
    throw new Error('Manifest mapping hash mismatch');
}

function planState(
  articles: NewsMediaArticle[],
  manifest: NewsMediaMigrationManifest,
  direction: 'apply' | 'rollback',
): NewsMediaArticleUpdate[] {
  validateNewsMediaManifest(manifest);
  if (
    direction === 'apply' &&
    manifest.entries.some(
      (entry) => entry.state !== 'verified' && entry.state !== 'applied',
    )
  )
    throw new Error('Every media binding must be verified before apply');

  const current = new Map(articles.map((article) => [article.id, article]));
  const updates = new Map<string, NewsMediaArticleUpdate>();
  for (const entry of manifest.entries) {
    const article = current.get(entry.articleId);
    if (!article)
      throw new Error(`Article missing after inventory: ${entry.articleId}`);
    const update = updates.get(article.id) ?? {
      id: article.id,
      coverImageUrl: article.coverImageUrl,
      translations: article.translations.map(({ id, locale, content }) => ({
        id,
        locale,
        content,
      })),
    };
    updates.set(article.id, update);

    if (entry.binding.kind === 'cover') {
      if (
        update.coverImageUrl !== entry.sourceUrl &&
        update.coverImageUrl !== entry.targetUrl
      )
        throw new Error(`Cover changed after inventory: ${entry.entityKey}`);
      update.coverImageUrl =
        direction === 'apply' ? entry.targetUrl : entry.sourceUrl;
    }
  }

  for (const update of updates.values()) {
    for (const translation of update.translations) {
      const original = current
        .get(update.id)!
        .translations.find(({ id }) => id === translation.id)!.content;
      const inlineEntries = manifest.entries.filter(
        (entry) =>
          entry.binding.kind === 'inline' &&
          entry.binding.translationId === translation.id,
      );
      if (!inlineEntries.length) continue;
      const sourceHash = inlineEntries[0].sourceFieldSha256;
      const targetHash = inlineEntries[0].targetFieldSha256;
      if (
        inlineEntries.some(
          (entry) =>
            entry.sourceFieldSha256 !== sourceHash ||
            entry.targetFieldSha256 !== targetHash,
        )
      )
        throw new Error(`Inconsistent translation mapping: ${translation.id}`);
      const currentHash = sha256(original);
      if (currentHash !== sourceHash && currentHash !== targetHash)
        throw new Error(
          `Translation changed after inventory: ${translation.id}`,
        );
      if (direction === 'apply' && currentHash === sourceHash)
        translation.content = planInlineField(original, inlineEntries, 'apply');
      if (direction === 'rollback' && currentHash === targetHash)
        translation.content = planInlineField(
          original,
          inlineEntries,
          'rollback',
        );
    }
  }
  return [...updates.values()];
}

export const planNewsMediaApply = (
  articles: NewsMediaArticle[],
  manifest: NewsMediaMigrationManifest,
) => planState(articles, manifest, 'apply');

export const planNewsMediaRollback = (
  articles: NewsMediaArticle[],
  manifest: NewsMediaMigrationManifest,
) => planState(articles, manifest, 'rollback');
