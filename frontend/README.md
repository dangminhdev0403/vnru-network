# VN–RU Portal Frontend

The current Next.js frontend contains the public landing page and Module 1 identity/access surfaces only.

```powershell
pnpm --dir frontend dev
```

Open `http://localhost:3000`.

Current routes:

- `/`
- `/login`
- `/account`
- `/security`
- `/admin/access/*`
- `/admin/audit`

`/workspace` and legacy IAM workspace paths are compatibility redirects.
