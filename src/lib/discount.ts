// Pure discount / sale price logic. No React.

export interface DiscountResult {
  saved: number;
  finalPrice: number;
  /** Final price as a share of the original, e.g. 0.7 for 30% off. */
  fractionOfOriginal: number;
}

/** Assumes original >= 0 and percentOff is validated to 0-100. */
export function computeDiscount(original: number, percentOff: number): DiscountResult {
  const saved = original * (percentOff / 100);
  const finalPrice = original - saved;
  return {
    saved,
    finalPrice,
    fractionOfOriginal: original === 0 ? 0 : finalPrice / original,
  };
}

/**
 * Work backwards: what percentage off turns `original` into `finalPrice`?
 * Returns null for a non-positive original, where the question is meaningless.
 */
export function percentOffFromPrices(original: number, finalPrice: number): number | null {
  if (original <= 0) return null;
  return ((original - finalPrice) / original) * 100;
}

/**
 * Apply a second discount to an already-discounted price. Stacked discounts
 * multiply rather than add — 20% off then 10% off is 28% off, not 30%.
 */
export function stackDiscounts(original: number, first: number, second: number): number {
  return original * (1 - first / 100) * (1 - second / 100);
}

export const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50, 70];

export const DISCOUNT_FAQ: { q: string; a: string }[] = [
  {
    q: "How do I calculate a percentage discount?",
    a: "Multiply the original price by the discount percentage divided by 100 to get the amount you save, then subtract that from the original price. For example, 30% off $80 is $80 × 0.30 = $24 saved, leaving a final price of $56. A shortcut: the final price is the original × (1 − percent ÷ 100).",
  },
  {
    q: "How do two stacked discounts work?",
    a: "Stacked discounts multiply, they do not add. An extra 10% off an item already reduced by 20% is not 30% off — it is 0.8 × 0.9 = 0.72, so 28% off. The second discount applies to the already-reduced price, which is always smaller than the original.",
  },
  {
    q: "How do I find the percentage off from two prices?",
    a: "Subtract the sale price from the original, divide by the original, and multiply by 100: percent off = (original − sale) ÷ original × 100. An item down from $50 to $35 is (50 − 35) ÷ 50 × 100 = 30% off.",
  },
  {
    q: "Is the discount applied before or after tax?",
    a: "Discounts are normally applied to the pre-tax price, with sales tax or VAT then calculated on the reduced amount — so a discount also reduces the tax you pay. This calculator works with pre-tax figures; add tax to the final price shown if you need the amount at the till.",
  },
  {
    q: "What does a discount of 50% off really save?",
    a: "Exactly half the original price. It is worth checking the original against the usual selling price though: a large advertised discount from an inflated 'was' price can be worth less than a smaller discount from a genuine one.",
  },
];
