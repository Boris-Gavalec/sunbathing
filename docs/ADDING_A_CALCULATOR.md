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
- `src/components/SiteNav.tsx` — one nav dropdown **per category**, plus the mobile sheet
- `src/components/SiteFooter.tsx` — the sitemap footer rendered on every page
- `src/app/page.tsx` — the landing page card grid + the `ItemList` JSON-LD + the hero counts
- `src/app/sitemap.ts` — the XML sitemap (auto-excludes `comingSoon` entries)

So you never touch the nav, footer or sitemap by hand — register the calculator and they follow.

---

## Step-by-step

### 1. Write the logic — `src/lib/<name>.ts`

Keep it pure (no React) so it's trivially testable and reusable. Export:
- The calculation functions and their result types.
- A `<NAME>_FAQ: { q: string; a: string }[]` array — this feeds **both** the UI and
  the `FAQPage` JSON-LD, so write it once here.

Reference: `src/lib/bmi.ts`, `src/lib/gpa.ts`.

**Reuse the shared libs instead of re-implementing.** Several already exist, and
the constants in them are deliberately single-sourced — adding a second definition
of "pounds per kilogram" is how the site starts disagreeing with itself:

| Need | Use | Notes |
|------|-----|-------|
| Unit conversion, `UnitSystem` | `src/lib/calories.ts` | `cmToFtIn`, `ftInToCm`, `kgToLb`, `lbToKg`, and the `LB_PER_KG` / `CM_PER_IN` constants everything else derives from. |
| Loan/mortgage/savings maths | `src/lib/finance.ts` | `monthlyPayment` (handles the 0% rate case), `amortizationTotals`, `futureValueOfAnnuity`, `monthsToReachGoal`, `formatMoney`. |
| Calendar maths | `src/lib/dates.ts` | `diffYmd` (calendar-correct y/m/d), `daysBetween`, `parseDateInput`, `toDateInputValue`. |
| General unit conversion | `src/lib/units.ts` | `convert()` across length/weight/temperature, plus `KM_PER_MILE`. |

Two traps worth knowing about, both already solved in those libs:
- **Rates of 0 divide by zero.** The amortization and annuity formulas are `0/0` at
  a zero rate. `finance.ts` special-cases it; do the same in anything similar.
- **Dates are not timestamps.** Subtracting two `Date`s across a daylight saving
  change gives 23 or 25 hours and silently loses a day. `dates.ts` compares
  calendar days in UTC — use it rather than rolling your own.

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
- **Never compute "now" during render.** Every route is statically prerendered, so
  `new Date()` in render or in `useState` bakes the build date into the HTML and then
  disagrees with the browser on hydration. Use the `useToday()` hook in
  `src/components/useToday.ts`, which returns `""` for the server pass and the real
  date after. (A mount `useEffect` that calls `setState` is *not* an alternative here —
  the `react-hooks/set-state-in-effect` lint rule rejects it.) See
  `src/components/AgeCalculator.tsx` for the editable-with-a-default pattern.

### 3. Add the route — `src/app/<name>-calculator/page.tsx`

Copy `src/app/bmi-calculator/page.tsx` as your template. It's a **server component**
(no `"use client"`) that does three things:

1. Exports `metadata` (see SEO checklist below).
2. Defines and injects JSON-LD: `WebApplication` + `FAQPage` (mapped from your
   `<NAME>_FAQ`) + `BreadcrumbList`.
3. Renders `<YourCalculator />` **and `<SiteFooter />`** inside
   `<div className="min-h-screen bg-page">`.

`<SiteFooter />` goes in the route, not in your calculator component — it's a server
component, and keeping it out of the `"use client"` tree means it isn't shipped to the
browser. Every route renders it; that footer is the site's internal-linking surface.

Folder name convention: `src/app/<name>-calculator/` → URL `/<name>-calculator`.
Drop the `-calculator` suffix when it would be silly — `/unit-converter`, not
`/unit-converter-calculator`, because nobody searches for the latter.

### 4. Register it — `src/lib/calculators.ts`

Add one entry to the `CALCULATORS` array:

```ts
{
  name: "Body Fat Calculator",
  emoji: "📏",
  href: "/body-fat-calculator",
  category: "health",            // must be an id from CATEGORIES
  description: "Body fat percentage from simple tape measurements.",
  // comingSoon: true,           // set this to show a stub (no route needed yet)
},
```

Current categories: `health` (Health & Fitness), `education` (Education),
`finance` (Financial), `math` (Math), `utility` (Utility).

- **Keep `description` to ~8-10 words.** It is only consumed by the landing card, and
  that grid is 5 across on desktop — cards land at roughly 220px wide, so a long
  sentence wraps into a very tall card and drags the whole row down with it.
- If the calculator belongs to a **new category**, add it to `CATEGORIES` first
  (`{ id: "finance", label: "Financial" }`) and widen the `CalculatorCategory` union
  type at the top of the file. A new category also adds a nav dropdown, so don't create
  one for a single calculator unless you expect it to grow.
- `comingSoon: true` renders a non-clickable "Work in progress" card on the landing page,
  a greyed entry in the nav and footer, and is excluded from the sitemap — use it to
  tease a calculator before the route exists. Its `href` should be `"#"`.

That's it for wiring. The nav dropdowns, landing grid, sitemap footer, hero counts, and
XML sitemap now all include it.

---

## SEO checklist (per route)

**Do not hand-roll `metadata`.** Use the `calculatorMetadata()` helper in
`src/lib/seo.ts`, and `calculatorJsonLd()` + `<JsonLd />` for the structured data:

```ts
const PATH = "/tip-calculator";

export const metadata = calculatorMetadata({
  title: "Tip Calculator — Split a Bill and Work Out the Tip",   // ~50-60 chars
  description: "…",                                              // ~120-160 chars
  social: "…",                                                   // optional shorter card copy
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Tip Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",  // or HealthApplication / EducationalApplication / UtilitiesApplication
  description: "…",
  faq: TIP_FAQ,
});

// in the component:
<JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
```

**Why a helper, and why nothing is inherited.** Next merges `openGraph` and `twitter`
**shallowly**. A page that sets either one *replaces* the root layout's version outright,
silently dropping every field it didn't restate — including `images`, `siteName`,
`locale`, `type`, and `card`. Nothing warns you. This bit us for real: every calculator
page shipped with no share image and a small `summary` card instead of
`summary_large_image`, because the pages set `openGraph`/`twitter` without restating them.
The helper restates all of it on every route, which is why you should go through it rather
than writing the object by hand.

The root `src/app/opengraph-image.tsx` only covers `/` for the same reason — the helper
points every calculator route at that image explicitly.

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
src/app/<name>-calculator/page.tsx         # NEW  — metadata + JSON-LD + render + <SiteFooter/>
src/lib/calculators.ts                     # EDIT — one CALCULATORS entry
```

Templates to copy from: `src/lib/bmi.ts`, `src/components/BmiCalculator.tsx`,
`src/app/bmi-calculator/page.tsx`.

Worth reading first if yours is similar: `src/components/LoanCalculator.tsx` (shared
finance maths, collapsible schedule table), `src/components/AgeCalculator.tsx`
(`useToday`, date validation), `src/components/PaceCalculator.tsx` (solving for one of
three inputs).

**Known duplication:** every calculator component carries its own copy of `num()` and
`StatCard`, as this guide instructs. That is the house style, but it is now repeated
across a dozen files — if you find yourself changing `StatCard`, that is the moment to
extract it to a shared module rather than editing it twelve times.
