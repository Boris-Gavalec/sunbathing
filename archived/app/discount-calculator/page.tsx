import DiscountCalculator from "@/components/DiscountCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { DISCOUNT_FAQ } from "@/lib/discount";

const PATH = "/discount-calculator";
const TITLE = "Discount Calculator — Sale Price and How Much You Save";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Work out the sale price and exactly what you save from any percentage off. Handles stacked discounts too — see why 20% then 10% off is 28%, not 30%.",
  social:
    "Work out the sale price and exactly what you save from any percentage off, including stacked discounts.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Discount Calculator",
  path: PATH,
  applicationCategory: "FinanceApplication",
  description:
    "Calculate the sale price and amount saved from a percentage discount, including stacked discounts.",
  faq: DISCOUNT_FAQ,
});

export default function DiscountCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <DiscountCalculator />
      <SiteFooter />
    </div>
  );
}
