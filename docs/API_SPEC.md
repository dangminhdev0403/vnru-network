# Module 1 API Contract Policy

The current HTTP contract is owned by `auth-service`. Controllers and exported OpenAPI, when generated, are the runtime source of truth.

Implemented API families:

- `/api/v1/auth/*`: OIDC exchange, current session, logout and active-context switching.
- `/api/v1/auth/profile`: application-owned member profile.
- `/api/v1/auth/sessions/*`: session listing and revocation.
- `/api/v1/admin/users/*`: identity administration.
- `/api/v1/admin/roles/*`: role and permission administration.
- `/api/v1/admin/role-assignments/*`: assignment administration.
- `POST /api/v1/membership-applications`: public membership application intake. Stores a normalized `PENDING` application; never creates a user or role assignment.
- `GET /api/v1/news`: public news feed; returns `{ items, total }`; supports bounded `limit`/`offset`, `locale`, `featured`, `category`, repeated `contentType`, `q`, `scope`, and `period` filters. Filtering/search/sort happen before pagination in the backend.
- `GET /api/v1/news/:id`: public article with VI fallback.
- `/api/v1/admin/news/*`: authenticated article create/read/update/delete operations authorized by `content.article.*` capabilities; delete reuses `content.article.update`.
- `GET /api/v1/admin/news`: bounded admin list; `GET /api/v1/admin/news/:id` returns all translations for editing.
- `POST /api/v1/admin/news/media`: authenticated multipart image upload (`file`, JPEG/PNG/WebP, max 20 MB) through `nestjs-cloudinary@1.0.7`; response returns Cloudinary URL and public ID for article/banner fields.

News media is uploaded only through the backend. Upload accepts either `content.article.create` or `content.article.update`, so editors can replace an existing cover. Frontend code must not sign Cloudinary requests, hold Cloudinary secrets, transform image binaries, or implement a parallel storage path.

Create accepts an optional `coverImageUrl` and makes the article public immediately. Update edits the same public article. When an image is selected, the client uploads it before create/update; upload failure leaves no new article.

Required backend runtime secrets: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Keep values only in ignored/runtime environment files; never commit or expose them to the browser.

Membership application body:

```json
{
  "fullName": "Nguyễn Văn An",
  "email": "member@example.org",
  "organization": "VAST",
  "professionalRole": "Nhà nghiên cứu",
  "interest": "Vật liệu mới và hợp tác khoa học"
}
```

Responses: `201` accepted, `400` invalid body, `409` pending application already exists for the normalized email.

Rules:

- Validate all external input at the controller boundary.
- Keep opaque session tokens in secure HttpOnly cookies.
- Return `401` for missing/invalid authentication and `403` for insufficient capability or scope.
- Frontend BFF routes forward the opaque session and never expose provider tokens.
- Collection endpoints must be bounded.
