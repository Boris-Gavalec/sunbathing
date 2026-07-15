// Pure loan / EMI logic. No React.
// The amortization maths itself lives in @/lib/finance and is shared with the
// Mortgage calculator.

import { amortizationTotals, monthlyPayment } from "@/lib/finance";

export interface LoanResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  /** Interest as a share of the amount borrowed, e.g. 0.28 = 28% of principal. */
  interestRatio: number;
  months: number;
}

/** Assumes principal > 0 and months > 0. Rate may legitimately be 0. */
export function computeLoan(
  principal: number,
  annualRatePct: number,
  months: number
): LoanResult {
  const totals = amortizationTotals(principal, annualRatePct, months);
  return {
    ...totals,
    interestRatio: principal === 0 ? 0 : totals.totalInterest / principal,
    months,
  };
}

export interface AmortizationRow {
  month: number;
  interest: number;
  principal: number;
  balance: number;
}

/**
 * Month-by-month amortization schedule. Interest is charged on the outstanding
 * balance, so early payments are mostly interest and later ones mostly
 * principal — that crossover is the point of showing the schedule at all.
 */
export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  months: number
): AmortizationRow[] {
  const payment = monthlyPayment(principal, annualRatePct, months);
  const r = annualRatePct / 100 / 12;
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= months; month++) {
    const interest = balance * r;
    // Floating point drift can leave a fraction of a penny on the final row;
    // clamp so the balance lands exactly on zero.
    const principalPart = Math.min(payment - interest, balance);
    balance = Math.max(balance - principalPart, 0);
    rows.push({ month, interest, principal: principalPart, balance });
  }
  return rows;
}

export const LOAN_FAQ: { q: string; a: string }[] = [
  {
    q: "How is a monthly loan payment calculated?",
    a: "The standard amortisation formula is P = principal × r ÷ (1 − (1 + r)^−n), where r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. It produces a fixed payment that clears both the interest and the principal by the end of the term.",
  },
  {
    q: "What is an EMI?",
    a: "EMI stands for Equated Monthly Instalment — the fixed amount you pay each month over the life of a loan. It is the same figure as a monthly loan payment; the term is most common in India and parts of Asia. The instalment is 'equated' because it stays constant even though its interest and principal split changes every month.",
  },
  {
    q: "Why is so much of my early payment interest?",
    a: "Interest is charged on the balance still outstanding, which is at its largest at the start. Each month you pay interest on what remains, and only the leftover reduces the principal. As the balance falls, the interest portion shrinks and the principal portion grows — so payments late in the term barely include any interest at all.",
  },
  {
    q: "Does paying extra each month save money?",
    a: "Yes, and often more than people expect. Any extra payment goes straight to the principal, which reduces the balance every future month's interest is charged on. Paying extra early in the term saves the most, because that is when the balance — and so the interest — is highest.",
  },
  {
    q: "What happens if the interest rate is 0%?",
    a: "With no interest, the payment is simply the principal divided by the number of months, and the total repaid equals the amount borrowed. This calculator handles 0% correctly — genuinely interest-free finance deals do exist, and the usual formula breaks down at a zero rate.",
  },
  {
    q: "Is APR the same as the interest rate?",
    a: "Not quite. The interest rate is the cost of borrowing the principal, while the APR also folds in fees and charges, so it is usually a little higher. APR is the better figure for comparing offers. Enter the plain interest rate here; the result then excludes any arrangement fees.",
  },
];
