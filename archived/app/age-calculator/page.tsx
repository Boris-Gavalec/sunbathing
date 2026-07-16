import AgeCalculator from "@/components/AgeCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { AGE_FAQ } from "@/lib/age";

const PATH = "/age-calculator";
const TITLE = "Age Calculator — Your Exact Age in Years, Months & Days";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your exact age from your date of birth in years, months and days, plus total days, weeks and your next birthday. Leap years handled correctly.",
  social:
    "Calculate your exact age from your date of birth, plus total days, weeks and your next birthday.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Age Calculator",
  path: PATH,
  applicationCategory: "UtilitiesApplication",
  description:
    "Calculate exact age from a date of birth in years, months and days, with total days, weeks and next birthday.",
  faq: AGE_FAQ,
});

export default function AgeCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <AgeCalculator />
      <SiteFooter />
    </div>
  );
}
