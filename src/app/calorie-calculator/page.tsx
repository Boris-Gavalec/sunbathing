import type { Metadata } from "next";
import CalorieCalculator from "@/components/CalorieCalculator";
import { CALORIE_FAQ } from "@/lib/calories";

export const metadata: Metadata = {
  title: "Calorie Calculator — Daily Intake, Cutting & Bulking Planner",
  description:
    "Calculate your daily calorie needs with the Mifflin-St Jeor formula, then plan a cut or bulk. Get your BMR, TDEE, target calories, and a projected goal date.",
  alternates: {
    canonical: "https://calcsuite.app/calorie-calculator",
  },
  openGraph: {
    title: "Calorie Calculator — Daily Intake, Cutting & Bulking Planner",
    description:
      "Calculate your daily calorie needs (BMR and TDEE) and plan a cut or bulk with a projected goal date.",
    url: "https://calcsuite.app/calorie-calculator",
    type: "website",
    locale: "en_US",
    siteName: "CalcSuite",
  },
  twitter: {
    title: "Calorie Calculator — Daily Intake, Cutting & Bulking Planner",
    description:
      "Calculate your daily calorie needs (BMR and TDEE) and plan a cut or bulk with a projected goal date.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CalcSuite", item: "https://calcsuite.app" },
    { "@type": "ListItem", position: 2, name: "Calorie Calculator", item: "https://calcsuite.app/calorie-calculator" },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calorie Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: "https://calcsuite.app/calorie-calculator",
  image: "https://calcsuite.app/opengraph-image",
  description:
    "Calculate your daily calorie needs (BMR and TDEE) and plan a cut or bulk with a target weight, pace, and projected goal date.",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CALORIE_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function CalorieCalculatorPage() {
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
      <CalorieCalculator />
    </div>
  );
}
