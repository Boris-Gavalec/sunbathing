import { CALCULATORS } from "@/lib/calculators";

const BASE_URL = "https://calcsuite.app";

// Serve an llms.txt (https://llmstxt.org): a curated, plain-language guide
// for LLM-based crawlers. Generated from the same CALCULATORS source as the
// sitemap and robots files so it never drifts out of sync.
export const dynamic = "force-static";

export function GET() {
  const live = CALCULATORS.filter((calc) => !calc.comingSoon);
  const comingSoon = CALCULATORS.filter((calc) => calc.comingSoon);

  const lines = [
    "# CalcSuite",
    "",
    "> Free, fast online calculators for health and education — safe sun " +
      "exposure, daily calories, BMI, and GPA. No sign-up, no account, just a " +
      "clear answer backed by a transparent formula.",
    "",
    "Every calculator runs in the browser, works on any device, and shows the " +
      "exact formula behind its result rather than a black-box number. Live UV " +
      "data for the Sunbathing Calculator comes from Open-Meteo based on the " +
      "visitor's location.",
    "",
    "## Calculators",
    "",
    ...live.map((calc) => `- [${calc.name}](${BASE_URL}${calc.href}): ${calc.description}`),
  ];

  if (comingSoon.length > 0) {
    lines.push(
      "",
      "## Coming soon",
      "",
      ...comingSoon.map((calc) => `- ${calc.name}: ${calc.description}`),
    );
  }

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
