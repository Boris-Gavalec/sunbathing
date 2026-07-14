# Adding a New Calculator

This is the working guide for adding a calculator to CalcSuite. The codebase is
built around a **single registry** so that navigation, the landing page, and the
sitemap all update themselves once you register a new entry. You add three files
and edit one.

## The big picture

Every calculator is made of three pieces plus one registry line:

| Piece | Location | What it is |
|-------|----------|------------|
| **Logic** | `src/lib/<name>.ts` | Pure functions + FAQ data. No React. |
| **Component** | `src/components/<Name>Calculator.tsx` | Self-contained `"use client"` UI. |
| **Route** | `src/app/<name>-calculator/page.tsx` | Server component: metadata + JSON-LD, renders the component. |
| **Registry** | `src/lib/calculators.ts` | One entry in `CALCULATORS`. Wires up nav + landing + sitemap. |

The **registry is the source of truth**. `src/lib/calculators.ts` is consumed by:
- `src/components/SiteNav.tsx` — the "Calculators ▾" dropdown (grouped by category)
- `src/app/page.tsx` — the landing page card grid + footer links + `ItemList` JSON-LD
- `src/app/sitemap.ts` — the XML sitemap (auto-excludes `comingSoon` entries)

So you never touch the nav or sitemap by hand — register the calculator and they follow.

---

## Step-by-step

### 1. Write the logic — `src/lib/<name>.ts`

Keep it pure (no React) so it's trivially testable and reusable. Export:
- The calculation functions and their result types.
- A `<NAME>_FAQ: { q: string; a: string }[]` array — this feeds **both** the UI and
  the `FAQPage` JSON-LD, so write it once here.

Reference: `src/lib/bmi.ts`, `src/lib/gpa.ts`. Shared unit-conversion helpers
(`cmToFtIn`, `ftInToCm`, `kgToLb`, `lbToKg`) and the `UnitSystem` type already live
in `src/lib/calories.ts` — reuse them instead of re-implementing.

### 2. Build the component — `src/components/<Name>Calculator.tsx`

Follow the **self-contained template** used by BMI/GPA/Calorie (not the older
`InputPanel`/`ResultsPanel` split, which is specific to the Sunbathing calc):

- Start with `"use client";`
- Render `<SiteNav />` at the top so the calculator gets the shared nav + theme toggle.
- Define the small local helpers each of these files uses: `num()` (string→number|null)
  and a local `StatCard` sub-component. Copy them from `src/components/BmiCalculator.tsx:19-44`.
- Drive results with `useMemo` over the pure lib functions.
- **Theme:** never hardcode colors. Use the CSS variables from `src/app/globals.css`
  via `style={{ color: "var(--foreground)" }}`, `var(--card-bg)`, `var(--card-border)`,
  `var(--text-secondary)`, `var(--accent)`, etc., or the semantic classes
  `bg-page` / `bg-card` / `btn-primary` / `btn-outline`. This is what keeps light and
  dark mode working.
- Guard against bad input (empty fields, zero/negative, division by zero) so results
  never render `NaN`.

### 3. Add the route — `src/app/<name>-calculator/page.tsx`

Copy `src/app/bmi-calculator/page.tsx` as your template. It's a **server component**
(no `"use client"`) that does three things:

1. Exports `metadata` (see SEO checklist below).
2. Defines and injects JSON-LD: `WebApplication` + `FAQPage` (mapped from your
   `<NAME>_FAQ`) + `BreadcrumbList`.
3. Renders `<YourCalculator />` inside `<div className="min-h-screen bg-page">`.

Folder name convention: `src/app/<name>-calculator/` → URL `/<name>-calculator`.

### 4. Register it — `src/lib/calculators.ts`

Add one entry to the `CALCULATORS` array:

```ts
{
  name: "Body Fat Calculator",
  emoji: "📏",
  href: "/body-fat-calculator",
  category: "health",            // must be an id from CATEGORIES
  description: "One clear sentence for the nav + landing card.",
  // comingSoon: true,           // set this to show a stub (no route needed yet)
},
```

- If the calculator belongs to a **new category**, add it to `CATEGORIES` first
  (`{ id: "finance", label: "Finance" }`) and widen the `CalculatorCategory` union type
  at the top of the file.
- `comingSoon: true` renders a non-clickable "Work in progress" card on the landing page
  and is excluded from the sitemap — use it to tease a calculator before the route exists.

That's it for wiring. The dropdown, landing grid, footer, and sitemap now include it.

---

## SEO checklist (per route)

The global defaults live in `src/app/layout.tsx` (title template, base OpenGraph/Twitter,
`metadataBase`, robots). The site-wide **OG/Twitter share image** is generated once at
`src/app/opengraph-image.tsx` and inherited by every route — you do **not** add an image
per page.

In your `page.tsx` `metadata`, set:

- [ ] `title` — unique, ~50–60 chars, includes the primary keyword.
- [ ] `description` — unique, ~120–160 chars.
- [ ] `alternates.canonical` — the absolute page URL.
- [ ] `openGraph` — `title`, `description`, `url`, **and** `type: "website"`,
      `locale: "en_US"`, `siteName: "CalcSuite"`. (Next merges `openGraph` shallowly, so
      these three must be repeated or they're lost — this is a known footgun.)
- [ ] `twitter` — `{ title, description }` matching the page (card type is inherited).

JSON-LD in the page body:

- [ ] `WebApplication` — include `name`, `applicationCategory`, `operatingSystem`,
      `url`, `image: "https://calcsuite.app/opengraph-image"`, `description`, `offers` (free).
- [ ] `FAQPage` — mapped from your `<NAME>_FAQ` array.
- [ ] `BreadcrumbList` — CalcSuite → This Calculator.

Note: the `WebSite` + `Organization` JSON-LD is emitted **only on the homepage**
(`src/app/page.tsx`) — do not duplicate it on calculator routes.

---

## Verify before committing

```bash
npm run lint     # must be clean
npm run build    # must pass; confirm your new /<name>-calculator route is listed
npm run dev      # open http://localhost:3000, click the calculator in the dropdown,
                 # test real inputs, and toggle light/dark to check theme variables
```

Quick SEO sanity check: view source on the new page and confirm the `<title>`,
canonical, `og:*`/`twitter:*` tags, and the three JSON-LD blocks are present, and that
`/<name>-calculator` appears in `/sitemap.xml`.

---

## Quick reference — files to touch

```
src/lib/<name>.ts                          # NEW  — pure logic + <NAME>_FAQ
src/components/<Name>Calculator.tsx        # NEW  — self-contained UI
src/app/<name>-calculator/page.tsx         # NEW  — metadata + JSON-LD + render
src/lib/calculators.ts                     # EDIT — one CALCULATORS entry
```

Templates to copy from: `src/lib/bmi.ts`, `src/components/BmiCalculator.tsx`,
`src/app/bmi-calculator/page.tsx`.
