import WaterIntakeCalculator from "@/components/WaterIntakeCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { WATER_FAQ } from "@/lib/water";

const PATH = "/water-intake-calculator";
const TITLE = "Water Intake Calculator — Daily Hydration Target";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Work out how much water you should drink a day, based on your body weight, exercise and climate. A better answer than the old eight-glasses rule. Free, no sign-up.",
  social:
    "Work out how much water you should drink a day, based on your body weight, exercise and climate.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Water Intake Calculator",
  path: PATH,
  applicationCategory: "HealthApplication",
  description:
    "Calculate your daily water intake target from body weight, exercise duration, and climate, in litres, cups, and fluid ounces.",
  faq: WATER_FAQ,
});

export default function WaterIntakeCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <WaterIntakeCalculator />
      <SiteFooter />
    </div>
  );
}
