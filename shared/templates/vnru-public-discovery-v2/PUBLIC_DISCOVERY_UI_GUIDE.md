# VN–RU Public Discovery UI Guide

Status: **UI source of truth for the Public / Discovery family**  
Scope: `/discover`, `/search`, `/knowledge`, `/publications/[id]`, `/experts`, `/experts/[id]`, `/opportunities`, `/opportunities/[id]`

## 1. Product role

Public Discovery is the public knowledge layer of **Mạng lưới Tri thức Việt Nga**. It begins after the institutional landing page and must feel like the same product, but it is not a second marketing landing page and not a workspace/dashboard.

Interaction model:

```text
SEARCH → DISCOVER → UNDERSTAND CONTEXT → FOLLOW RELATIONSHIPS → OPEN ENTITY
```

Core entity relationship:

```text
Expert ↔ Publication ↔ Research Topic ↔ Organization ↔ Research Opportunity
```

## 2. Visual continuity with landing

The landing page remains the visual source of truth. Public Discovery inherits its bilateral identity and editorial/scientific character.

### Canonical palette

```text
Deep Navy      #06182F
Header Navy    #0C213E
Dark Canvas    #041426
Academic Blue  #2D6CDF
Soft Blue      #8FB7FF
Bilateral Red  #E73743   (identity accent only)
Warm Ivory     #F4EFE5
Off White      #FBF8F1
Ink            #172439
Slate Border   #29415F
```

### Background rule

Do **not** use one flat navy fill for large surfaces. Dark public surfaces use a restrained institutional mesh:

- deep navy base;
- low-opacity academic-blue radial light;
- extremely subtle bilateral-red light only as a secondary identity accent;
- 48–56px scientific grid / network texture at low opacity;
- no neon, glassmorphism, purple/cyan startup gradients.

Light pages use a warm ivory paper canvas with soft blue radial tint and a barely visible grid. The result should feel layered, not glossy.

## 3. Typography

- Editorial headings: `Source Serif 4`, fallback `Georgia`.
- Body/UI: `Hanken Grotesk`, fallback system sans.
- Technical metadata only where justified: `JetBrains Mono`.
- Page title: approximately 44–66px desktop, 40–48px mobile.
- Body: 14–17px.
- Do not shrink the whole experience into a small academic-document layout.

## 4. Layout

- Desktop max width: ~1380px.
- Default page shell: `calc(100% - 56px)` desktop; 28px total gutter on narrow mobile.
- Use asymmetry where it helps context: main entity/content + relationship panel.
- Avoid permanent filter sidebars.
- Avoid card grids as the dominant content language.
- Prefer editorial rows, document panels, relationship panels, topic blocks and knowledge trails.

## 5. Shared shell

Every Public Discovery page must reuse the same:

- bilateral 3px identity bar;
- dark portal header;
- VN–RU brand mark and name;
- navigation: `Khám phá`, `Tri thức`, `Chuyên gia`, `Cộng tác nghiên cứu`;
- VI/RU/EN control;
- login entry;
- deep navy footer.

Do not show module numbers, IAM, admin, PMS, dashboard, service names, or implementation IDs in public navigation.

## 6. Public backgrounds and surfaces

### Dark stage

Used for page introductions, discovery search and profile/opportunity headers.

Visual recipe:

```text
base: #041426 → #06182F → #0A2442
blue mesh light: rgba(45,108,223,0.15–0.28)
soft blue light: rgba(143,183,255,0.08–0.15)
red identity light: <= rgba(231,55,67,0.06)
grid: white 0.02–0.03 opacity
```

### Light science canvas

```text
base: #FBF8F1 / #F4EFE5
soft blue tint near edges
fine #29415F grid at ~0.02 opacity
```

Primary content surfaces stay warm and lightly bordered. Shadows are reserved for large meaningful panels, never every card.

## 7. Component language

### NetworkSearch

- dominant on `/discover` and page intros where relevant;
- dark translucent frame + warm input surface;
- height ~50–64px;
- no fake AI controls unless actually implemented.

