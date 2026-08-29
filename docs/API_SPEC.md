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
- `GET /api/v1/news`: public published-news feed; supports bounded pagination, `locale`, and optional `featured`.
- `GET /api/v1/news/:id`: public published article with VI fallback.
- `/api/v1/admin/news/*`: authenticated article create/update/publish/unpublish operations authorized by `content.article.*` capabilities.
- `GET /api/v1/admin/news`: bounded admin list with optional `status=DRAFT|PUBLISHED`; `GET /api/v1/admin/news/:id` returns all translations for editing.
- `POST /api/v1/admin/news/media`: authenticated multipart image upload (`file`, JPEG/PNG/WebP, max 5 MB) through `nestjs-cloudinary@1.0.7`; response returns Cloudinary URL and public ID for article/banner fields.

News media is uploaded only through the backend. Upload accepts either `content.article.create` or `content.article.update`, so editors can replace an existing cover. Frontend code must not sign Cloudinary requests, hold Cloudinary secrets, transform image binaries, or implement a parallel storage path.

Create/update is authoritative and returns without waiting for media. The client uploads media independently, then patches the returned Cloudinary URL onto that article. Upload failure leaves the article as a retryable draft; publishing is rejected until `coverImageUrl` exists. This temporary client-managed task does not survive tab close/reload; add a durable backend queue only when that behavior is required.

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
