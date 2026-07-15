// Shared calendar date math. No React.
// Consumed by the Age and Date Difference calculators.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Strip the time component, comparing dates as calendar days in UTC.
 *  Using UTC avoids a DST transition between the two dates turning a whole
 *  number of days into 23.96 and truncating to one day short. */
function toUtcDay(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Whole calendar days from `from` to `to`. Negative if `to` precedes `from`. */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((toUtcDay(to) - toUtcDay(from)) / MS_PER_DAY);
}

export interface YmdDiff {
  years: number;
  months: number;
  days: number;
  /** Total elapsed days, for callers that want a single number too. */
  totalDays: number;
}

/** Days in the calendar month *preceding* the given date's month. Day 0 of a
 *  month rolls back to the last day of the previous one, which is what the
 *  borrow step below needs. */
function daysInPreviousMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
}

/**
 * Calendar-correct difference expressed as years + months + days, the way an
 * age is normally read ("34 years, 2 months, 5 days").
 *
 * This borrows across real month lengths rather than assuming 30/31-day months,
 * so leap years and short months come out right. If `to` precedes `from`, all
 * three components are returned as zero — callers should compare the dates
 * first and present that case themselves.
 */
export function diffYmd(from: Date, to: Date): YmdDiff {
  const totalDays = daysBetween(from, to);
  if (totalDays < 0) return { years: 0, months: 0, days: 0, totalDays };

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  // Borrow days from the previous month, then months from the year.
  if (days < 0) {
    months -= 1;
    days += daysInPreviousMonth(to);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, totalDays };
}

/** Format a Date as a native <input type="date"> value ("YYYY-MM-DD") using its
 *  *local* calendar day. `toISOString()` would convert to UTC first and can
 *  hand back yesterday. */
export function toDateInputValue(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Parse a native <input type="date"> value ("YYYY-MM-DD") as a *local*
 *  calendar date. `new Date("2024-01-15")` parses as UTC midnight, which is the
 *  previous day for anyone west of Greenwich — hence the explicit construction. */
export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  // Reject dates that rolled over (e.g. 2024-02-31 -> Mar 2).
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}
