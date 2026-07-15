import BmiCalculator from "@/components/BmiCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { BMI_FAQ } from "@/lib/bmi";

const PATH = "/bmi-calculator";
const TITLE = "BMI Calculator — Body Mass Index & Healthy Weight Range";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your body mass index (BMI = kg/m²), see your WHO weight category, and find the healthy weight range for your height. Metric and imperial units.",
  social:
    "Calculate your BMI, see your WHO weight category, and find the healthy weight range for your height.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "BMI Calculator",
  path: PATH,
  applicationCategory: "HealthApplication",
  description:
    "Calculate your body mass index, see your WHO weight category, and find the healthy weight range for your height in metric or imperial units.",
  faq: BMI_FAQ,
});

export default function BmiCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <BmiCalculator />
      <SiteFooter />
    </div>
  );
}
