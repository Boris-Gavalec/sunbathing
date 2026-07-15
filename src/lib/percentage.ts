// Pure percentage logic. No React.

export type PercentageMode = "of" | "isWhatPercent" | "change" | "difference";

export const PERCENTAGE_MODES: { id: PercentageMode; label: string; blurb: string }[] = [
  { id: "of", label: "% of a number", blurb: "What is 20% of 250?" },
  { id: "isWhatPercent", label: "X is what % of Y", blurb: "50 is what percent of 250?" },
  { id: "change", label: "% change", blurb: "From 250 to 300 is what change?" },
  { id: "difference", label: "% difference", blurb: "How far apart are 250 and 300?" },
];

/** What is `percent`% of `value`? */
export function percentOf(percent: number, value: number): number {
  return (value * percent) / 100;
}

/** `part` is what percent of `whole`? Null when whole is 0 — nothing is a
 *  meaningful percentage of nothing. */
export function whatPercent(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return (part / whole) * 100;
}

/**
 * Percent change from `from` to `to`. Positive is an increase.
 *
 * Null when `from` is 0: any change from zero is an infinite percentage
 * increase, so there is no number to show.
 */
export function percentChange(from: number, to: number): number | null {
  if (from === 0) return null;
  return ((to - from) / from) * 100;
}

/**
 * Percent difference between two values — how far apart they are relative to
 * their average. Unlike percent change this is symmetric: it has no "from" and
 * "to", so difference(a, b) === difference(b, a).
 *
 * Null when the average is 0, where the ratio is undefined.
 */
export function percentDifference(a: number, b: number): number | null {
  const average = (a + b) / 2;
  if (average === 0) return null;
  return (Math.abs(a - b) / Math.abs(average)) * 100;
}

/** Apply a percentage increase or decrease to a value. */
export function applyPercent(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

export const PERCENTAGE_FAQ: { q: string; a: string }[] = [
  {
    q: "How do I calculate a percentage of a number?",
    a: "Multiply the number by the percentage and divide by 100. For example, 20% of 250 is 250 × 20 ÷ 100 = 50. A useful shortcut: 10% is the number with the decimal point moved one place left, so 20% is just double that.",
  },
  {
    q: "How do I work out percentage change?",
    a: "Subtract the old value from the new one, divide by the old value, and multiply by 100: change = (new − old) ÷ old × 100. Going from 250 to 300 is (300 − 250) ÷ 250 × 100 = a 20% increase. A negative result means a decrease.",
  },
  {
    q: "What is the difference between percentage change and percentage difference?",
    a: "Percentage change has a direction — it measures the move from a starting value to an ending one, so it is not symmetric. Percentage difference compares two values relative to their average and has no direction, so it gives the same answer whichever order you enter them. Use change for before-and-after, and difference for comparing two independent measurements.",
  },
  {
    q: "Why can't I calculate percentage change from zero?",
    a: "Because any increase from zero is infinite in percentage terms. Going from 0 to 50 is not a 50% or 5000% increase — dividing by zero has no answer. When the starting value is zero, report the absolute change instead.",
  },
  {
    q: "Why is a 50% rise then a 50% fall not back where I started?",
    a: "Because each percentage applies to a different base. 100 rising 50% is 150; 150 falling 50% is 75, not 100. The fall is taken from the larger number, so it removes more. This is the same reason a stock that drops 50% needs to gain 100% to recover.",
  },
  {
    q: "What is a percentage point?",
    a: "A percentage point is the plain arithmetic gap between two percentages, while a percent change is relative. If a rate goes from 4% to 5%, that is a rise of one percentage point but a 25% increase. Mixing the two up is a common source of misleading statistics.",
  },
];
