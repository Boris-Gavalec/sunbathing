import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";

const BASE_URL = "https://calcsuite.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CALCULATORS.filter((calc) => !calc.comingSoon).map((calc) => ({
      url: `${BASE_URL}${calc.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
