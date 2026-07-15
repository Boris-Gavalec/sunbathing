import MortgageCalculator from "@/components/MortgageCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { MORTGAGE_FAQ } from "@/lib/mortgage";

const PATH = "/mortgage-calculator";
const TITLE = "Mortgage Calculator — Payment with Tax, Insurance & PMI";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your true monthly mortgage payment — principal, interest, property tax, homeowners insurance and PMI. Compare 15 and 30-year terms and total interest.",
  social:
    "Calculate your true monthly mortgage payment — principal, interest, property tax, insurance and PMI.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Mortgage Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",
  description:
    "Calculate a full monthly mortgage payment including principal, interest, property tax, homeowners insurance, and PMI.",
  faq: MORTGAGE_FAQ,
});

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <MortgageCalculator />
      <SiteFooter />
    </div>
  );
}
