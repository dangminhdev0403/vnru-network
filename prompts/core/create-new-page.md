# Task: Add a New Workspace / Portal Page

Create a new page in the VN-RU Network portal (with header, breadcrumbs, TailGrids Card layout) and wire it into the Sidebar navigation. Follow `AGENTS.md` and repository rules strictly.

---

## Step 0 — Gather Inputs

Ask the user:
1. **Page Title / Label** — Sidebar and breadcrumb text (e.g. `Bilateral Grants` / `Tài trợ song phương`).
2. **Page URL Path** — kebab-case URL (e.g. `/workspace/grants`).
3. **Target Navigation Section** — `WORKSPACE` or `GOVERNANCE`.
4. **Module Assignment** — Module 01 (IAM), Module 02 (Knowledge), Module 03 (Grants), etc.

---

## Step 1 — Create `page.tsx`

Create `frontend/app/workspace/<route>/page.tsx` (or `frontend/app/admin/<route>/page.tsx`):

```tsx
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/tailgrids/core/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[PAGE_TITLE] | Russia-Vietnam Science-Technology Intelligence Network",
};

export default function [PageName]Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            [PAGE_TITLE]
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            [PAGE_DESCRIPTION]
          </p>
        </div>
        <Breadcrumbs
          dividerType="chevron"
          items={[
            { href: "/workspace", label: "Workspace" },
            { href: "[PAGE_PATH]", label: "[PAGE_TITLE]" },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>[SECTION_TITLE]</CardTitle>
          <CardDescription>[SECTION_DESCRIPTION]</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 2 — Wire into `Sidebar.tsx`

Add the navigation item to `frontend/components/shared/Sidebar.tsx` under the matching section.

---

## Step 3 — Verify

Run the verification gate:
```bash
node auth-flow.test.mjs
node home-i18n.test.mjs
pnpm --filter frontend lint
```
