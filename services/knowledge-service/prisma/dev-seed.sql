-- Idempotent dev seed for knowledge-service
-- Safe to run multiple times (INSERT … ON CONFLICT DO NOTHING)

-- Topics
INSERT INTO "KnowledgeTopic" (id, slug, labels)
VALUES
  ('a0000000-0000-4000-8000-000000000001', 'artificial-intelligence', '{"en":"Artificial Intelligence","vi":"Trí tuệ nhân tạo","ru":"Искусственный интеллект"}'),
  ('a0000000-0000-4000-8000-000000000002', 'materials-science', '{"en":"Materials Science","vi":"Khoa học vật liệu","ru":"Материаловедение"}')
ON CONFLICT (id) DO NOTHING;

-- PUBLIC publication (visible in list + detail)
INSERT INTO "Publication" (id, title, abstract, type, language, year, country, "organizationRef", visibility, version, "createdAt", "updatedAt")
VALUES (
  'b0000000-0000-4000-8000-000000000001',
  'Bilateral AI Cooperation Framework',
  'A comprehensive framework for VN-RU artificial intelligence research cooperation.',
  'ARTICLE', 'en', 2026, 'VN', 'org-seed-vn', 'PUBLIC', 1,
  '2026-01-15T00:00:00Z', '2026-01-15T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- PRIVATE publication (must NOT appear in list or detail)
INSERT INTO "Publication" (id, title, abstract, type, language, year, country, "organizationRef", visibility, version, "createdAt", "updatedAt")
VALUES (
  'b0000000-0000-4000-8000-000000000002',
  'Draft Internal Review Notes',
  'Internal draft — not approved for public discovery.',
  'PREPRINT', 'ru', 2026, 'RU', 'org-seed-ru', 'PRIVATE', 1,
  '2026-02-01T00:00:00Z', '2026-02-01T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Second PUBLIC publication
INSERT INTO "Publication" (id, title, abstract, type, language, year, country, "organizationRef", visibility, version, "createdAt", "updatedAt")
VALUES (
  'b0000000-0000-4000-8000-000000000003',
  'Advanced Materials for Bilateral Projects',
  'Research on novel materials for joint VN-RU industrial applications.',
  'ARTICLE', 'vi', 2025, 'RU', 'org-seed-ru', 'PUBLIC', 1,
  '2025-11-20T00:00:00Z', '2025-11-20T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Authors
INSERT INTO "PublicationAuthorRef" (id, "publicationId", "expertRef", "displayOrder")
VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'expert-vn-001', 1),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'expert-ru-001', 2),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'expert-ru-002', 1),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000003', 'expert-vn-002', 1)
ON CONFLICT (id) DO NOTHING;

-- Topic links
INSERT INTO "PublicationTopic" ("publicationId", "topicId")
VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002')
ON CONFLICT ("publicationId", "topicId") DO NOTHING;
