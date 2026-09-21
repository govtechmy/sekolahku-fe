# AGENTS.md — sekolahku-fe

Frontend for **SekolahKu**, a Malaysian government school-information portal (govtechmy). React + Vite + TypeScript, styled with the **MYDS** (`@govtechmy/myds-react`, `@govtechmy/myds-style`) design system on Tailwind.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`, then `postbuild` runs `copy-robots.js` + `prerender.js` (react-snap prerendering of static routes)
- `npm test` — Vitest (`vitest run`); `npm run test:watch` for watch mode
- `npm run lint` / `lint:fix` — ESLint

## Deploy

GitHub Actions, branch-triggered, no manual step for code:

- push to `develop` → auto-deploys to **staging** (AWS S3)
- push to `main` → auto-deploys to **prod** (AWS S3)

Content data (see sekolahku-be's `BantuanContentModel`) is a **separate concern** — deploying this repo's code does not seed any database.

## Typography convention

- `font-heading` → Poppins (headings only — see `src/index.css` comment; do NOT add a global `* { font-family: Inter }` rule, it would defeat `font-heading`)
- `font-body` → Inter (default body font from MYDS base)
- Poppins 700/800 weights are loaded explicitly in `index.css` because MYDS only ships 400/500/600.

## Gotcha: MYDS color tokens don't match design.pen hex values

Tokens like `text-txt-black-900`, `text-txt-black-500`, `text-txt-black-700`, `border-otl-divider` resolve to **neutral MYDS grays** (`#18181B`, `#6B6B74`, `#3F3F46`, `#F4F4F5`). Design mockups (design.pen, see below) frequently spec **blue-tinted** hex values for the same visual role (`#17181C`, `#5B6472`/`#6B6472`, `#404A5A`, `#1A2233`, `#16284F`, `#ECECEF`). These look identical at a glance but are measurably different colors.

**When matching a design pixel-for-pixel, use the design's literal hex value in an arbitrary Tailwind class (`text-[#5B6472]`), not the nearest MYDS token.** This has been the single most common design-drift bug found in this codebase — check new components against it.

## Gotcha: gradient values render more opaque in-browser than in the design tool

pen.dev's own canvas preview and Chrome composite `radial-gradient`/`linear-gradient` differently at the _same_ numeric stop values — a gradient copied verbatim from a `.pen` file export can look convincingly correct in isolation but visibly "washed out" or "flat" compared to the actual design when rendered in the browser (seen on the Bantuan hero and card scrims). If a gradient looks duller/flatter than the design screenshot despite matching the exported values exactly, tune the size/opacity down empirically (screenshot-compare) rather than trusting the literal spec.

## Bantuan Persekolahan feature

- Design source: `design.pen` (pen.dev file, lives outside this repo). Node `IEDcI` ("Bantuan Content") is the list-page content frame; per-program detail pages are separate top-level frames named `Sekolahku - Bantuan <CODE>`.
- `src/utils/bantuanImages.ts` maps each program slug to a static per-slug JPG in `public/utama/bantuan/`, exported once from the design mockup's AI-generated card art. These are **not** the same file the backend CMS export uses for text content — images and content are two independent data sources for the same feature.
- `src/components/shared/BantuanSectionCard.tsx`: the backend returns section headings as canonical **UPPERCASE keys** (`KADAR`, `JENIS BANTUAN`, `SUMBER PERUNTUKAN`, …), not the human-readable label shown on screen — `SECTION_DISPLAY_LABELS` maps key → display text, and `SECTION_ICON_MAP` maps key → icon. If you need to detect a specific section by name (e.g. to surface its content elsewhere, as `BantuanId.tsx`'s `isKadarHeading` does), match against the raw uppercase key, never the display label.
- The `BantuanId.tsx` sidebar "Ringkasan Bantuan" card headline uses the program's `Kadar` section content when one exists (real backend data, not fabricated), falling back to the program title when it doesn't (not every program has a flat-rate "Kadar" section — e.g. KWAPM).

## Reference

- Backend counterpart: `../sekolahku-be` (see its own AGENTS.md — read-only content API backed by MongoDB Atlas + a manual seed script).
