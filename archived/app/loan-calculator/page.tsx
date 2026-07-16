import LoanCalculator from "@/components/LoanCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { LOAN_FAQ } from "@/lib/loan";

const PATH = "/loan-calculator";
const TITLE = "Loan Calculator — Monthly EMI, Interest & Amortization";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your monthly loan payment (EMI), total interest, and full amortization schedule from the principal, interest rate, and term. Free, no sign-up.",
  social: "Calculate your monthly loan payment (EMI), total interest, and amortization schedule.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Loan Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",
  description:
    "Calculate the monthly payment, total interest, and amortization schedule for a loan from its principal, rate, and term.",
  faq: LOAN_FAQ,
});

export default function LoanCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <LoanCalculator />
      <SiteFooter />
    </div>
  );
}
