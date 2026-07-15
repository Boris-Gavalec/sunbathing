// Pure savings-goal logic. No React.
// Compounding maths is shared with the rest of the finance tools in @/lib/finance.

import { futureValueOfAnnuity, monthsToReachGoal } from "@/lib/finance";

export interface SavingsResult {
  /** null when the goal is unreachable — no contribution and no growth. */
  months: number | null;
  years: number;
  remainingMonths: number;
  /** Only the money you put in yourself, including the starting balance. */
  totalContributed: number;
  interestEarned: number;
  finalBalance: number;
  alreadyMet: boolean;
}

/** Assumes target > 0 and contributions/rate are validated numbers. */
export function computeSavingsGoal(
  present: number,
  monthlyContribution: number,
  annualRatePct: number,
  target: number
): SavingsResult {
  const months = monthsToReachGoal(present, monthlyContribution, annualRatePct, target);

  if (months === null) {
    return {
      months: null,
      years: 0,
      remainingMonths: 0,
      totalContributed: present,
      interestEarned: 0,
      finalBalance: present,
      alreadyMet: false,
    };
  }

  const finalBalance = futureValueOfAnnuity(
    present,
    monthlyContribution,
    annualRatePct,
    months
  );
  const totalContributed = present + monthlyContribution * months;

  return {
    months,
    years: Math.floor(months / 12),
    remainingMonths: months % 12,
    totalContributed,
    // Interest is whatever the balance gained beyond what you put in.
    interestEarned: Math.max(finalBalance - totalContributed, 0),
    finalBalance,
    alreadyMet: months === 0,
  };
}

/** Contribution needed to hit `target` in exactly `months`, given compounding.
 *  Returns null if the starting balance alone already grows past the target. */
export function requiredMonthlyContribution(
  present: number,
  annualRatePct: number,
  target: number,
  months: number
): number | null {
  if (months <= 0) return null;
  const r = annualRatePct / 100 / 12;
  const growth = Math.pow(1 + r, months);
  const grownPresent = present * growth;
  if (grownPresent >= target) return null;

  const shortfall = target - grownPresent;
  // The annuity factor is n at r = 0, where the usual expression is 0/0.
  const annuityFactor = r === 0 ? months : (growth - 1) / r;
  return shortfall / annuityFactor;
}

export const SAVINGS_FAQ: { q: string; a: string }[] = [
  {
    q: "How is the time to reach a savings goal calculated?",
    a: "Each month your balance earns interest at one twelfth of the annual rate, then your contribution is added. The calculator steps forward month by month until the balance reaches your target, which handles compounding exactly and copes with edge cases like a zero interest rate.",
  },
  {
    q: "What is compound interest?",
    a: "Compound interest is interest earned on your interest, not just on what you deposited. Because each month's interest joins the balance, the following month earns a little more. Over a long period this snowballs — it is why starting early matters more than contributing slightly more later.",
  },
  {
    q: "What interest rate should I use?",
    a: "Use the rate your account actually pays. For a savings account that is the quoted APY, often 0.5% to 5% depending on the account and the times. For long-term investment goals people often assume 6-7% as a historical stock market average, but that is an average across decades, not a guarantee for any given year.",
  },
  {
    q: "Why does my goal say it can never be reached?",
    a: "That happens when there is nothing to grow the balance: no monthly contribution and no interest, or a negative rate eroding it. With no money going in and no growth, the balance never rises, so the target is genuinely unreachable. Add a contribution or a positive rate.",
  },
  {
    q: "Does this account for inflation?",
    a: "No — the result is in nominal terms, so $50,000 in fifteen years will buy less than $50,000 does today. To think in today's money, use a real rate of return: subtract expected inflation from your rate. If you expect 7% growth and 3% inflation, enter roughly 4%.",
  },
  {
    q: "Should I contribute more or invest at a higher rate?",
    a: "For short goals, contributions dominate — there simply is not time for compounding to matter much. For long goals the rate matters increasingly, because interest compounds on interest. The comparison of what you contributed against what you earned in interest, shown alongside the result, makes the split clear for your particular numbers.",
  },
];
