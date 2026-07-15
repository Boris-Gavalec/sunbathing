import PercentageCalculator from "@/components/PercentageCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { PERCENTAGE_FAQ } from "@/lib/percentage";

const PATH = "/percentage-calculator";
const TITLE = "Percentage Calculator — Percent Of, Change & Difference";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Work out a percentage of a number, percentage change between two values, and percentage difference — all in one place, with the formula shown. Free, no sign-up.",
  social:
    "Work out a percentage of a number, percentage change, and percentage difference in one place.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Percentage Calculator",
  path: PATH,
  applicationCategory: "UtilitiesApplication",
  description:
    "Calculate a percentage of a number, what percent one number is of another, percentage change, and percentage difference.",
  faq: PERCENTAGE_FAQ,
});

export default function PercentageCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <PercentageCalculator />
      <SiteFooter />
    </div>
  );
}
