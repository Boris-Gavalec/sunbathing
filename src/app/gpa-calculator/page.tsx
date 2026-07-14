import type { Metadata } from "next";
import GpaCalculator from "@/components/GpaCalculator";
import { GPA_FAQ } from "@/lib/gpa";

export const metadata: Metadata = {
  title: "GPA Calculator — College & High School GPA on the 4.0 Scale",
  description:
    "Calculate your semester GPA on the 4.0 scale with letter grades and credits. Supports weighted honors/AP grades and cumulative GPA across semesters.",
  alternates: {
    canonical: "https://calcsuite.app/gpa-calculator",
  },
  openGraph: {
    title: "GPA Calculator — College & High School GPA on the 4.0 Scale",
    description:
      "Calculate your semester and cumulative GPA on the 4.0 scale, with optional weighted honors and AP grades.",
    url: "https://calcsuite.app/gpa-calculator",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GPA Calculator",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  url: "https://calcsuite.app/gpa-calculator",
  description:
    "Calculate your semester and cumulative GPA on the 4.0 scale using letter grades and credit hours, with optional weighted honors and AP grades.",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GPA_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CalcSuite", item: "https://calcsuite.app" },
    { "@type": "ListItem", position: 2, name: "GPA Calculator", item: "https://calcsuite.app/gpa-calculator" },
  ],
};

export default function GpaCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GpaCalculator />
    </div>
  );
}
