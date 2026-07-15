"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { computeMortgage, MORTGAGE_FAQ, PMI_EQUITY_THRESHOLD } from "@/lib/mortgage";
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

const BREAKDOWN_COLORS = {
  principalAndInterest: "var(--accent)",
  tax: "#60a5fa",
  insurance: "#a78bfa",
  pmi: "#ef4444",
};

export default function MortgageCalculator() {
  const [priceStr, setPriceStr] = useState("400000");
  const [downStr, setDownStr] = useState("80000");
  const [rateStr, setRateStr] = useState("6.5");
  const [yearsStr, setYearsStr] = useState("30");
  const [taxStr, setTaxStr] = useState("4800");
  const [insuranceStr, setInsuranceStr] = useState("1800");
  const [pmiStr, setPmiStr] = useState("0.5");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const price = num(priceStr);
  const down = num(downStr);
  const rate = num(rateStr);
  const years = num(yearsStr);
  const tax = num(taxStr);
  const insurance = num(insuranceStr);
  const pmi = num(pmiStr);

  const valid =
    price !== null &&
    price > 0 &&
    down !== null &&
    down >= 0 &&
    down <= price &&
    rate !== null &&
    rate >= 0 &&
    years !== null &&
    years > 0;

  // Optional extras default to zero rather than blocking the whole result.
  const result = useMemo(() => {
    if (!valid) return null;
    return computeMortgage({
      homePrice: price!,
      downPayment: down!,
      annualRatePct: rate!,
      years: years!,
      propertyTaxAnnual: tax ?? 0,
      insuranceAnnual: insurance ?? 0,
      pmiRatePct: pmi ?? 0,
    });
  }, [valid, price, down, rate, years, tax, insurance, pmi]);

  const downTooLarge = price !== null && down !== null && down > price;

  const segments = result
    ? [
        { label: "Principal & interest", value: result.principalAndInterest, color: BREAKDOWN_COLORS.principalAndInterest },
        { label: "Property tax", value: result.monthlyTax, color: BREAKDOWN_COLORS.tax },
        { label: "Insurance", value: result.monthlyInsurance, color: BREAKDOWN_COLORS.insurance },
        { label: "PMI", value: result.monthlyPmi, color: BREAKDOWN_COLORS.pmi },
      ].filter((s) => s.value > 0)
    : [];

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Home price</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={1}
          step="1000"
          aria-label="Home price"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Down payment</FieldLabel>
          <span className="text-[11px] text-secondary">
            {price && down !== null && price > 0 ? `${((down / price) * 100).toFixed(0)}%` : "USD"}
          </span>
        </div>
        <input
          type="number"
          min={0}
          step="1000"
          aria-label="Down payment"
          value={downStr}
          onChange={(e) => setDownStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <div className="flex gap-1.5 mt-2">
          {[5, 10, 20].map((pct) => (
            <button
              key={pct}
              onClick={() => price && setDownStr(String(Math.round((price * pct) / 100)))}
              className="flex-1 h-8 rounded-md text-xs font-bold transition-all"
              style={{
                background: "var(--quick-start-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--card-border)",
              }}
            >
              {pct}%
            </button>
          ))}
        </div>
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
          <span className="text-[11px] text-secondary">years</span>
        </div>
        <div className="flex gap-1.5">
          {[15, 20, 30].map((preset) => (
            <button
              key={preset}
              onClick={() => setYearsStr(String(preset))}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
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

      <div className="pt-2" style={{ borderTop: "1px solid var(--card-border)" }}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 mt-3">
          Ongoing costs
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>Property tax</FieldLabel>
              <span className="text-[11px] text-secondary">per year</span>
            </div>
            <input
              type="number"
              min={0}
              step="100"
              aria-label="Annual property tax"
              value={taxStr}
              onChange={(e) => setTaxStr(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>Home insurance</FieldLabel>
              <span className="text-[11px] text-secondary">per year</span>
            </div>
            <input
              type="number"
              min={0}
              step="100"
              aria-label="Annual home insurance"
              value={insuranceStr}
              onChange={(e) => setInsuranceStr(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>PMI rate</FieldLabel>
              <span className="text-[11px] text-secondary">% of loan / year</span>
            </div>
            <input
              type="number"
              min={0}
              max={5}
              step="0.1"
              aria-label="Annual PMI rate"
              value={pmiStr}
              onChange={(e) => setPmiStr(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
            <p className="text-[11px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
              Only charged below {PMI_EQUITY_THRESHOLD * 100}% down.
            </p>
          </div>
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
          {downTooLarge
            ? "Your down payment is larger than the home price — lower it to see a payment."
            : "Enter a home price, down payment, rate, and term to see your monthly payment."}
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
                Total monthly payment
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {formatMoney(result.totalMonthly)}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                everything included
              </p>
            </div>

            <StatCard
              label="Principal & interest"
              value={formatMoney(result.principalAndInterest)}
              sub={`on a ${formatMoney(result.loanAmount, true)} loan`}
            />
            <StatCard
              label="Total interest"
              value={formatMoney(result.totalInterest, true)}
              sub={`over ${years} years`}
            />
          </div>

          {/* Monthly breakdown */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              What makes up the monthly payment
            </p>
            <div className="flex h-3 rounded-full overflow-hidden">
              {segments.map((s) => (
                <div
                  key={s.label}
                  title={`${s.label}: ${formatMoney(s.value)}`}
                  style={{
                    width: `${(s.value / result.totalMonthly) * 100}%`,
                    background: s.color,
                  }}
                />
              ))}
            </div>
            <div className="space-y-2 mt-4 text-sm">
              {segments.map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    {formatMoney(s.value)}
                  </span>
                </div>
              ))}
              <div
                className="flex justify-between items-center pt-2 font-bold"
                style={{ borderTop: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                <span>Total</span>
                <span className="font-mono">{formatMoney(result.totalMonthly)}</span>
              </div>
            </div>
          </div>

          {result.pmiRequired && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              <strong style={{ color: "var(--foreground)" }}>PMI applies.</strong> Your down payment
              is {(result.downPaymentPct * 100).toFixed(1)}%, below the{" "}
              {PMI_EQUITY_THRESHOLD * 100}% threshold, so private mortgage insurance adds{" "}
              {formatMoney(result.monthlyPmi)}/month. It can usually be dropped once you reach{" "}
              {PMI_EQUITY_THRESHOLD * 100}% equity — so treat it as temporary.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Loan amount"
              value={formatMoney(result.loanAmount, true)}
              sub={`${(result.downPaymentPct * 100).toFixed(1)}% down`}
            />
            <StatCard
              label="Total of all payments"
              value={formatMoney(result.principalAndInterest * Math.round(years! * 12), true)}
              sub="principal & interest only"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-sm">
              🏠
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Mortgage Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Full monthly payment with property tax, insurance, and PMI
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
              How the Mortgage Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              PITI — the four parts of a payment
            </h3>
            <p className="mb-3">
              A mortgage payment is more than the loan. Principal and interest repay the borrowing
              itself, calculated with the standard amortisation formula{" "}
              <strong>payment = principal × r ÷ (1 − (1 + r)⁻ⁿ)</strong>. On top of that, property
              tax and homeowners insurance are usually collected monthly by your lender into escrow.
              Together these four make up PITI — and the difference between the principal-and-interest
              figure and the true monthly outlay often surprises first-time buyers.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              PMI and the 20% threshold
            </h3>
            <p className="mb-3">
              If your down payment is under {PMI_EQUITY_THRESHOLD * 100}% of the price, lenders
              typically require private mortgage insurance. It protects the lender rather than you,
              and is charged as a percentage of the loan amount — commonly 0.3% to 1.5% per year.
              This calculator only adds PMI when your down payment falls below that threshold. It is
              not permanent: once you build {PMI_EQUITY_THRESHOLD * 100}% equity you can usually ask
              for it to be removed.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Term length is the biggest lever
            </h3>
            <p className="mb-3">
              Switching between 15, 20 and 30 years shows the trade-off clearly. A longer term lowers
              the monthly payment but multiplies the total interest, because you borrow the money for
              longer — on a 30-year loan the interest can approach the amount borrowed. A shorter
              term costs more each month and far less overall.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              What is not included
            </h3>
            <p className="mb-3">
              Homeowners association dues, maintenance, utilities and closing costs are all real
              costs of owning a home, but none are part of the mortgage payment — budget for them
              separately.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {MORTGAGE_FAQ.map((item) => (
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
              Estimates for informational purposes only and not financial advice. Confirm all figures
              with your lender.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
