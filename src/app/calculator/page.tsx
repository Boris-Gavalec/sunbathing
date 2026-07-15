import Link from "next/link";
import Calculator from "@/components/Calculator";
import SeoContent from "@/components/SeoContent";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { calculatorMetadata } from "@/lib/seo";

export const metadata = calculatorMetadata({
  title: "Sunbathing Calculator: Safe Sun Exposure by Skin Type & SPF",
  description:
    "Enter your Fitzpatrick skin type, SPF value, and UV index to calculate your maximum safe sunbathing time. Live UV data from Open-Meteo.",
  social:
    "Calculate your maximum safe sunbathing time from your skin type, SPF, and the live UV index.",
  path: "/calculator",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CalcSuite", item: "https://calcsuite.app" },
    { "@type": "ListItem", position: 2, name: "Sunbathing Calculator", item: "https://calcsuite.app/calculator" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long can I stay in the sun without sunscreen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your skin type and the current UV index. Fair skin (Type I) can burn in as little as 10 minutes under high UV, while darker skin (Type V-VI) has significantly more natural protection. Use a sunbathing calculator with SPF set to 1 to estimate your safe time.",
      },
    },
    {
      "@type": "Question",
      name: "What does SPF actually mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SPF stands for Sun Protection Factor. The number indicates how much longer you can stay in the sun compared to unprotected skin. SPF 30 means you can stay out roughly 30 times longer. Reapply every 2 hours for best results.",
      },
    },
    {
      "@type": "Question",
      name: "How does skin type affect sun exposure time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Fitzpatrick scale classifies skin into six types. Type I (very fair, always burns) has the lowest natural tolerance, while Type VI (deeply pigmented, never burns) has the highest. Your skin type determines your base safe exposure time before UV and SPF adjustments.",
      },
    },
    {
      "@type": "Question",
      name: "What UV index is dangerous?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UV index 1-2 is low risk. At 3-5 (moderate), unprotected skin can burn in 30-45 minutes. At 6-7 (high), reduce midday exposure. At 8-10 (very high), seek shade and wear sunscreen. Above 11 (extreme), avoid prolonged outdoor exposure.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is a sunbathing calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sunbathing calculators provide estimates based on skin type, SPF, and UV index. Real-world factors like cloud cover, altitude, water reflection, and individual sensitivity can affect results. Always treat results as guidelines and err on the side of caution.",
      },
    },
    {
      "@type": "Question",
      name: "Should I avoid the sun completely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Moderate sun exposure is beneficial for vitamin D production. The goal is to enjoy the sun safely. Know your limits based on your skin type, use sunscreen when needed, seek shade during peak hours (10 AM to 4 PM), and monitor the UV index.",
      },
    },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sunbathing Calculator",
  description:
    "Calculate your maximum safe sun exposure time based on skin type, SPF sunscreen, and UV index.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  url: "https://calcsuite.app/calculator",
  image: "https://calcsuite.app/opengraph-image",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Calculator />

      <nav
        aria-label="In-page navigation"
        className="flex flex-wrap gap-4 justify-center px-4 py-6 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        <Link href="/" style={{ color: "var(--accent)" }} className="hover:underline">
          ← Home
        </Link>
        <Link href="#how-it-works" style={{ color: "var(--accent)" }} className="hover:underline">
          How it works
        </Link>
        <Link href="#faq" style={{ color: "var(--accent)" }} className="hover:underline">
          FAQ
        </Link>
      </nav>

      <div id="how-it-works">
        <SeoContent />
      </div>

      <div id="faq">
        <FaqSection />
      </div>

      <footer className="text-center py-6 text-xs" style={{ color: "var(--text-secondary)" }}>
        <p>
          This calculator is for informational purposes only and is not medical advice.
          Individual UV sensitivity varies. Always consult a healthcare professional for
          personalized sun safety guidance.
        </p>
        <p className="mt-2">
          <Link href="/" style={{ color: "var(--accent)" }} className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </footer>

      <SiteFooter />
    </div>
  );
}
