-- Seed script for VN-RU organization-service

-- 1. Insert Organizations (VN and RU public organizations)
INSERT INTO "Organization" ("id", "name", "country", "visibility", "version", "createdAt", "updatedAt")
VALUES 
  ('e1d5a7d3-7d1a-47ef-b203-d2d89f7db387', 'Vietnam National University', 'VN', 'PUBLIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a5b7d6e4-8d4e-4fdf-9753-1579b248a3e7', 'Lomonosov Moscow State University', 'RU', 'PUBLIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "country" = EXCLUDED."country",
  "visibility" = EXCLUDED."visibility",
  "updatedAt" = CURRENT_TIMESTAMP;

-- 2. Insert Expertise Areas (with multilingual labels vi/ru/en)
INSERT INTO "ExpertiseArea" ("id", "slug", "labels")
VALUES
  ('b001a1a1-1111-4444-8888-abcdefabcdef', 'ai-machine-learning', '{"vi": "Trí tuệ nhân tạo & Học máy", "en": "Artificial Intelligence & Machine Learning", "ru": "Искусственный интеллект и машинное обучение"}'::jsonb),
  ('b002a2a2-2222-4444-8888-abcdefabcdef', 'material-science', '{"vi": "Khoa học vật liệu", "en": "Material Science", "ru": "Материаловедение"}'::jsonb),
  ('b003a3a3-3333-4444-8888-abcdefabcdef', 'nuclear-physics', '{"vi": "Vật lý hạt nhân", "en": "Nuclear Physics", "ru": "Ядерная физика"}'::jsonb)
ON CONFLICT ("id") DO UPDATE SET
  "slug" = EXCLUDED."slug",
  "labels" = EXCLUDED."labels";

-- 3. Insert Researcher Profiles (at least 3 public, 1 private)
INSERT INTO "ResearcherProfile" ("id", "userRef", "displayName", "bio", "country", "organizationId", "language", "visibility", "version", "createdAt", "updatedAt")
VALUES
  ('c001e1e1-1111-4444-8888-fedcba987654', 'user-ref-nv-a', 'Nguyen Van A', 'AI researcher at VNU', 'VN', 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387', 'vi', 'PUBLIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('c002e2e2-2222-4444-8888-fedcba987654', 'user-ref-d-petrov', 'Dmitry Petrov', 'AI professor at MSU', 'RU', 'a5b7d6e4-8d4e-4fdf-9753-1579b248a3e7', 'ru', 'PUBLIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('c003e3e3-3333-4444-8888-fedcba987654', 'user-ref-tt-b', 'Tran Thi B', 'Nuclear physics researcher', 'VN', 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387', 'vi', 'PUBLIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('c004e4e4-4444-4444-8888-fedcba987654', 'user-ref-e-sidorova', 'Elena Sidorova', 'Private R&D expert', 'RU', 'a5b7d6e4-8d4e-4fdf-9753-1579b248a3e7', 'en', 'PRIVATE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET
  "userRef" = EXCLUDED."userRef",
  "displayName" = EXCLUDED."displayName",
  "bio" = EXCLUDED."bio",
  "country" = EXCLUDED."country",
  "organizationId" = EXCLUDED."organizationId",
  "language" = EXCLUDED."language",
  "visibility" = EXCLUDED."visibility",
  "updatedAt" = CURRENT_TIMESTAMP;

-- 4. Insert Researcher Expertise Links
INSERT INTO "ResearcherExpertise" ("profileId", "expertiseId")
VALUES
  ('c001e1e1-1111-4444-8888-fedcba987654', 'b001a1a1-1111-4444-8888-abcdefabcdef'),
  ('c001e1e1-1111-4444-8888-fedcba987654', 'b002a2a2-2222-4444-8888-abcdefabcdef'),
  ('c002e2e2-2222-4444-8888-fedcba987654', 'b001a1a1-1111-4444-8888-abcdefabcdef'),
  ('c002e2e2-2222-4444-8888-fedcba987654', 'b003a3a3-3333-4444-8888-abcdefabcdef'),
  ('c003e3e3-3333-4444-8888-fedcba987654', 'b003a3a3-3333-4444-8888-abcdefabcdef'),
  ('c004e4e4-4444-4444-8888-fedcba987654', 'b002a2a2-2222-4444-8888-abcdefabcdef')
ON CONFLICT ("profileId", "expertiseId") DO NOTHING;
