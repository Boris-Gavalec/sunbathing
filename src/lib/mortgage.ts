// Pure mortgage logic. No React.
// Shares the amortization maths in @/lib/finance with the Loan calculator; what
// makes a mortgage different is everything bundled around the payment — tax,
// insurance and PMI.

import { monthlyPayment } from "@/lib/finance";

/** Lenders drop PMI once the borrower holds 20% equity. */
export const PMI_EQUITY_THRESHOLD = 0.2;

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualRatePct: number;
  years: number;
  /** Annual amounts; the UI collects them per year and divides here. */
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  /** Annual PMI as a percentage of the loan amount, e.g. 0.5 for 0.5%/yr. */
  pmiRatePct: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentPct: number;
  principalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPmi: number;
  totalMonthly: number;
  totalInterest: number;
  /** True when the down payment is under the 20% equity threshold. */
  pmiRequired: boolean;
}

/** Assumes homePrice > 0, years > 0, and 0 <= downPayment <= homePrice. */
export function computeMortgage(input: MortgageInput): MortgageResult {
  const {
    homePrice,
    downPayment,
    annualRatePct,
    years,
    propertyTaxAnnual,
    insuranceAnnual,
    pmiRatePct,
  } = input;

  const loanAmount = homePrice - downPayment;
  const months = Math.round(years * 12);
  const downPaymentPct = homePrice === 0 ? 0 : downPayment / homePrice;

  const principalAndInterest = monthlyPayment(loanAmount, annualRatePct, months);

  // PMI only applies below 20% equity, and is charged on the loan, not the price.
  const pmiRequired = downPaymentPct < PMI_EQUITY_THRESHOLD && loanAmount > 0;
  const monthlyPmi = pmiRequired ? (loanAmount * (pmiRatePct / 100)) / 12 : 0;

  const monthlyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = insuranceAnnual / 12;

  return {
    loanAmount,
    downPaymentPct,
    principalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyPmi,
    totalMonthly: principalAndInterest + monthlyTax + monthlyInsurance + monthlyPmi,
    totalInterest: principalAndInterest * months - loanAmount,
    pmiRequired,
  };
}

export const MORTGAGE_FAQ: { q: string; a: string }[] = [
  {
    q: "What is included in a monthly mortgage payment?",
    a: "Four things, often shortened to PITI: principal, interest, taxes and insurance. Principal and interest repay the loan itself; property tax and homeowners insurance are usually collected by the lender into an escrow account and paid on your behalf. If your down payment is under 20%, private mortgage insurance (PMI) is added on top.",
  },
  {
    q: "What is PMI and when do I have to pay it?",
    a: "Private mortgage insurance protects the lender, not you, if you default. It is normally required when your down payment is less than 20% of the home price, and typically costs between 0.3% and 1.5% of the loan amount per year. Once you build 20% equity you can usually request that it be removed, so it is a temporary cost rather than a permanent one.",
  },
  {
    q: "How much should my down payment be?",
    a: "20% is the figure that avoids PMI and gets you the best rates, but plenty of loans allow far less. A larger down payment means a smaller loan, a lower monthly payment and less interest over the term — weighed against tying up cash you might need elsewhere.",
  },
  {
    q: "Is a 15-year or 30-year mortgage better?",
    a: "A 15-year term has a noticeably higher monthly payment but costs dramatically less in total interest, because you are borrowing the money for half as long and usually at a lower rate. A 30-year term keeps the monthly payment affordable but you pay far more overall. Try both terms here and compare the total interest.",
  },
  {
    q: "Why is the total interest so much larger than I expected?",
    a: "Because interest is charged on the outstanding balance every month for decades. On a 30-year loan, the interest can approach or exceed the amount borrowed. Shortening the term or overpaying reduces it sharply, since both cut the balance the interest is calculated on.",
  },
  {
    q: "Does this include HOA fees or maintenance?",
    a: "No. This calculator covers principal, interest, property tax, homeowners insurance and PMI. Homeowners association dues, maintenance, utilities and closing costs are all real costs of owning a home but are not part of the mortgage payment itself — budget for them separately.",
  },
];