### EntityNavigator

Horizontal navigation:

```text
Tất cả · Tri thức · Chuyên gia · Tổ chức · Chủ đề · Cơ hội nghiên cứu
```

No permanent left “Contextual Filters” sidebar.

### EditorialRow

Use for search/publication/opportunity indexes:

- thin top/bottom borders;
- strong serif title;
- compact metadata;
- optional relationship/context column;
- no oversized rounded SaaS card.

### RelationshipPanel

Must visually communicate entity context with:

- 5–9px academic-blue nodes;
- thin slate connectors;
- restrained labels;
- links to related entities.

It is contextual support, not a giant graph visualization.

### KnowledgeTrail

Use a contextual trail at detail-page entrances, e.g.:

```text
Khám phá · Kho tri thức · Công bố khoa học
```

The trail supports orientation but must not look like internal technical breadcrumbs.

## 8. Page-specific rules

### `/discover`

- dark immersive search stage;
- show relationship model early;
- editorial discovery content below;
- “scientific knowledge network”, not “publication database”.

### `/search`

- search query stays visible;
- compact filters;
- heterogeneous results expose related entities;
- no left filter rail.

### `/knowledge`

- topic-first exploration;
- no file-manager metaphor;
- publication stream + organization anchors.

### `/publications/[id]`

- document-first warm-paper surface;
- authors, abstract, keywords, research context;
- relationship/context stack on the side.

### `/experts`

- no employee-card directory;
- horizontal editorial records with research context and related topics/publications.

### `/experts/[id]`

- person + expertise + knowledge + relationships;
- portrait/identity header on dark stage;
- tabs only for data that exists.

### `/opportunities`

- use `Cơ hội cộng tác nghiên cứu`;
- show research scope, status and topic context;
- no financial information.

### `/opportunities/[id]`

- formal research opportunity detail;
- objectives, participation conditions, timeline, related topics/experts;
- login CTA may lead to workspace only if that flow exists.

## 9. No-financial-domain rule

Never introduce public UI for:

```text
funding
investment
budget
disbursement
payment
financial report
sponsor/funding source
ROI
royalty
deal value
financial KPI
```

Capability 3 is **Cộng tác nghiên cứu**, not a financial Grants/PMS interface.

## 10. 2+2 rule

Do not place 2+2 in the current Public Discovery family until Technology & Enterprise capability is explicitly opened. 2+2 belongs to Technology Transfer & Enterprise Connection, not to research collaboration.

## 11. Interaction integrity

Prototype may implement local UI behavior for:

- search navigation;
- entity filters;
- tabs;
- knowledge trails;
- following links between related prototype pages.

Do not fake:

- successful login;
- save/submit/create;
- backend persistence;
- partner matching success;
- proposal submission.

## 12. Responsive behavior

- desktop uses 1280–1380px canvas intelligently;
- tablet moves contextual columns below primary content;
- mobile becomes single column;
- entity navigation may scroll horizontally;
- search becomes stacked when necessary;
- no page-level horizontal overflow.

## 13. Implementation mapping

Prototype files:

```text
index.html                   review hub
discover.html                /discover
search.html                  /search
knowledge.html               /knowledge
publication-detail.html      /publications/[id]
experts.html                 /experts
expert-detail.html           /experts/[id]
opportunities.html           /opportunities
opportunity-detail.html      /opportunities/[id]
assets/styles.css            shared visual system
assets/app.js                prototype-only local interactions
```

When mapped to Next.js, preserve the shared visual tokens and components rather than copying page CSS independently.

## 14. Acceptance test

A reviewer switching between landing → `/discover` → entity pages should immediately perceive one product family through:

- navy/ivory rhythm;
- serif/sans pairing;
- bilateral mark;
- background mesh language;
- border treatment;
- relationship motifs;
- navigation hierarchy.

The Public Discovery family must not look like a SaaS dashboard, old university directory, Scopus clone, or a separate visual product.
