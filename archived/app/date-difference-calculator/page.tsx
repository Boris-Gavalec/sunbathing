import DateDifferenceCalculator from "@/components/DateDifferenceCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { DATEDIFF_FAQ } from "@/lib/datediff";

const PATH = "/date-difference-calculator";
const TITLE = "Date Difference Calculator — Days Between Two Dates";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Count the days between two dates, or the days until a future one. Shows weeks, business days, and an exact years-months-days breakdown. Free, no sign-up.",
  social:
    "Count the days between two dates, or the days until a future one, with weeks and business days.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Date Difference Calculator",
  path: PATH,
  applicationCategory: "UtilitiesApplication",
  description:
    "Calculate the number of days, weeks and business days between two dates, or count down to a future date.",
  faq: DATEDIFF_FAQ,
});

export default function DateDifferenceCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <DateDifferenceCalculator />
      <SiteFooter />
    </div>
  );
}
