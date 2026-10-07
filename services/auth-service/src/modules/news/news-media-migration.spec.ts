import {
  buildNewsMediaManifest,
  migrationObjectMetadata,
  assertMigrationObjectMetadata,
  planNewsMediaApply,
  planNewsMediaRollback,
  validateNewsMediaManifest,
} from './news-media-migration';

const source =
  'https://res.cloudinary.com/demo/image/upload/v1/vnru/news/shared.webp';
const articles = [
  {
    id: 'article-a',
    coverImageUrl: source,
    translations: [
      {
        id: 'translation-a-vi',
        locale: 'VI',
        content: `Đầu ![A](${source}) giữa ![B](${source}) cuối`,
      },
    ],
  },
  {
    id: 'article-b',
    coverImageUrl: source,
    translations: [],
  },
];

describe('news media migration mapping', () => {
  const manifest = buildNewsMediaManifest(articles, {
    migrationId: 'migration-1',
    createdAt: '2026-10-06T20:00:00.000Z',
    sourceCloudName: 'demo',
    targetBucketName: 'vnru-public-media',
  });

  it('maps every entity occurrence to one distinct target object', () => {
    expect(manifest.entries).toHaveLength(4);
    expect(new Set(manifest.entries.map((entry) => entry.entityKey)).size).toBe(
      4,
    );
    expect(
      new Set(manifest.entries.map((entry) => entry.targetObject)).size,
    ).toBe(4);
    expect(manifest.entries.every((entry) => entry.sourceUrl === source)).toBe(
      true,
    );
    expect(() => validateNewsMediaManifest(manifest)).not.toThrow();
  });

  it('plans exact cover and inline replacements only after verification', () => {
    const verified = {
      ...manifest,
      entries: manifest.entries.map((entry) => ({
        ...entry,
        state: 'verified' as const,
        copied: {
          bytes: 100,
          sha256: 'a'.repeat(64),
          generation: '1',
          crc32c: 'AAAAAA==',
          contentType: 'image/webp',
        },
      })),
    };

    const updates = planNewsMediaApply(articles, verified);

    expect(updates).toHaveLength(2);
    expect(updates[0].coverImageUrl).toContain('/article-a/cover/');
    expect(updates[0].translations[0].content).toContain(
      '/article-a/translation-a-vi/inline-0/',
    );
    expect(updates[0].translations[0].content).toContain(
      '/article-a/translation-a-vi/inline-1/',
    );
    expect(updates[1].coverImageUrl).toContain('/article-b/cover/');
    expect(updates[0].coverImageUrl).not.toBe(updates[1].coverImageUrl);
    expect(planNewsMediaApply(updates, verified)).toEqual(updates);
    expect(planNewsMediaRollback(updates, verified)).toEqual(articles);
  });

  it('aborts when content changed after inventory', () => {
    const verified = {
      ...manifest,
      entries: manifest.entries.map((entry) => ({
        ...entry,
        state: 'verified' as const,
        copied: {
          bytes: 100,
          sha256: 'a'.repeat(64),
          generation: '1',
          crc32c: 'AAAAAA==',
          contentType: 'image/webp',
        },
      })),
    };
    const changed = structuredClone(articles);
    changed[0].translations[0].content += ' changed';

    expect(() => planNewsMediaApply(changed, verified)).toThrow(
      /changed after inventory/,
    );
  });

  it('rejects target-object collisions', () => {
    const invalid = structuredClone(manifest);
    invalid.entries[1].targetObject = invalid.entries[0].targetObject;

    expect(() => validateNewsMediaManifest(invalid)).toThrow(
      /Duplicate target object/,
    );
  });

  it('rejects a target object that no longer matches its entity binding', () => {
    const invalid = structuredClone(manifest);
    invalid.entries[0].targetObject = 'vnru/news/article-b/cover/tampered.webp';
    invalid.entries[0].targetUrl =
      'https://storage.googleapis.com/vnru-public-media/vnru/news/article-b/cover/tampered.webp';

    expect(() => validateNewsMediaManifest(invalid)).toThrow(
      /Target object mismatch/,
    );
  });

  it('rejects a verified entry without copied-object evidence', () => {
    const invalid = structuredClone(manifest);
    invalid.entries[0].state = 'verified';

    expect(() => validateNewsMediaManifest(invalid)).toThrow(
      /Copied-object evidence missing/,
    );
  });

  it('binds a copied object to exactly one manifest entity', () => {
    const entry = manifest.entries[0];
    const metadata = migrationObjectMetadata(manifest, entry, 'b'.repeat(64));

    expect(() =>
      assertMigrationObjectMetadata(manifest, entry, metadata, 'b'.repeat(64)),
    ).not.toThrow();
    expect(() =>
      assertMigrationObjectMetadata(
        manifest,
        manifest.entries[1],
        metadata,
        'b'.repeat(64),
      ),
    ).toThrow(/metadata mismatch/);
  });

  it('fails inventory instead of silently skipping an unowned Cloudinary URL', () => {
    expect(() =>
      buildNewsMediaManifest(
        [
          {
            id: 'foreign',
            coverImageUrl:
              'https://res.cloudinary.com/other/image/upload/v1/vnru/news/x.webp',
            translations: [],
          },
        ],
        {
          migrationId: 'migration-2',
          createdAt: '2026-10-06T20:00:00.000Z',
          sourceCloudName: 'demo',
          targetBucketName: 'vnru-public-media',
        },
      ),
    ).toThrow(/Unowned Cloudinary cover URL/);
  });
});
