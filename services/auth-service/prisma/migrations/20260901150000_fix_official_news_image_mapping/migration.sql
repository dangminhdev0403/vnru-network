-- Correct the legacy one-position title/image offset without overwriting later admin edits.
UPDATE "NewsArticle" AS article
SET "coverImageUrl" = mapping.desired_url
FROM (VALUES
  ('32f6f282-6ea5-405d-8ae6-33a14ef3d6a7'::uuid, '/images/news/article-1.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169200/vnru/news/official-edbe2e6d-a90d-4dc0-be56-098fae9b5936.webp', NULL),
  ('5d69bebe-11d8-4fba-8d65-b18b6b6212b2'::uuid, NULL, NULL, 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169200/vnru/news/official-edbe2e6d-a90d-4dc0-be56-098fae9b5936.webp'),
  ('8e81e1ca-a950-4626-80bd-919a8c514997'::uuid, NULL, NULL, NULL),
  ('295905b4-f579-44ab-80ea-8f913ee3eb98'::uuid, '/images/news/article-4.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169181/vnru/news/official-5365b1a1-06e3-4dd3-9e70-c172c9c555c5.webp', NULL),
  ('2bea57f8-c371-4669-81bd-aa54aa5e1b70'::uuid, '/images/news/article-5.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169196/vnru/news/official-cd567ac8-0de8-45d8-a46a-1c50be23e42d.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169181/vnru/news/official-5365b1a1-06e3-4dd3-9e70-c172c9c555c5.webp'),
  ('1211771c-0cd7-4e06-8dcc-0d2ecb304c7d'::uuid, '/images/news/article-6.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169183/vnru/news/official-53aff395-c1bc-4120-ae40-1a7c260aa11c.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169196/vnru/news/official-cd567ac8-0de8-45d8-a46a-1c50be23e42d.webp'),
  ('3f75f807-2de3-4ea3-8a28-00c1a9654d4d'::uuid, '/images/news/article-7.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169191/vnru/news/official-ae6ab3f0-9830-417e-9098-a8eca19c3102.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169183/vnru/news/official-53aff395-c1bc-4120-ae40-1a7c260aa11c.webp'),
  ('21a0365f-f637-4dcd-8d77-e936f6d5de6d'::uuid, NULL, NULL, 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169191/vnru/news/official-ae6ab3f0-9830-417e-9098-a8eca19c3102.webp'),
  ('9d079f17-13d6-46c0-8e0f-935f097aa45a'::uuid, '/images/news/article-9.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169193/vnru/news/official-b39014db-7d27-4e4a-abde-e1396cec3c2d.webp', NULL),
  ('2f1a0e18-5b23-4b33-87ed-eb4f307dbc98'::uuid, '/images/news/article-10.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169186/vnru/news/official-6137f058-127b-49ff-97c7-073a8e681cb4.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169193/vnru/news/official-b39014db-7d27-4e4a-abde-e1396cec3c2d.webp'),
  ('ddea75af-11de-463a-8f54-a76d085c3671'::uuid, '/images/news/article-11.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169185/vnru/news/official-5cc29b09-0150-41b1-9a7f-b781389200c4.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169186/vnru/news/official-6137f058-127b-49ff-97c7-073a8e681cb4.webp'),
  ('1405eb55-4e39-45a3-864d-b7811e72971a'::uuid, '/images/news/article-12.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169199/vnru/news/official-e1fb2be7-d8b6-4803-bf6c-2dc5a0097971.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169185/vnru/news/official-5cc29b09-0150-41b1-9a7f-b781389200c4.webp'),
  ('4792a35f-46ea-4950-8986-32a7e9daaaf6'::uuid, '/images/news/article-13.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169198/vnru/news/official-dac97b94-2f1c-43ef-8e76-6040c9bc030e.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169199/vnru/news/official-e1fb2be7-d8b6-4803-bf6c-2dc5a0097971.webp'),
  ('9e1c5c40-35ae-4973-8e2e-f2f659370862'::uuid, '/images/news/article-14.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169194/vnru/news/official-c057d936-19de-4e5a-929e-5563b279cb2f.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169198/vnru/news/official-dac97b94-2f1c-43ef-8e76-6040c9bc030e.webp'),
  ('8fd36b63-032c-4ebf-879a-703b5b3e9bbc'::uuid, '/images/news/article-15.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169192/vnru/news/official-af81d69d-ca59-4758-8542-b124aeeface4.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169194/vnru/news/official-c057d936-19de-4e5a-929e-5563b279cb2f.webp'),
  ('ddd290fa-5b55-4af4-80cf-dc3e21ce39ea'::uuid, '/images/news/article-16.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169180/vnru/news/official-50ad77b4-0ce6-45a6-9ed8-08258d23f44b.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169192/vnru/news/official-af81d69d-ca59-4758-8542-b124aeeface4.webp'),
  ('b766d173-0cc4-4f39-8874-2b6e0fdc7c2d'::uuid, '/images/news/article-17.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169188/vnru/news/official-622e9e38-0c5d-4a57-a7ce-9fafd05c6ae5.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169180/vnru/news/official-50ad77b4-0ce6-45a6-9ed8-08258d23f44b.webp'),
  ('cfd15548-33d4-4b49-8f93-d9d6853b3643'::uuid, '/images/news/article-18.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169189/vnru/news/official-6ee78612-9bb5-4b3d-89b9-84b8eb67ce1e.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169188/vnru/news/official-622e9e38-0c5d-4a57-a7ce-9fafd05c6ae5.webp'),
  ('8a71f41c-2e48-4941-8dc0-f1f2de00922f'::uuid, '/images/news/article-19.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169179/vnru/news/official-4c6bd669-1af1-443d-8723-b5acfcfaad58.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169189/vnru/news/official-6ee78612-9bb5-4b3d-89b9-84b8eb67ce1e.webp'),
  ('6b75ee49-10e0-4712-83af-efd8748faad5'::uuid, '/images/news/article-20.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169177/vnru/news/official-1fc011ef-db6d-4eb7-bbd9-cb47b64b2729.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169179/vnru/news/official-4c6bd669-1af1-443d-8723-b5acfcfaad58.webp'),
  ('93bdc093-9e2d-416a-8259-77bc0ad4ceb6'::uuid, NULL, NULL, 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169177/vnru/news/official-1fc011ef-db6d-4eb7-bbd9-cb47b64b2729.webp'),
  ('2eb7b019-67b7-4925-8524-c4abd7d18f6e'::uuid, NULL, NULL, NULL),
  ('243c2490-14a1-4944-8826-e7f3d537943a'::uuid, NULL, NULL, NULL),
  ('55786c7c-db1f-40da-86c9-3d0d17581059'::uuid, NULL, NULL, NULL),
  ('7e25179a-a43b-4bc1-8aa2-d2a27da1506e'::uuid, NULL, NULL, NULL),
  ('fe881501-a35c-4dca-84bc-9fc540412f37'::uuid, NULL, NULL, NULL),
  ('2336f8c0-7879-4ed4-86dd-939cfe1a01bc'::uuid, NULL, NULL, NULL),
  ('ff0bf0ef-ef73-4c26-8669-485b45d06c8f'::uuid, NULL, NULL, NULL),
  ('4fac3dc2-84c6-482f-8fde-c8a94fbe63f9'::uuid, NULL, NULL, NULL),
  ('858e06cd-cfbb-4169-8546-ea01633d3e49'::uuid, NULL, NULL, NULL),
  ('67356ac0-2781-4cef-83f3-b638d71f72f8'::uuid, '/images/news/article-31.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169190/vnru/news/official-761046d1-84ae-4c0c-81bf-668e6cf12bd3.webp', NULL),
  ('1653d17c-75bf-4fe4-8086-b551124fa089'::uuid, '/images/news/article-32.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169176/vnru/news/official-1d2dc0c8-8651-4bfd-abf0-377c756e1338.webp', 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169190/vnru/news/official-761046d1-84ae-4c0c-81bf-668e6cf12bd3.webp'),
  ('0ea613f4-9545-43ba-8f87-6bcdffda480f'::uuid, NULL, NULL, 'https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169176/vnru/news/official-1d2dc0c8-8651-4bfd-abf0-377c756e1338.webp'),
  ('49aa2ed1-7f92-417f-82b1-8612629bb567'::uuid, NULL, NULL, NULL),
  ('490df612-cb73-4da5-818b-b50b8b6e765d'::uuid, NULL, NULL, NULL),
  ('48f30c1b-4754-4da5-8731-5b7994c944a5'::uuid, NULL, NULL, NULL),
  ('78a2473a-82ed-4f5a-87b5-68cd17522c3f'::uuid, NULL, NULL, NULL),
  ('26769c91-f090-4de9-8e67-a23aea8d782b'::uuid, NULL, NULL, NULL),
  ('d8335d5b-2b26-4307-8ebf-176d7d4e76c0'::uuid, NULL, NULL, NULL),
  ('3f3246c0-a1b4-454a-8733-cc7e1641d741'::uuid, NULL, NULL, NULL)
) AS mapping(id, expected_local_url, expected_cloud_url, desired_url)
WHERE article.id = mapping.id
  AND (
    article."coverImageUrl" IS NOT DISTINCT FROM mapping.expected_local_url
    OR article."coverImageUrl" IS NOT DISTINCT FROM mapping.expected_cloud_url
  );
