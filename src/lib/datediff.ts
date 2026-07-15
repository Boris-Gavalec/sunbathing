// Pure date-difference logic. No React.
// Calendar maths lives in @/lib/dates and is shared with the Age calculator.

import { daysBetween, diffYmd, type YmdDiff } from "@/lib/dates";

export interface DateDiffResult {
  /** Signed: negative when `to` is before `from`. */
  signedDays: number;
  /** Absolute day count, which is what most of the UI shows. */
  days: number;
  weeks: number;
  /** Leftover days after whole weeks. */
  remainderDays: number;
  months: number;
  years: number;
  /** Years/months/days breakdown, always computed earlier-to-later. */
  breakdown: YmdDiff;
  businessDays: number;
  weekendDays: number;
  isPast: boolean;
  isSameDay: boolean;
}

/**
 * Whole weekdays between two dates, counting the end date and excluding the
 * start — matching the "days from now" reading people expect from a countdown.
 * Order-insensitive: the caller's direction is handled separately.
 */
export function businessDaysBetween(from: Date, to: Date): number {
  const [start, end] = daysBetween(from, to) >= 0 ? [from, to] : [to, from];
  const total = Math.abs(daysBetween(start, end));

  let count = 0;
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  for (let i = 0; i < total; i++) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

export function computeDateDiff(from: Date, to: Date): DateDiffResult {
  const signedDays = daysBetween(from, to);
  const days = Math.abs(signedDays);
  const isPast = signedDays < 0;

  // The breakdown always runs earlier-to-later; direction is reported by isPast
  // rather than by negative years/months, which nobody reads well.
  const [earlier, later] = isPast ? [to, from] : [from, to];
  const breakdown = diffYmd(earlier, later);
  const businessDays = businessDaysBetween(from, to);

  return {
    signedDays,
    days,
    weeks: Math.floor(days / 7),
    remainderDays: days % 7,
    months: breakdown.years * 12 + breakdown.months,
    years: breakdown.years,
    breakdown,
    businessDays,
    weekendDays: days - businessDays,
    isPast,
    isSameDay: signedDays === 0,
  };
}

export const DATEDIFF_FAQ: { q: string; a: string }[] = [
  {
    q: "How many days are between two dates?",
    a: "The calculator counts whole calendar days from the start date to the end date, so the end date is included and the start date is not. It compares the dates as calendar days rather than timestamps, which means daylight saving changes cannot shift the count by a day.",
  },
  {
    q: "Are business days weekdays only?",
    a: "Yes — the business-day figure counts Mondays to Fridays and excludes Saturdays and Sundays. It does not know about public holidays, which vary by country and region, so subtract those yourself if your calculation depends on them.",
  },
  {
    q: "How is the years, months and days breakdown worked out?",
    a: "It borrows across real calendar month lengths rather than assuming 30-day months. That is why the breakdown can differ slightly from dividing the total days by 30 or 365 — those approximations drift, while a calendar-correct count does not.",
  },
  {
    q: "Can I count down to a future date?",
    a: "Yes. Put today in the first field and your target date in the second, and the result is the countdown. If the second date is in the past, the calculator says so and reports how long ago it was rather than showing a negative number.",
  },
  {
    q: "Does this include leap days?",
    a: "Yes. Leap days are counted as real days, so a span crossing 29 February includes it. This is why the total-days figure between two dates a year apart is 365 or 366 depending on the years involved.",
  },
  {
    q: "Why does the month count seem low?",
    a: "Months only tick over on the calendar day that matches the start date. From 31 January to 1 March is one month and a day or two, not two months, because the February anniversary has to pass first. It is the same rule people use for ages.",
  },
];
