import UnitConverter from "@/components/UnitConverter";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { UNITS_FAQ } from "@/lib/units";

const PATH = "/unit-converter";
const TITLE = "Unit Converter — Length, Weight & Temperature";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Convert length, weight and temperature between metric and imperial units — cm to inches, kg to pounds, Celsius to Fahrenheit and more. Free and instant.",
  social:
    "Convert length, weight and temperature between metric and imperial units — instantly and for free.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "Unit Converter",
  path: PATH,
  applicationCategory: "UtilitiesApplication",
  description:
    "Convert between metric and imperial units of length, weight and temperature, including Celsius, Fahrenheit and Kelvin.",
  faq: UNITS_FAQ,
});

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <UnitConverter />
      <SiteFooter />
    </div>
  );
}
