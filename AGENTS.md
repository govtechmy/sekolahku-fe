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

Bantuan content ships **with** this repo (`src/data/bantuan.json`), so a code deploy _is_ the content update for that feature. The remaining features (school, siaran, takwim, acara) read from sekolahku-be at runtime, and deploying this repo never seeds any database.

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

**Content is static and lives in this repo — there is no backend call.** As of Sep 2026 `src/services/bantuan.svc.ts` reads `src/data/bantuan.json` (20 programs, exported once from the Payload CMS export `payload_cms_schoolaid.json`) and filters/looks up in memory. The `/bantuan` API, its Mongo model, and sekolahku-be's `scripts/seed-bantuan.ts` were all **deleted** — do not reintroduce an API call here. To update content: re-export from the CMS, overwrite `src/data/bantuan.json`, and deploy. No DB seeding step exists anymore.

`getBantuanList`/`getBantuanBySlug` kept their original `async` signatures and return shapes (`BantuanList` still fills `totalRecords`/`pageNumber`/`pageSize` from `BaseListModel`, `getBantuanBySlug` still throws on a miss so `BantuanId.tsx`'s `notFound` path keeps working), so page components were untouched by the migration. The JSON import needs `resolveJsonModule: true` in `tsconfig.app.json`.

- Design source: `design.pen` (pen.dev file, lives outside this repo). Node `IEDcI` ("Bantuan Content") is the list-page content frame; per-program detail pages are separate top-level frames named `Sekolahku - Bantuan <CODE>`.
- `src/utils/bantuanImages.ts` maps each program slug to a static per-slug JPG in `public/utama/bantuan/`, exported once from the design mockup's AI-generated card art. These are a **separate data source from the text content** — the CMS export has no image field, so the slug keys in `bantuanImages.ts` and in `bantuan.json` must be kept in sync by hand (all 20 currently match; `BANTUAN_IMAGE_FALLBACK` guards a miss).
- `src/components/shared/BantuanSectionCard.tsx`: the content uses canonical **UPPERCASE section keys** (`KADAR`, `JENIS BANTUAN`, `SUMBER PERUNTUKAN`, …), not the human-readable label shown on screen. The maps and resolvers live in `src/components/shared/bantuanSectionHelpers.ts` (split out from the component so the `.tsx` only exports a component — react-refresh lint rule): `SECTION_DISPLAY_LABELS` maps key → display text, `SECTION_ICON_MAP` maps key → icon. If you need to detect a specific section by name (e.g. as `BantuanId.tsx`'s `isKadarHeading` does), match against the raw uppercase key, never the display label.
- The `BantuanId.tsx` sidebar "Ringkasan Bantuan" card headline uses the program's `Kadar` section content when one exists, falling back to the program title when it doesn't (not every program has a flat-rate "Kadar" section — e.g. KWAPM).
- Headings are not a fixed set across programs (Program 3K3C uses ANJAKAN/INISIATIF/SASARAN instead of KADAR/PEMILIHAN), so `resolveIcon` falls back to a generic icon rather than breaking on unrecognised ones.

## Gotcha: the pre-commit hook lints and builds the whole repo

`.husky/pre-commit` runs `prettier . --write`, `bun run lint:fix`, **and a full `bun run build`** — across the entire working tree, not just staged files. A lint error or type error anywhere (even in an untracked file you didn't touch) blocks every commit until it's fixed. Budget ~10s per commit and expect unrelated pre-existing errors to surface as blockers rather than warnings.

## Tests

Vitest, colocated as `*.test.ts` next to the code under test (`src/services/bantuan.svc.test.ts`, `src/services/school.svc.test.ts`, `src/utils/*.test.ts`, `src/components/maps/schoolPinImage.test.ts`). 44 tests across 6 files as of Sep 2026. No component-render tests — coverage is service/util logic only.

## graphify

`sekolahku-be` has a `graphify-out/` knowledge graph; **this repo does not** (nothing to query here yet). If you add one, the CLI is installed via `uv` at `~/.local/bin/graphify` with its own bundled Python 3.13 — the system `python3` is Xcode's 3.9.6, below graphify's 3.10+ floor, so plain `pip install graphifyy` fails here.

## Reference

- Backend counterpart: `../sekolahku-be` (see its own AGENTS.md — read-only GET-only content API backed by MongoDB Atlas). It serves school, siaran, takwim, and acara; it no longer has a `/bantuan` endpoint.
