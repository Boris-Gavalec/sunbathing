"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { computeLoan, amortizationSchedule, LOAN_FAQ } from "@/lib/loan";
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

/** Principal-vs-interest split of everything you repay over the term. */
function SplitBar({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const principalPct = total === 0 ? 100 : (principal / total) * 100;

  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
        Where your repayments go
      </p>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div style={{ width: `${principalPct}%`, background: "var(--accent)" }} />
        <div style={{ width: `${100 - principalPct}%`, background: "#ef4444" }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--accent)" }} />
          Principal {formatMoney(principal, true)} ({principalPct.toFixed(0)}%)
        </span>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ef4444" }} />
          Interest {formatMoney(interest, true)} ({(100 - principalPct).toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

export default function LoanCalculator() {
  const [amountStr, setAmountStr] = useState("25000");
  const [rateStr, setRateStr] = useState("6.5");
  const [yearsStr, setYearsStr] = useState("5");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const amount = num(amountStr);
  const rate = num(rateStr);
  const years = num(yearsStr);

  // A 0% rate is legitimate (interest-free finance), so only the principal and
  // term are constrained to be positive.
  const valid =
    amount !== null &&
    amount > 0 &&
    rate !== null &&
    rate >= 0 &&
    years !== null &&
    years > 0;

  const months = years === null ? 0 : Math.round(years * 12);

  const result = useMemo(() => {
    if (!valid) return null;
    return computeLoan(amount!, rate!, months);
  }, [valid, amount, rate, months]);

  // Yearly checkpoints rather than every month — 360 rows helps nobody.
  const yearlyRows = useMemo(() => {
    if (!valid) return [];
    const schedule = amortizationSchedule(amount!, rate!, months);
    return schedule.filter((row) => row.month % 12 === 0 || row.month === months);
  }, [valid, amount, rate, months]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Loan amount</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={1}
          step="100"
          aria-label="Loan amount"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
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
          max={100}
          step="0.1"
          aria-label="Annual interest rate"
          value={rateStr}
          onChange={(e) => setRateStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Term</FieldLabel>
          <span className="text-[11px] text-secondary">
            {months > 0 ? `${months} payments` : "years"}
          </span>
        </div>
        <input
          type="number"
          min={0.5}
          max={40}
          step="0.5"
          aria-label="Loan term in years"
          value={yearsStr}
          onChange={(e) => setYearsStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <div className="flex gap-1.5 mt-2">
          {[1, 3, 5, 7, 10].map((preset) => (
            <button
              key={preset}
              onClick={() => setYearsStr(String(preset))}
              className="flex-1 h-8 rounded-md text-xs font-bold transition-all"
              style={{
                background: yearsStr === String(preset) ? "var(--accent)" : "var(--quick-start-bg)",
                color: yearsStr === String(preset) ? "#fff" : "var(--text-secondary)",
                border:
                  yearsStr === String(preset)
                    ? "2px solid var(--accent)"
                    : "1px solid var(--card-border)",
              }}
            >
              {preset}y
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
          Enter a loan amount, an interest rate, and a term to see your monthly payment.
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
                Monthly payment
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {formatMoney(result.monthlyPayment)}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                × {result.months} payments
              </p>
            </div>

            <StatCard
              label="Total interest"
              value={formatMoney(result.totalInterest, true)}
              sub={
                rate === 0
                  ? "interest-free"
                  : `${(result.interestRatio * 100).toFixed(0)}% of what you borrowed`
              }
            />
            <StatCard
              label="Total repaid"
              value={formatMoney(result.totalPaid, true)}
              sub={`on ${formatMoney(amount!, true)} borrowed`}
            />
          </div>

          <SplitBar principal={amount!} interest={result.totalInterest} />

          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <button
              onClick={() => setShowSchedule((v) => !v)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              <span>Amortization schedule</span>
              <span style={{ color: "var(--text-secondary)" }}>
                {showSchedule ? "▲ Hide" : "▼ Show"}
              </span>
            </button>
            {showSchedule && (
              <div className="px-4 pb-4 overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ color: "var(--text-secondary)" }}>
                      <th className="text-left py-2 font-bold">Year</th>
                      <th className="text-right py-2 font-bold">Interest</th>
                      <th className="text-right py-2 font-bold">Principal</th>
                      <th className="text-right py-2 font-bold">Balance</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--foreground)" }}>
                    {yearlyRows.map((row) => (
                      <tr key={row.month} style={{ borderTop: "1px solid var(--card-border)" }}>
                        <td className="py-1.5">{Math.ceil(row.month / 12)}</td>
                        <td className="text-right py-1.5">{formatMoney(row.interest)}</td>
                        <td className="text-right py-1.5">{formatMoney(row.principal)}</td>
                        <td className="text-right py-1.5">{formatMoney(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>
                  One row per year, showing that month&apos;s split. Early payments are mostly
                  interest; later ones are mostly principal.
                </p>
              </div>
            )}
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 shrink-0 flex items-center justify-center text-sm">
              🏦
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Loan Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Monthly EMI, total interest, and a year-by-year amortization schedule
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
              How the Loan Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              The monthly payment comes from the standard amortisation formula:{" "}
              <strong>payment = principal × r ÷ (1 − (1 + r)⁻ⁿ)</strong>, where{" "}
              <strong>r</strong> is the monthly rate (the annual rate divided by twelve) and{" "}
              <strong>n</strong> is the number of payments. It is built so that a constant monthly
              amount clears both the interest and the principal exactly at the end of the term. This
              same fixed payment is what an EMI — equated monthly instalment — refers to.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Why early payments are mostly interest
            </h3>
            <p className="mb-3">
              Interest is charged on what you still owe. At the start that balance is at its largest,
              so most of your payment goes on interest and only a little chips away at the principal.
              As the balance falls the interest shrinks and more of each identical payment goes to
              the principal. The schedule above makes the crossover visible — it is also why
              overpaying early saves so much more than overpaying late.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Interest rate or APR?
            </h3>
            <p className="mb-3">
              Enter the plain interest rate. APR bundles fees into a single comparable figure and is
              usually slightly higher, so it is the better number for comparing offers but the wrong
              one for working out a payment. The result here therefore excludes arrangement or
              origination fees. A 0% rate is handled correctly, since interest-free finance really
              does exist and the formula above breaks down at zero.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {LOAN_FAQ.map((item) => (
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
              Estimates for informational purposes only, excluding fees. This is not financial
              advice — confirm figures with your lender.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
