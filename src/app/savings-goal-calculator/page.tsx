import SavingsGoalCalculator from "@/components/SavingsGoalCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { SAVINGS_FAQ } from "@/lib/savings";

const PATH = "/savings-goal-calculator";
const TITLE = "Savings Goal Calculator — How Long to Reach Your Target";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Find out how long it takes to reach a savings goal from your monthly contribution and interest rate. See how much comes from compounding versus your own money.",
  social:
    "Find out how long it takes to reach a savings goal from your monthly contribution and interest rate.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Savings Goal Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",
  description:
    "Calculate how long it takes to reach a savings target given a starting balance, monthly contribution, and compound interest rate.",
  faq: SAVINGS_FAQ,
});

export default function SavingsGoalCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <SavingsGoalCalculator />
      <SiteFooter />
    </div>
  );
}
