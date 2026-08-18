---
name: Russia–Vietnam Knowledge Network
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002116'
  on-tertiary-container: '#479175'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#a6f2d1'
  tertiary-fixed-dim: '#8bd6b6'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-compact: 8px
  stack-section: 32px
---

## Brand & Style
The design system embodies **Institutional Modernism**, a style that prioritizes academic authority, scientific precision, and bilateral cooperation. It is designed to evoke trust, stability, and intellectual rigor.

The aesthetic avoids the "generic SaaS" look in favor of a refined, editorial feel. It utilizes high-contrast typography, generous horizontal margins but compact vertical rhythms, and a "document-first" philosophy. The visual language is calm and focused, reflecting the prestige of a transnational knowledge exchange.

## Colors
The palette is rooted in **Deep Slate** and **Academic Blue**, providing a foundational weight that feels established and serious.

- **Primary (Deep Slate):** Used for typography and structural elements to ensure maximum legibility and authority.
- **Secondary (Navy/Academic Blue):** Used for interactive elements and subtle categorization of scientific fields.
- **Tertiary (Emerald Green):** Reserved for "Trust Markers"—verification badges, successful data synchronization, and peer-review status.
- **Surfaces:** We utilize a "Warm Ivory" (#fdfcf0) for main content areas to reduce eye strain and provide a more premium, paper-like feel compared to clinical white.

## Typography
The typographic system creates a tension between the **Source Serif 4** (representing the heritage of publishing and academia) and **Hanken Grotesk** (representing modern data and efficient communication).

- **Headlines:** Always use the serif face. In display settings, use tighter letter-spacing.
- **Body Text:** Hanken Grotesk is used for its compact width, allowing for more information density in research abstracts and data tables.
- **Labels:** Meta-information (dates, citations, authors) should use the `label-caps` style for clear visual distinction without adding weight.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain an editorial, structured feel.

- **Density:** Vertical spacing is intentionally tight. Use `stack-compact` for related metadata and `stack-section` for major thematic shifts.
- **Grid:** A 12-column system is used. Content should often be offset—for example, a 3-column "Sidebar/Metadata" area next to a 7-column "Manuscript/Article" area to create an asymmetrical, sophisticated balance.
- **Information Density:** Lists and tables should prioritize row count over row height. Use 8px vertical padding for list items to ensure a high-trust, data-rich environment.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than aggressive shadows.

- **The Canvas:** Backgrounds use the Neutral Slate (#f8fafc).
- **The Document:** Primary content areas (cards, articles) use Ivory (#fdfcf0) with a 1px border in a slightly darker tone (#e2e8f0).
- **Shadows:** Only used for floating overlays (menus, tooltips). When used, they are extremely diffused: `0 10px 30px rgba(15, 23, 42, 0.05)`.
- **Dividers:** Use thin (1px) solid lines in `#cbd5e1` to separate academic sections.

## Shapes
The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the "brutalist" industrial look while remaining significantly more formal than the "bubbly" consumer-grade web.

- Buttons and Input fields use the base 0.25rem (4px) radius.
- "Editorial Cards" (featured research) may use the 0.5rem (8px) radius for a more distinct presence.
- Status badges/tags use a 2px radius for a technical, stamp-like appearance.

## Components
- **Buttons:** Primary buttons are Deep Slate with white text. Secondary buttons use a "Ghost" style with a 1px border. No gradients; use solid fills only.
- **Editorial Cards:** These should feature a prominent Serif headline, a 1px border, and a subtle ivory background. Metadata (author/date) sits at the top in `label-caps`.
- **Data Tables:** Highly dense. Header rows use a light slate background with bold Hanken Grotesk labels. Cell borders should be horizontal-only to emphasize the flow of information.
- **Input Fields:** Precise 1px borders. Focus state is a 1px solid Academic Blue border with a 2px soft blue outer glow (no change in border thickness).
- **Citations/Chips:** Small, rectangular tags with a light blue background and dark blue text, used for keywords or scientific categories.
- **The "Bilateral" Header:** A thin top bar containing the network name in both Russian and Vietnamese, using a refined weight of the sans-serif font.
