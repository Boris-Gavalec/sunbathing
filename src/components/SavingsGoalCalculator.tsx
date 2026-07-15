"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { computeSavingsGoal, requiredMonthlyContribution, SAVINGS_FAQ } from "@/lib/savings";
import { formatMoney } from "@/lib/finance";

function num(value: string): number | null {
  if (value.trim() === "") return null;
  const n = parseFloat(value);
  return isNaN(n) ? null : n;
}

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

/** Human-readable duration: months alone are hard to picture past a year or two. */
function formatDuration(years: number, months: number): string {
  if (years === 0 && months === 0) return "Already there";
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  return parts.join(", ");
}

export default function SavingsGoalCalculator() {
  const [targetStr, setTargetStr] = useState("20000");
  const [startStr, setStartStr] = useState("2000");
  const [monthlyStr, setMonthlyStr] = useState("400");
  const [rateStr, setRateStr] = useState("4");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const target = num(targetStr);
  const start = num(startStr);
  const monthly = num(monthlyStr);
  const rate = num(rateStr);

  const valid =
    target !== null &&
    target > 0 &&
    start !== null &&
    start >= 0 &&
    monthly !== null &&
    monthly >= 0 &&
    rate !== null;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeSavingsGoal(start!, monthly!, rate!, target!);
  }, [valid, start, monthly, rate, target]);

  // Offered as a nudge when the goal is unreachable as configured.
  const suggestion = useMemo(() => {
    if (!valid || !result || result.months !== null) return null;
    const needed = requiredMonthlyContribution(start!, rate!, target!, 60);
    return needed === null ? null : needed;
  }, [valid, result, start, rate, target]);

  const unreachable = result !== null && result.months === null;
  const contributedPct =
    result && result.finalBalance > 0
      ? (result.totalContributed / result.finalBalance) * 100
      : 100;

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Savings goal</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={1}
          step="500"
          aria-label="Savings goal target"
          value={targetStr}
          onChange={(e) => setTargetStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Starting balance</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={0}
          step="100"
          aria-label="Starting balance"
          value={startStr}
          onChange={(e) => setStartStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Monthly contribution</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={0}
          step="50"
          aria-label="Monthly contribution"
          value={monthlyStr}
          onChange={(e) => setMonthlyStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Interest rate</FieldLabel>
          <span className="text-[11px] text-secondary">% per year</span>
        </div>
        <input
          type="number"
          min={0}
          max={30}
          step="0.1"
          aria-label="Annual interest rate"
          value={rateStr}
          onChange={(e) => setRateStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <div className="flex gap-1.5 mt-2">
          {[0, 2, 4, 7].map((preset) => (
            <button
              key={preset}
              onClick={() => setRateStr(String(preset))}
              className="flex-1 h-8 rounded-md text-xs font-bold transition-all"
              style={{
                background: rateStr === String(preset) ? "var(--accent)" : "var(--quick-start-bg)",
                color: rateStr === String(preset) ? "#fff" : "var(--text-secondary)",
                border:
                  rateStr === String(preset)
                    ? "2px solid var(--accent)"
                    : "1px solid var(--card-border)",
              }}
            >
              {preset}%
            </button>
          ))}
        </div>
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
          Enter a savings goal above zero, a starting balance, and a monthly contribution.
        </div>
      )}

      {unreachable && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--foreground)" }}>This goal can&apos;t be reached.</strong>{" "}
          With no monthly contribution and no interest to grow the balance, it never rises — so the
          target stays out of reach forever.
          {suggestion !== null && (
            <>
              {" "}
              Contributing <strong style={{ color: "var(--accent)" }}>{formatMoney(suggestion)}</strong> a
              month would get you there in 5 years.
            </>
          )}
        </div>
      )}

      {result && result.months !== null && (
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
                {result.alreadyMet ? "Goal status" : "Time to your goal"}
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {result.alreadyMet ? "Done" : formatDuration(result.years, result.remainingMonths)}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                {result.alreadyMet
                  ? "your starting balance already covers it"
                  : `${result.months} monthly contributions`}
              </p>
            </div>

            <StatCard
              label="You contribute"
              value={formatMoney(result.totalContributed, true)}
              sub="including your starting balance"
            />
            <StatCard
              label="Interest earned"
              value={formatMoney(result.interestEarned, true)}
              sub={rate === 0 ? "no interest at 0%" : "free money from compounding"}
            />
          </div>

          {!result.alreadyMet && (
            <div
              className="rounded-xl px-4 py-4"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Where the final balance comes from
              </p>
              <div className="flex h-3 rounded-full overflow-hidden">
                <div style={{ width: `${contributedPct}%`, background: "var(--accent)" }} />
                <div style={{ width: `${100 - contributedPct}%`, background: "#4ade80" }} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--accent)" }} />
                  Your money {formatMoney(result.totalContributed, true)} ({contributedPct.toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#4ade80" }} />
                  Interest {formatMoney(result.interestEarned, true)} ({(100 - contributedPct).toFixed(0)}%)
                </span>
              </div>
              <p className="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>
                The longer the goal, the larger the green slice — that is compounding doing the work
                for you.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Final balance"
              value={formatMoney(result.finalBalance, true)}
              sub={`target was ${formatMoney(target!, true)}`}
            />
            <StatCard
              label="Monthly contribution"
              value={formatMoney(monthly!)}
              sub={result.months > 0 ? `× ${result.months} months` : "not needed"}
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shrink-0 flex items-center justify-center text-sm">
              🎯
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Savings Goal Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                How long until you reach your target, with compound interest
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
              How the Savings Goal Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The method
            </h3>
            <p className="mb-3">
              Each month your balance earns one twelfth of the annual rate, then your contribution is
              added on top. The calculator steps forward month by month until the balance reaches
              your target. Stepping rather than solving a formula means compounding is handled
              exactly and awkward cases — a 0% rate, a goal already met — come out right instead of
              producing a divide-by-zero.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Why compounding matters more over time
            </h3>
            <p className="mb-3">
              Compound interest is interest earned on your interest. Each month&apos;s interest joins
              the balance, so the next month earns slightly more. Over a couple of years the effect is
              barely visible and your contributions do nearly all the work. Over a couple of decades
              it can rival or overtake them — which is why the split between{" "}
              <strong>your money</strong> and <strong>interest</strong> above is worth watching as you
              change the term.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Choosing a rate
            </h3>
            <p className="mb-3">
              Use what your account actually pays — for a savings account, the quoted APY. For
              long-term investing, 6-7% is a common assumption based on historical stock market
              averages, but that is an average across decades and not a promise for any single year.
              The result is in nominal terms, so for today&apos;s money subtract expected inflation
              from your rate.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {SAVINGS_FAQ.map((item) => (
              <div key={item.q} className="mb-4">
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {item.q}
                </h3>
                <p>{item.a}</p>
              </div>
            ))}
          </section>

          <footer className="text-center py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
            <p>
              Projections assume a constant rate and are not financial advice. Real returns vary and
              are not guaranteed.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
