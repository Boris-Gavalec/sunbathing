import type { Metadata } from "next";
import BmiCalculator from "@/components/BmiCalculator";
import { BMI_FAQ } from "@/lib/bmi";

export const metadata: Metadata = {
  title: "BMI Calculator: Body Mass Index & Healthy Weight Range",
  description:
    "Calculate your body mass index (BMI = kg/m²), see your WHO weight category, and find the healthy weight range for your height. Metric and imperial units.",
  alternates: {
    canonical: "https://calcsuite.app/bmi-calculator",
  },
  openGraph: {
    title: "BMI Calculator: Body Mass Index & Healthy Weight Range",
    description:
      "Calculate your BMI, see your WHO weight category, and find the healthy weight range for your height.",
    url: "https://calcsuite.app/bmi-calculator",
    type: "website",
    locale: "en_US",
    siteName: "CalcSuite",
  },
  twitter: {
    title: "BMI Calculator: Body Mass Index & Healthy Weight Range",
    description:
      "Calculate your BMI, see your WHO weight category, and find the healthy weight range for your height.",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BMI Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: "https://calcsuite.app/bmi-calculator",
  image: "https://calcsuite.app/opengraph-image",
  description:
    "Calculate your body mass index, see your WHO weight category, and find the healthy weight range for your height in metric or imperial units.",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BMI_FAQ.map((item) => ({
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
    { "@type": "ListItem", position: 2, name: "BMI Calculator", item: "https://calcsuite.app/bmi-calculator" },
  ],
};

export default function BmiCalculatorPage() {
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
      <BmiCalculator />
    </div>
  );
}
