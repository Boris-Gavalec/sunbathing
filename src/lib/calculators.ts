export interface CalculatorEntry {
  name: string;
  emoji: string;
  href: string;
  description: string;
  comingSoon?: boolean;
}

export const CALCULATORS: CalculatorEntry[] = [
  {
    name: "Sunbathing Calculator",
    emoji: "☀️",
    href: "/calculator",
    description:
      "How long can you safely stay in the sun? Based on your skin type, SPF, and the live UV index at your location.",
  },
  {
    name: "Calorie Calculator",
    emoji: "🍎",
    href: "/calorie-calculator",
    description:
      "Find your daily calorie needs, then plan a cut or bulk with a target weight and see exactly when you'll get there.",
  },
  {
    name: "Body Fat Calculator",
    emoji: "🚧",
    href: "#",
    description:
      "Estimate your body fat percentage from simple tape measurements. Work in progress — coming soon.",
    comingSoon: true,
  },
];
