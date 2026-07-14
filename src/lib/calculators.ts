export type CalculatorCategory = "health" | "education";

export interface CalculatorEntry {
  name: string;
  emoji: string;
  href: string;
  description: string;
  category: CalculatorCategory;
  comingSoon?: boolean;
}

export const CATEGORIES: { id: CalculatorCategory; label: string }[] = [
  { id: "health", label: "Health & Fitness" },
  { id: "education", label: "Education" },
];

export const CALCULATORS: CalculatorEntry[] = [
  {
    name: "Sunbathing Calculator",
    emoji: "☀️",
    href: "/calculator",
    category: "health",
    description:
      "How long can you safely stay in the sun? Based on your skin type, SPF, and the live UV index at your location.",
  },
  {
    name: "Calorie Calculator",
    emoji: "🍎",
    href: "/calorie-calculator",
    category: "health",
    description:
      "Find your daily calorie needs, then plan a cut or bulk with a target weight and see exactly when you'll get there.",
  },
  {
    name: "BMI Calculator",
    emoji: "⚖️",
    href: "/bmi-calculator",
    category: "health",
    description:
      "Check your body mass index, see your WHO weight category, and find the healthy weight range for your height.",
  },
  {
    name: "GPA Calculator",
    emoji: "🎓",
    href: "/gpa-calculator",
    category: "education",
    description:
      "Calculate your semester and cumulative GPA on the 4.0 scale, with optional weighted honors and AP grades.",
  },
  {
    name: "Body Fat Calculator",
    emoji: "🚧",
    href: "#",
    category: "health",
    description:
      "Estimate your body fat percentage from simple tape measurements. Work in progress — coming soon.",
    comingSoon: true,
  },
];
