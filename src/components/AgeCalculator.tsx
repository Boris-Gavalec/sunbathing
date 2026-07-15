"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { useToday } from "@/components/useToday";
import { computeAge, AGE_FAQ } from "@/lib/age";
import { parseDateInput, daysBetween } from "@/lib/dates";

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

export default function AgeCalculator() {
  const [birthStr, setBirthStr] = useState("1990-01-15");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The "age at" field defaults to today but stays editable: null means
  // untouched, so it tracks today rather than freezing at first render.
  const today = useToday();
  const [onOverride, setOnOverride] = useState<string | null>(null);
  const onStr = onOverride ?? today;
  const setOnStr = setOnOverride;

  const birth = parseDateInput(birthStr);
  const on = parseDateInput(onStr);

  const birthInFuture = birth !== null && on !== null && daysBetween(birth, on) < 0;
  const valid = birth !== null && on !== null && !birthInFuture;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeAge(birth!, on!);
  }, [valid, birth, on]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Date of birth</FieldLabel>
        </div>
        <input
          type="date"
          aria-label="Date of birth"
          value={birthStr}
          onChange={(e) => setBirthStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Age at date</FieldLabel>
          <span className="text-[11px] text-secondary">defaults to today</span>
        </div>
        <input
          type="date"
          aria-label="Calculate age at this date"
          value={onStr}
          onChange={(e) => setOnStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <p className="text-[11px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Change this to work out an age on any past or future date.
        </p>
      </div>
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
          {birthInFuture
            ? "That birth date is after the date you're measuring at — age runs forward, so the birth date has to come first."
            : "Enter a valid date of birth to see the exact age."}
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
                Exact age
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {result.years}
                <span className="text-lg"> y </span>
                {result.months}
                <span className="text-lg"> m </span>
                {result.days}
                <span className="text-lg"> d</span>
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                born on a {result.bornOnDay}
              </p>
            </div>

            <StatCard
              label="Total days"
              value={int.format(result.totalDays)}
              sub="every day counted, leap days included"
            />
            <StatCard
              label="Total months"
              value={int.format(result.totalMonths)}
              sub="whole calendar months"
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
              Next birthday
            </p>
            {result.isBirthdayToday ? (
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                🎂 <strong>It&apos;s today.</strong> Turning {result.years}.
              </p>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <strong className="text-accent">{int.format(result.daysUntilNextBirthday)} days</strong>{" "}
                away — {LONG_DATE.format(result.nextBirthday)}, turning{" "}
                <strong style={{ color: "var(--foreground)" }}>{result.years + 1}</strong>.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard label="Total weeks" value={int.format(result.totalWeeks)} sub="whole weeks" />
            <StatCard label="Total hours" value={int.format(result.totalHours)} sub="approximate" />
            <StatCard
              label="Born on"
              value={result.bornOnDay}
              sub={LONG_DATE.format(birth!).split(", ").slice(1).join(", ")}
            />
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shrink-0 flex items-center justify-center text-sm">
              🎂
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Age Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Exact age in years, months and days — leap years handled properly
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
              How the Age Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Counting the calendar properly
            </h3>
            <p className="mb-3">
              Your age is worked out as whole years first, then whole months, then the leftover days.
              The part that matters is the borrowing: when the day of the month hasn&apos;t come round
              yet, the calculator borrows the <em>real</em> length of the preceding month rather than
              assuming 30 days. That is why the result lines up with what you would count on a
              calendar instead of drifting by a day or two.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Leap years and leaplings
            </h3>
            <p className="mb-3">
              Leap days are counted as real days, so the total-days figure is exact. Birthdays on 29
              February need a convention, since most years don&apos;t have one — this calculator
              treats 1 March as the anniversary in non-leap years. Some jurisdictions use 28 February
              instead; either way it only ever moves things by a single day.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Why total months isn&apos;t total days ÷ 30
            </h3>
            <p className="mb-3">
              Because months are not all the same length. Any &quot;months&quot; figure derived from
              an average month length will disagree with a calendar-correct count, and the gap grows
              the longer the span. Total months here is simply years × 12 + months, ignoring leftover
              days — which is what people mean when they ask.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Ages at other dates
            </h3>
            <p className="mb-3">
              The second field defaults to today but accepts any date, so you can check an age at a
              school enrolment cut-off, a policy date, or some point in the future.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {AGE_FAQ.map((item) => (
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
