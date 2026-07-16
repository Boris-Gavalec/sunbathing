# Archived pages

These calculator pages have been taken **offline but not deleted**. Their route
folders live here, under `archived/app/`, instead of `src/app/`, so Next.js no
longer serves them and the URLs return 404. They are also absent from the nav,
footer, landing grid, sitemap, `llms.txt`, and JSON-LD, because their entries
were moved out of `CALCULATORS` (into `ARCHIVED_CALCULATORS`) in
`src/lib/calculators.ts`.

Nothing here is compiled or built — `archived/` is excluded in `tsconfig.json`.
Each page's React component (`src/components/`) and lib module (`src/lib/`) were
left in place, so no supporting code was removed.

## Currently archived

| Page                        | Route                         |
| --------------------------- | ----------------------------- |
| Tip Calculator              | `/tip-calculator`             |
| Discount Calculator         | `/discount-calculator`        |
| Savings Goal Calculator     | `/savings-goal-calculator`    |
| Percentage Calculator       | `/percentage-calculator`      |
| Age Calculator              | `/age-calculator`             |
| Unit Converter              | `/unit-converter`             |
| Loan Calculator             | `/loan-calculator`            |
| Mortgage Calculator         | `/mortgage-calculator`        |
| Date Difference Calculator  | `/date-difference-calculator` |

## How to revive a page

To bring one back, do both steps for that page:

1. **Restore the route.** Move its folder back into `src/app/`:

   ```sh
   git mv archived/app/tip-calculator src/app/tip-calculator
   ```

2. **Restore the registry entry.** In `src/lib/calculators.ts`, move that
   page's object from `ARCHIVED_CALCULATORS` back into `CALCULATORS`, placing it
   under the matching `// ── … ──` category comment.

That's all. The nav, footer, landing page, sitemap, `llms.txt`, and JSON-LD all
read from `CALCULATORS`, so the page reappears everywhere automatically.

> Note: the **Financial**, **Math**, and **Utility** categories are currently
> hidden because every calculator in them has been archived. Reviving a page
> from one of those categories brings the category heading back automatically —
> the nav, footer, and landing grid skip empty categories on their own, so no
> extra change is needed.

## To archive another page later

Reverse of the above: `git mv src/app/<route> archived/app/<route>`, move its
entry from `CALCULATORS` into `ARCHIVED_CALCULATORS`, and add a row to the table
here.
