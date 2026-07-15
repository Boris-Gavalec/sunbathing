import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";

const BASE_URL = "https://calcsuite.app";

// Fallback used only when the git history can't be read at build time
// (e.g. building from a source tarball rather than a git checkout).
const FALLBACK_LAST_MODIFIED = "2026-07-14T23:32:10+02:00";

// Map a route to the source file that defines it, so we can report a
// lastmod that reflects when the page actually changed. Google only trusts
// lastmod when it's verifiably accurate, so we tie it to the real commit
// date instead of the build timestamp (which would change on every deploy).
function sourceFileForHref(href: string): string {
  return href === "/" ? "src/app/page.tsx" : `src/app${href}/page.tsx`;
}

function lastModifiedForHref(href: string): string {
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", sourceFileForHref(href)],
      { encoding: "utf8" },
    ).trim();
    return date || FALLBACK_LAST_MODIFIED;
  } catch {
    return FALLBACK_LAST_MODIFIED;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: lastModifiedForHref("/"),
    },
    ...CALCULATORS.filter((calc) => !calc.comingSoon).map((calc) => ({
      url: `${BASE_URL}${calc.href}`,
      lastModified: lastModifiedForHref(calc.href),
    })),
  ];
}
