import GpaCalculator from "@/components/GpaCalculator";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";
import { GPA_FAQ } from "@/lib/gpa";

const PATH = "/gpa-calculator";
const TITLE = "GPA Calculator: College & High School GPA on the 4.0 Scale";

export const metadata = calculatorMetadata({
  title: TITLE,
  description:
    "Calculate your semester GPA on the 4.0 scale with letter grades and credits. Supports weighted honors/AP grades and cumulative GPA across semesters.",
  social:
    "Calculate your semester and cumulative GPA on the 4.0 scale, with optional weighted honors and AP grades.",
  path: PATH,
});

const schema = calculatorJsonLd({
  name: "GPA Calculator",
  path: PATH,
  applicationCategory: "EducationalApplication",
  description:
    "Calculate your semester and cumulative GPA on the 4.0 scale using letter grades and credit hours, with optional weighted honors and AP grades.",
  faq: GPA_FAQ,
});

export default function GpaCalculatorPage() {
  return (
    <div className="min-h-screen bg-page">
      <JsonLd schemas={[schema.webApp, schema.faq, schema.breadcrumb]} />
      <GpaCalculator />
      <SiteFooter />
    </div>
  );
}
