// Pure age logic. No React.
// Calendar maths lives in @/lib/dates and is shared with the Date Difference
// calculator.

import { diffYmd, daysBetween, type YmdDiff } from "@/lib/dates";

export interface AgeResult extends YmdDiff {
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  /** The weekday the person was born on, e.g. "Tuesday". */
  bornOnDay: string;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
  /** True when the reference date is the birthday itself. */
  isBirthdayToday: boolean;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * The next occurrence of the birth date's month/day on or after `on`.
 *
 * Leaplings are a real edge case: a Feb 29 birthday has no anniversary in most
 * years, and `new Date(2025, 1, 29)` silently rolls over to March 1 — which is
 * the convention this uses, matching how the year-borrow in diffYmd behaves.
 */
export function nextBirthday(birth: Date, on: Date): Date {
  const candidate = new Date(on.getFullYear(), birth.getMonth(), birth.getDate());
  if (daysBetween(on, candidate) >= 0) return candidate;
  return new Date(on.getFullYear() + 1, birth.getMonth(), birth.getDate());
}

/** Assumes `birth` is on or before `on`; callers must check first. */
export function computeAge(birth: Date, on: Date): AgeResult {
  const ymd = diffYmd(birth, on);
  const upcoming = nextBirthday(birth, on);
  const daysUntil = daysBetween(on, upcoming);

  return {
    ...ymd,
    totalWeeks: Math.floor(ymd.totalDays / 7),
    totalMonths: ymd.years * 12 + ymd.months,
    totalHours: ymd.totalDays * 24,
    bornOnDay: WEEKDAYS[birth.getDay()],
    nextBirthday: upcoming,
    daysUntilNextBirthday: daysUntil,
    isBirthdayToday: daysUntil === 0,
  };
}

export const AGE_FAQ: { q: string; a: string }[] = [
  {
    q: "How is exact age calculated?",
    a: "Your age is the difference between your birth date and today, expressed as whole years, then whole months, then leftover days. The calculation borrows across real calendar month lengths rather than assuming every month is 30 days, so February and leap years come out correctly.",
  },
  {
    q: "How does this handle leap years?",
    a: "Leap days are counted as real days, so the total-days figure is exact. For the years/months/days breakdown, the borrow step uses the actual length of each month, which means a February in a leap year contributes 29 days rather than 28.",
  },
  {
    q: "When does someone born on 29 February have a birthday?",
    a: "There is no 29 February in most years, so a convention is needed. This calculator treats 1 March as the anniversary in non-leap years, which means a leapling turns a year older on 1 March. Some jurisdictions use 28 February instead — the difference only ever amounts to a single day.",
  },
  {
    q: "Why does my age in months not equal my age in years times twelve plus something?",
    a: "It does — total months is years × 12 + months, ignoring the leftover days. What it is not is total days ÷ 30, because months are not all the same length. Any figure quoting 'months' from an average month length will disagree with a calendar-correct one by a few days.",
  },
  {
    q: "Can I calculate my age on a future or past date?",
    a: "Yes. Change the 'age at date' field to any date on or after the birth date and the calculator will work out the age as of that day, which is useful for eligibility cut-offs and enrolment dates.",
  },
  {
    q: "Why does it say my birth date is invalid?",
    a: "Either the date does not exist — 31 February, or 29 February in a non-leap year — or it falls after the date you are calculating the age at. Age runs forward, so the birth date has to come first.",
  },
];
