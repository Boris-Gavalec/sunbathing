import PaceCalculator from "@/components/PaceCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { PACE_FAQ } from "@/lib/pace";

const PATH = "/pace-calculator";
const TITLE = "Pace Calculator — Running Pace, Speed, Time & Distance";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate running pace, speed, finish time or distance — enter any two and get the third. Converts min/km to min/mile and projects 5K, 10K, half and marathon times.",
  social: "Calculate running pace, speed, finish time or distance — enter any two and get the third.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Pace Calculator",
  path: PATH,
  applicationCategory: "HealthApplication",
  description:
    "Calculate running pace, speed, finish time, or distance from any two of the three, with race time projections.",
  faq: PACE_FAQ,
});

export default function PaceCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <PaceCalculator />
      <SiteFooter />
    </div>
  );
}
