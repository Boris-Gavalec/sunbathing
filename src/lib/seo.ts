import type { Metadata } from "next";

export const SITE_URL = "https://calcsuite.app";
export const OG_IMAGE = `${SITE_URL}/opengraph-image`;

/**
 * Build the metadata for a calculator route.
 *
 * This exists because of a genuine Next.js footgun: `openGraph` and `twitter`
 * are merged **shallowly**. A page that sets either one replaces the root
 * layout's version wholesale, silently dropping everything it didn't restate —
 * `images`, `siteName`, `locale`, `type`, and `card`. Nothing warns you; the
 * tags just quietly go missing, and pages share with no preview image and a
 * small summary card instead of a large one.
 *
 * Inheritance is not an option here, so every field is restated on every route.
 * Going through this helper is what stops the next calculator forgetting one.
 */
export function calculatorMetadata(opts: {
  /** Unique, ~50-60 chars, primary keyword first. */
  title: string;
  /** Unique, ~120-160 chars. */
  description: string;
  /** Route path including the leading slash, e.g. "/tip-calculator". */
  path: string;
  /** Shorter copy for social cards. Falls back to `description`. */
  social?: string;
}): Metadata {
  const { title, description, path } = opts;
  const social = opts.social ?? description;
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: social,
      url,
      type: "website",
      locale: "en_US",
      siteName: "CalcSuite",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: social,
      images: [OG_IMAGE],
    },
  };
}

/** The three JSON-LD blocks every calculator route emits. The `WebSite` +
 *  `Organization` schema is homepage-only and deliberately not here. */
export function calculatorJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  /** schema.org applicationCategory, e.g. "FinanceApplication". */
  applicationCategory: string;
  faq: { q: string; a: string }[];
}) {
  const url = `${SITE_URL}${opts.path}`;

  return {
    webApp: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: opts.name,
      applicationCategory: opts.applicationCategory,
      operatingSystem: "Any",
      url,
      image: OG_IMAGE,
      description: opts.description,
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CalcSuite", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: opts.name, item: url },
      ],
    },
  };
}
