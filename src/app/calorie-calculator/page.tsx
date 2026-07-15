import CalorieCalculator from "@/components/CalorieCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { CALORIE_FAQ } from "@/lib/calories";

const PATH = "/calorie-calculator";
const TITLE = "Calorie Calculator: Daily Intake, Cutting & Bulking Planner";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your daily calorie needs with the Mifflin-St Jeor formula, then plan a cut or bulk. Get your BMR, TDEE, target calories, and a projected goal date.",
  social:
    "Calculate your daily calorie needs (BMR and TDEE) and plan a cut or bulk with a projected goal date.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Calorie Calculator",
  path: PATH,
  applicationCategory: "HealthApplication",
  description:
    "Calculate your daily calorie needs using the Mifflin-St Jeor equation, with BMR, TDEE, target intake, and a projected goal date for a cut or bulk.",
  faq: CALORIE_FAQ,
});

export default function CalorieCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <CalorieCalculator />
      <SiteFooter />
    </div>
  );
}
