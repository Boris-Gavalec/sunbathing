// Shared amortization and savings math. No React.
// Consumed by the Loan, Mortgage, and Savings Goal calculators.

const MONEY_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const MONEY_FORMAT_WHOLE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Format a currency amount. Pass `whole` for large headline figures where
 *  cents are noise (total interest over 30 years, say). */
export function formatMoney(value: number, whole = false): string {
  if (!Number.isFinite(value)) return "—";
  return (whole ? MONEY_FORMAT_WHOLE : MONEY_FORMAT).format(value);
}

/**
 * Standard amortizing monthly payment (the "EMI" formula):
 *
 *   P = principal · r / (1 − (1 + r)^−n)      where r = monthly rate
 *
 * At r = 0 that expression is 0/0, so the zero-rate case is handled separately
 * as a flat principal / n. Callers must pass months > 0.
 */
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  months: number
): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export interface AmortizationTotals {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function amortizationTotals(
  principal: number,
  annualRatePct: number,
  months: number
): AmortizationTotals {
  const payment = monthlyPayment(principal, annualRatePct, months);
  const totalPaid = payment * months;
  return {
    monthlyPayment: payment,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}

/**
 * Future value of a series of end-of-month contributions plus a starting
 * balance, compounded monthly:
 *
 *   FV = present·(1 + r)^n + contribution·((1 + r)^n − 1) / r
 *
 * The annuity term is 0/0 at r = 0, so that case degrades to simple addition.
 */
export function futureValueOfAnnuity(
  present: number,
  monthlyContribution: number,
  annualRatePct: number,
  months: number
): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return present + monthlyContribution * months;
  const growth = Math.pow(1 + r, months);
  return present * growth + monthlyContribution * ((growth - 1) / r);
}

/**
 * Months needed for `present` plus monthly contributions to reach `target`.
 *
 * Returns 0 if the goal is already met, and null if it can never be reached —
 * which happens when there is no contribution and no interest to grow the
 * balance. Callers must render the null case rather than a number.
 *
 * Solved by stepping month by month rather than inverting the FV formula: the
 * closed form needs a logarithm whose argument goes negative in exactly the
 * unreachable cases, and the loop keeps the boundary conditions obvious.
 */
export function monthsToReachGoal(
  present: number,
  monthlyContribution: number,
  annualRatePct: number,
  target: number,
  maxMonths = 100 * 12
): number | null {
  if (present >= target) return 0;
  const r = annualRatePct / 100 / 12;
  // No contribution and no growth (or shrinking) can never close the gap.
  if (monthlyContribution <= 0 && r <= 0) return null;

  let balance = present;
  for (let month = 1; month <= maxMonths; month++) {
    balance = balance * (1 + r) + monthlyContribution;
    if (balance >= target) return month;
  }
  return null;
}
