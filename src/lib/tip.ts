// Pure tip-splitting logic. No React.

export interface TipResult {
  tipAmount: number;
  total: number;
  perPersonTip: number;
  perPersonTotal: number;
}

/** Assumes inputs are already validated: bill >= 0, people >= 1. */
export function computeTip(bill: number, tipPct: number, people: number): TipResult {
  const tipAmount = bill * (tipPct / 100);
  const total = bill + tipAmount;
  return {
    tipAmount,
    total,
    perPersonTip: tipAmount / people,
    perPersonTotal: total / people,
  };
}

export const TIP_PRESETS = [10, 15, 18, 20, 25];

export const TIP_FAQ: { q: string; a: string }[] = [
  {
    q: "How much should I tip?",
    a: "In the United States, 15-20% of the pre-tax bill is standard for sit-down restaurant service, with 20% or more for service you were happy with. Counter service, takeaway, and bars have lower norms — often a dollar or two, or 10%. Tipping customs vary widely by country, so treat these as US-centric guidance rather than a universal rule.",
  },
  {
    q: "Should I tip on the pre-tax or post-tax total?",
    a: "Tipping on the pre-tax amount is the traditional convention, since the tax is not part of the service you received. Many people tip on the post-tax total anyway because it is easier to work out, and the difference is usually small. Enter whichever figure you prefer as the bill amount.",
  },
  {
    q: "How is the tip calculated?",
    a: "The tip is the bill multiplied by the tip percentage: tip = bill × (percent ÷ 100). The total is the bill plus that tip. When you split the bill, both the tip and the total are divided evenly by the number of people.",
  },
  {
    q: "How do I split a bill unevenly?",
    a: "This calculator splits evenly, which covers most situations. For an uneven split, work out each person's share of the bill first, then apply the same tip percentage to each share — the percentages stay the same, so everyone contributes proportionally to what they ordered.",
  },
  {
    q: "Should I round the per-person amount up?",
    a: "Rounding up to the nearest dollar is common and makes the cash easier to handle. If you are splitting several ways, rounding each person up slightly also covers any shortfall from rounding the tip itself.",
  },
];
