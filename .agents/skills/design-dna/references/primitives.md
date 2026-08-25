# Primitives

## Color
Canvas #f6f7f9; surface #ffffff; primary text #18212b; secondary text #667085; academic navy #071a33; action blue #2563eb; network red #e34b55; success #16825d; danger #c73745.

Use semantic CSS variables/Tailwind tokens. Raw colors require a documented exceptional role.

## Typography
Body: Noto Sans. Headings: Noto Serif. Both must load Vietnamese, Cyrillic, and Latin glyphs without per-language fallback drift.

- Body/default: 16px, line-height 1.5–1.65, weight 400–500.
- Small metadata: 14px minimum, line-height at least 1.4.
- Body large: 18px, line-height 1.55–1.65.
- Headings: 24/32/48px with compact responsive steps; sentence case.
- Primary controls: 16px minimum. Never use 10–12px for actions or normal content.

## Spacing
4px base unit; 16px mobile margin; 24px gutter; 32px major section gap; 1280px max container.

## Shape
4px controls; 8–12px editorial cards; pills only for status/chips.

## Elevation
Borders and tonal layers first. Soft shadow only for raised cards/overlays; no heavy generic dashboard shadows.

## Motion
160ms quick feedback; 240–420ms transitions; restrained entrance motion; always honor `prefers-reduced-motion`.
