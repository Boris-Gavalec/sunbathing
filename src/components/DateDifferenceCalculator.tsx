"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { useToday } from "@/components/useToday";
import { computeDateDiff, DATEDIFF_FAQ } from "@/lib/datediff";
import { parseDateInput, toDateInputValue } from "@/lib/dates";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: "var(--foreground)" }}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-secondary">{children}</span>;
}

const int = new Intl.NumberFormat("en-US");

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** `days` after the given YYYY-MM-DD value, or "" if it isn't a date yet. */
function shiftDays(value: string, days: number): string {
  const parsed = parseDateInput(value);
  if (parsed === null) return "";
  return toDateInputValue(
    new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + days)
  );
}

export default function DateDifferenceCalculator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Both fields default off today and stay editable. null means untouched.
  const today = useToday();
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);

  const fromStr = fromOverride ?? today;
  // Defaulting 30 days out so the page shows a real countdown on arrival.
  const toStr = toOverride ?? shiftDays(today, 30);

  const setFromStr = setFromOverride;
  const setToStr = setToOverride;

  const from = parseDateInput(fromStr);
  const to = parseDateInput(toStr);
  const valid = from !== null && to !== null;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeDateDiff(from!, to!);
  }, [valid, from, to]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>From date</FieldLabel>
        </div>
        <input
          type="date"
          aria-label="Start date"
          value={fromStr}
          onChange={(e) => setFromStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>To date</FieldLabel>
        </div>
        <input
          type="date"
          aria-label="End date"
          value={toStr}
          onChange={(e) => setToStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <button
        onClick={() => {
          const today = toDateInputValue(new Date());
          setFromStr(today);
        }}
        className="w-full h-9 rounded-md text-xs font-bold transition-all"
        style={{
          background: "var(--quick-start-bg)",
          color: "var(--text-secondary)",
          border: "1px solid var(--card-border)",
        }}
      >
        Start from today
      </button>

      <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
        Put today first and a future date second to turn this into a countdown.
      </p>
    </div>
  );

  const results = (
    <div className="space-y-4 sm:space-y-5">
      {!valid && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          Enter two valid dates to see the difference between them.
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              className="rounded-xl px-5 py-4 col-span-2 lg:col-span-1"
              style={{
                background: "var(--accent-card-bg)",
                border: "1px solid var(--accent-card-border)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">
                {result.isSameDay ? "Same day" : result.isPast ? "Days ago" : "Days from now"}
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {int.format(result.days)}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                {result.isSameDay
                  ? "the two dates are the same"
                  : result.isPast
                    ? "that date has passed"
                    : "still to go"}
              </p>
            </div>

            <StatCard
              label="Weeks"
              value={
                result.remainderDays === 0
                  ? int.format(result.weeks)
                  : `${int.format(result.weeks)}w ${result.remainderDays}d`
              }
              sub="whole weeks and leftover days"
            />
            <StatCard
              label="Business days"
              value={int.format(result.businessDays)}
              sub="weekdays only, no holidays"
            />
          </div>

          <div
            className="rounded-xl px-4 py-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Calendar breakdown
            </p>
            <p className="text-lg font-bold font-mono mb-2" style={{ color: "var(--foreground)" }}>
              {result.breakdown.years}
              <span className="text-sm font-normal"> years </span>
              {result.breakdown.months}
              <span className="text-sm font-normal"> months </span>
              {result.breakdown.days}
              <span className="text-sm font-normal"> days</span>
            </p>
            <div className="space-y-1.5 text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
              <div className="flex justify-between">
                <span>From</span>
                <span style={{ color: "var(--foreground)" }}>{LONG_DATE.format(from!)}</span>
              </div>
              <div className="flex justify-between">
                <span>To</span>
                <span style={{ color: "var(--foreground)" }}>{LONG_DATE.format(to!)}</span>
              </div>
            </div>
            <p className="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>
              Borrowed across real month lengths, so leap years and short months are exact.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total months" value={int.format(result.months)} sub="whole months" />
            <StatCard label="Total years" value={int.format(result.years)} sub="whole years" />
            <StatCard label="Weekend days" value={int.format(result.weekendDays)} sub="Sat & Sun" />
            <StatCard label="Total hours" value={int.format(result.days * 24)} sub="approximate" />
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <header className="border-b border-card bg-card">
        <div className="px-4 pt-3">
          <SiteNav />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 shrink-0 flex items-center justify-center text-sm">
              📅
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Date Difference Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Days between two dates, business days, and a countdown
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden border-b border-card bg-card">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          <span>Parameters</span>
          <span style={{ color: "var(--text-secondary)" }}>{sidebarOpen ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {sidebarOpen && <div className="p-4 border-t border-card">{inputs}</div>}
      </div>

      <main className="flex flex-col lg:flex-row gap-0">
        <aside className="hidden lg:block lg:w-[300px] shrink-0 border-r p-5 overflow-y-auto border-card bg-card">
          {inputs}
        </aside>

        <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto">
          {results}

          <section
            className="rounded-xl p-4 sm:p-6 bg-card card-border text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              How the Date Difference Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Counting days
            </h3>
            <p className="mb-3">
              The calculator compares the two dates as calendar days rather than as timestamps. That
              detail matters more than it sounds: if you subtract two moments in time across a
              daylight saving change, you get 23 or 25 hours and the day count silently comes out one
              short. Comparing calendar days sidesteps the problem entirely, so the count is always
              exact.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Business days
            </h3>
            <p className="mb-3">
              The business-day figure walks the range and counts Mondays to Fridays, skipping
              weekends. It does <strong>not</strong> know about public holidays — those vary by
              country, region and year — so if your deadline depends on them, subtract them yourself.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Years, months and days
            </h3>
            <p className="mb-3">
              The calendar breakdown borrows across real month lengths instead of assuming every
              month is 30 days. Months only tick over once the matching day of the month passes, so
              31 January to 1 March is one month and a day or so, not two months. It is the same rule
              you apply to ages, and it is why this figure differs from dividing the day count by 30.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Countdowns and past dates
            </h3>
            <p className="mb-3">
              Put today in the first field and a future date in the second and the result reads as a
              countdown. If the second date has already passed, the calculator says how long ago it
              was rather than handing back a negative number.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {DATEDIFF_FAQ.map((item) => (
              <div key={item.q} className="mb-4">
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {item.q}
                </h3>
                <p>{item.a}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
