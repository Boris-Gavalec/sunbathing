import Calculator from "@/components/Calculator";
import SeoContent from "@/components/SeoContent";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <Calculator />

      <SeoContent />
      <FaqSection />

      <footer className="text-center py-6 text-xs" style={{ color: "var(--text-secondary)" }}>
        <p>
          This calculator is for informational purposes only and is not medical advice.
          Individual UV sensitivity varies. Always consult a healthcare professional for
          personalized sun safety guidance.
        </p>
      </footer>
    </div>
  );
}
