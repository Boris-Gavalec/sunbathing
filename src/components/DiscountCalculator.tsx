"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  computeDiscount,
  stackDiscounts,
  DISCOUNT_FAQ,
  DISCOUNT_PRESETS,
} from "@/lib/discount";
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

export default function DiscountCalculator() {
  const [priceStr, setPriceStr] = useState("120");
  const [percentStr, setPercentStr] = useState("25");
  const [extraStr, setExtraStr] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const price = num(priceStr);
  const percent = num(percentStr);
  const extra = num(extraStr);

  const valid =
    price !== null && price >= 0 && percent !== null && percent >= 0 && percent <= 100;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeDiscount(price!, percent!);
  }, [valid, price, percent]);

  // The second discount is optional; it only shows once a usable value is typed.
  const hasExtra = extra !== null && extra > 0 && extra <= 100;
  const stacked = useMemo(() => {
    if (!valid || !hasExtra) return null;
    const finalPrice = stackDiscounts(price!, percent!, extra!);
    const effectivePct = price! === 0 ? 0 : ((price! - finalPrice) / price!) * 100;
    return { finalPrice, effectivePct, saved: price! - finalPrice };
  }, [valid, hasExtra, price, percent, extra]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Original price</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={0}
          step="0.01"
          aria-label="Original price"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Discount</FieldLabel>
          <span className="text-[11px] text-secondary">{percentStr || 0}% off</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {DISCOUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setPercentStr(String(preset))}
              className="h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background:
                  percentStr === String(preset) ? "var(--accent)" : "var(--quick-start-bg)",
                color: percentStr === String(preset) ? "#fff" : "var(--text-secondary)",
                border:
                  percentStr === String(preset)
                    ? "2px solid var(--accent)"
                    : "1px solid var(--card-border)",
              }}
            >
              {preset}%
            </button>
          ))}
        </div>
        <input
          type="number"
          min={0}
          max={100}
          aria-label="Custom discount percentage"
          value={percentStr}
          onChange={(e) => setPercentStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Extra discount</FieldLabel>
          <span className="text-[11px] text-secondary">optional</span>
        </div>
        <input
          type="number"
          min={0}
          max={100}
          aria-label="Extra stacked discount percentage"
          value={extraStr}
          placeholder="e.g. 10 for an extra 10% off"
          onChange={(e) => setExtraStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <p className="text-[11px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Applied to the already-reduced price.
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
          Enter an original price and a discount between 0 and 100% to see the sale price.
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
                You pay
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {formatMoney(stacked ? stacked.finalPrice : result.finalPrice)}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                was {formatMoney(price!)}
              </p>
            </div>

            <StatCard
              label="You save"
              value={formatMoney(stacked ? stacked.saved : result.saved)}
              sub={
                stacked
                  ? `${stacked.effectivePct.toFixed(1)}% off in total`
                  : `${percent}% off the original`
              }
            />
            <StatCard
              label="You pay"
              value={`${((stacked ? 1 - stacked.effectivePct / 100 : result.fractionOfOriginal) * 100).toFixed(0)}%`}
              sub="of the original price"
            />
          </div>

          {stacked && (
            <div
              className="rounded-xl px-4 py-4"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                How the two discounts stack
              </p>
              <div className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <div className="flex justify-between">
                  <span>Original</span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    {formatMoney(price!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>After {percent}% off</span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    {formatMoney(result.finalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>After a further {extra}% off</span>
                  <span className="font-mono font-bold text-accent">
                    {formatMoney(stacked.finalPrice)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>
                Stacked discounts multiply rather than add: {percent}% and then {extra}% is{" "}
                <strong>{stacked.effectivePct.toFixed(1)}%</strong> off, not{" "}
                {(percent! + extra!).toFixed(0)}%.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Discount amount"
              value={formatMoney(result.saved)}
              sub={`the first ${percent}% off`}
            />
            <StatCard
              label="Price per $100"
              value={formatMoney((stacked ? 1 - stacked.effectivePct / 100 : result.fractionOfOriginal) * 100)}
              sub="a quick way to compare deals"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 shrink-0 flex items-center justify-center text-sm">
              🏷️
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Discount Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Sale price, amount saved, and how stacked discounts really add up
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
              How the Discount Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              The amount you save is the original price times the discount:{" "}
              <strong>saved = original × (percent ÷ 100)</strong>, and the sale price is the original
              minus that. The shortcut worth remembering is that the final price is{" "}
              <strong>original × (1 − percent ÷ 100)</strong> — so 25% off means you pay 75%.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Stacked discounts multiply
            </h3>
            <p className="mb-3">
              This is where shops quietly win. An extra 10% off an item already reduced by 20% is not
              30% off. The second discount applies to the reduced price, so you get 0.8 × 0.9 = 0.72
              — a 28% discount. The gap widens as the numbers grow: 50% and then another 50% is 75%
              off, not free. Enter a second discount above and the breakdown shows each step.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Judging whether a deal is good
            </h3>
            <p className="mb-3">
              A percentage is only as meaningful as the price it is taken from. A headline 70% off an
              inflated &quot;was&quot; price can be worth less than 20% off a genuine one, so compare
              the final price against what the item normally sells for elsewhere rather than trusting
              the discount on the label.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {DISCOUNT_FAQ.map((item) => (
              <div key={item.q} className="mb-4">
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {item.q}
                </h3>
                <p>{item.a}</p>
              </div>
            ))}
          </section>

          <footer className="text-center py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
            <p>Figures are pre-tax. Add any sales tax or VAT to the final price shown.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
