export type CalculatorCategory =
  | "health"
  | "education"
  | "finance"
  | "math"
  | "utility";

export interface CalculatorEntry {
  name: string;
  emoji: string;
  href: string;
  /** One short phrase for the landing card. Keep it ~8-10 words: the card grid
   *  is 5 across on desktop, so anything longer wraps into a very tall card. */
  description: string;
  category: CalculatorCategory;
  comingSoon?: boolean;
}

export const CATEGORIES: { id: CalculatorCategory; label: string }[] = [
  { id: "health", label: "Health & Fitness" },
  { id: "education", label: "Education" },
  { id: "finance", label: "Financial" },
  { id: "math", label: "Math" },
  { id: "utility", label: "Utility" },
];

export const CALCULATORS: CalculatorEntry[] = [
  // ── Health & Fitness ──
  {
    name: "Sunbathing Calculator",
    emoji: "☀️",
    href: "/calculator",
    category: "health",
    description: "Safe sun time from your skin type, SPF, and live UV.",
  },
  {
    name: "Calorie Calculator",
    emoji: "🍎",
    href: "/calorie-calculator",
    category: "health",
    description: "Daily calorie needs, plus a cut or bulk plan.",
  },
  {
    name: "BMI Calculator",
    emoji: "⚖️",
    href: "/bmi-calculator",
    category: "health",
    description: "Body mass index, WHO category, and healthy weight range.",
  },
  {
    name: "Water Intake Calculator",
    emoji: "💧",
    href: "/water-intake-calculator",
    category: "health",
    description: "Daily hydration target from your weight and activity level.",
  },
  {
    name: "Pace Calculator",
    emoji: "🏃",
    href: "/pace-calculator",
    category: "health",
    description: "Running pace, speed, time, and distance — solve any one.",
  },
  {
    name: "Body Fat Calculator",
    emoji: "📏",
    href: "#",
    category: "health",
    description: "Body fat percentage from simple tape measurements.",
    comingSoon: true,
  },
  {
    name: "Vitamin D Calculator",
    emoji: "💊",
    href: "#",
    category: "health",
    description: "Sun exposure needed to hit your daily vitamin D target.",
    comingSoon: true,
  },
  {
    name: "Sunscreen Timer",
    emoji: "⏲️",
    href: "#",
    category: "health",
    description: "When to reapply, accounting for water and sweat.",
    comingSoon: true,
  },

  // ── Education ──
  {
    name: "GPA Calculator",
    emoji: "🎓",
    href: "/gpa-calculator",
    category: "education",
    description: "Semester and cumulative GPA on the 4.0 scale.",
  },
  {
    name: "Flashcards",
    emoji: "🗂️",
    href: "#",
    category: "education",
    description: "Turn your notes into study flashcards. Coming soon.",
    comingSoon: true,
  },

  // ── Financial ──
  {
    name: "Tip Calculator",
    emoji: "💵",
    href: "/tip-calculator",
    category: "finance",
    description: "Tip amount and the split per person, done fast.",
  },
  {
    name: "Discount Calculator",
    emoji: "🏷️",
    href: "/discount-calculator",
    category: "finance",
    description: "Sale price and what you actually save.",
  },
  {
    name: "Loan Calculator",
    emoji: "🏦",
    href: "/loan-calculator",
    category: "finance",
    description: "Monthly EMI, total interest, and total repaid.",
  },
  {
    name: "Mortgage Calculator",
    emoji: "🏠",
    href: "/mortgage-calculator",
    category: "finance",
    description: "Full monthly payment with tax, insurance, and PMI.",
  },
  {
    name: "Savings Goal Calculator",
    emoji: "🎯",
    href: "/savings-goal-calculator",
    category: "finance",
    description: "How long until you reach your savings target.",
  },

  // ── Math ──
  {
    name: "Percentage Calculator",
    emoji: "🔢",
    href: "/percentage-calculator",
    category: "math",
    description: "Percent of a number, percent change, and difference.",
  },

  // ── Utility ──
  {
    name: "Age Calculator",
    emoji: "🎂",
    href: "/age-calculator",
    category: "utility",
    description: "Exact age in years, months, and days.",
  },
  {
    name: "Unit Converter",
    emoji: "📐",
    href: "/unit-converter",
    category: "utility",
    description: "Length, weight, and temperature — converted instantly.",
  },
  {
    name: "Date Difference Calculator",
    emoji: "📅",
    href: "/date-difference-calculator",
    category: "utility",
    description: "Days between two dates, or a countdown to one.",
  },
];
