import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://calcsuite.app",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://calcsuite.app/calculator",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://calcsuite.app/calorie-calculator",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
