# Runtime secrets

Files in this directory are runtime-only unless explicitly named as examples.
Never commit real credentials.

## Google Cloud Storage

Cloud Storage uses Application Default Credentials, not an API key.

1. Create a dedicated service account with bucket-scoped permissions.
2. Download its original JSON key from Google Cloud and save it as `gcs-key.json`. Do not invent or hand-write a private key.
3. Fill these variables in `secrets/demo.env`:
   - `GOOGLE_CLOUD_PROJECT`
   - `GCS_BUCKET`
   - `GCS_CREDENTIALS_FILE=./secrets/gcs-key.json`
4. Make the key readable only by the container runtime user: `chown 1001 secrets/gcs-key.json && chmod 600 secrets/demo.env secrets/gcs-key.json`.

The current application contract returns public `storage.googleapis.com` news URLs. The bucket therefore needs uniform bucket-level access plus public object viewing for public news media; the service account needs object create/read/delete access on this bucket. Do not grant project-wide owner/editor access.

The application runtime and default Compose configuration have no Cloudinary configuration. For the one-time production media cutover, pass `SOURCE_CLOUDINARY_CLOUD_NAME` with `docker compose run -e` only when running `media-migrate inventory`. Keep the ignored manifest until `copy`, `verify`, `apply`, and `verify-db` all pass. Migration commands never delete source or GCS objects.