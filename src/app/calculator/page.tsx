import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import SeoContent from "@/components/SeoContent";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Sunbathing Calculator — Safe Sun Exposure Time by Skin Type & SPF",
  description:
    "Enter your Fitzpatrick skin type, SPF value, and UV index to calculate your maximum safe sunbathing time. Live UV data from Open-Meteo.",
  alternates: {
    canonical: "https://calcsuite.app/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
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
    </div>
  );
}
