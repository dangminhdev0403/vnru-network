---
name: "react-aria"
description: "Build accessible UI components with React Aria Components in the VN-RU Network Portal. Provides guidance for accessible WAI-ARIA primitives, keyboard navigation, and TailGrids integration."
license: "Apache-2.0"
compatibility: "Requires React project with react-aria-components installed."
---

# React Aria Components & TailGrids Primitives in VN-RU Portal

## Overview

The VN-RU Network portal frontend utilizes `react-aria-components` for accessible, robust UI primitives integrated with TailGrids design tokens.

## Available Primitives

Located in `frontend/components/tailgrids/core/`:
- `Button` (`button.tsx`): Supports primary, danger, success, ghost variants, fill & outline appearances, and sizes xs through xxl.
- `Card` (`card.tsx`): Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction.
- `Badge` (`badge.tsx`): Primary, neutral, error, warning, success, cyan, sky, blue.
- `Breadcrumbs` (`breadcrumbs.tsx`): Accessible hierarchical navigation.
- `Collapsible` (`collapsible.tsx`): Accessible accordion and collapsible panels.
- `Sheet` (`sheet.tsx`): Slide-over drawers for mobile navigation and detailed inspectors.
- `Tooltip` (`tooltip.tsx`): Hover and focus-triggered contextual hints.
- `DropdownMenu` (`dropdown.tsx`): Accessible popup menus with keyboard support.
- `Table` (`table.tsx`): Semantic tables with dark/light mode tokens.

## Rules
1. Always use semantic color tokens (`text-text-primary`, `bg-card-background`, `border-card-border`, `bg-card-surface-area`, `text-brand-500`, etc.).
2. Do not hardcode raw hex colors in component files.
3. Ensure keyboard accessibility and focus rings are preserved.
