import TipCalculator from "@/components/TipCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { TIP_FAQ } from "@/lib/tip";

const PATH = "/tip-calculator";
const TITLE = "Tip Calculator — Split a Bill and Work Out the Tip";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Work out the tip and split the bill evenly in seconds. Enter your bill, pick a tip percentage, and see exactly what each person owes. Free, no sign-up.",
  social: "Work out the tip and split the bill evenly in seconds. See exactly what each person owes.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Tip Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",
  description:
    "Calculate the tip on a bill and split the total evenly between any number of people.",
  faq: TIP_FAQ,
});

export default function TipCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <TipCalculator />
      <SiteFooter />
    </div>
  );
}
