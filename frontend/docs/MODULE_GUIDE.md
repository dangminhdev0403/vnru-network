# Frontend Module Guide

The only implemented business module is Module 1.

```text
app route or BFF
  -> auth/IAM feature
  -> query resource or repository
  -> shared HTTP utility
  -> auth-service
```

- `features/auth`: session, account, profile, MFA and logout.
- `features/iam`: IAM repositories/resources/hooks.
- `features/admin/access`: user, role, permission and assignment administration.
- `features/admin`: Module 1 administration shell and navigation.
- `features/public-home`: standalone informational landing page.
- `features/workspace`: shared authenticated shell navigation limited to account, security and the authorized admin bridge.

Do not scaffold removed business modules without a new explicit product decision.
