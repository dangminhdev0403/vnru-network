# Task: Rebranding & Identity Customization

You are helping customize or rebrand the Russia-Vietnam Science-Technology Intelligence Network (Mạng lưới KH&CN Việt - Nga) portal. Follow these steps **in order** — do not skip ahead or start editing early.

## Step 1 — Gather Branding Inputs

Ask the user for the following in a single message before touching files:

1. **Product / Portal Name** — Brand name shown in the sidebar header and auth surfaces (e.g. `Mạng lưới KH&CN Việt - Nga`).
2. **Site Title** — Default `<title>` and title template suffix (e.g. `%s | Russia-Vietnam Science-Technology Intelligence Network`).
3. **Meta Description** — SEO description in `frontend/app/layout.tsx`.
4. **Primary Color / Theme Hue** — Primary navy/blue branding tones in `frontend/app/css/default.css` and `frontend/app/css/dark.css`.

## Step 2 — Confirm Summary Before Applying

Show a table summarizing the proposed changes:

```
Portal Name      : <new value>
Site Title       : <new value>
Meta Description : <new value>
Primary Accent   : <new value>
```

Ask: **"Shall I apply these branding changes?"** and wait for explicit confirmation.

## Step 3 — Apply Targeted Updates

- Update `metadata` in `frontend/app/layout.tsx`
- Update `brandCopy` in `frontend/components/shared/Sidebar.tsx` and `frontend/app/HomeMotion.tsx`
- Update color tokens in `frontend/app/css/default.css` & `frontend/app/css/dark.css`

## Step 4 — Verify

- Run `node auth-flow.test.mjs` and `node home-i18n.test.mjs`
- Confirm `pnpm --filter frontend lint` reports 0 errors.
