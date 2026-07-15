"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  applyPercent,
  percentChange,
  percentDifference,
  percentOf,
  whatPercent,
  PERCENTAGE_FAQ,
  PERCENTAGE_MODES,
  type PercentageMode,
} from "@/lib/percentage";

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

/** Trim float noise (0.30000000000000004) without forcing decimals on integers. */
function fmt(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return String(parseFloat(value.toFixed(decimals)));
}

/** Per-mode field labels — the two inputs mean different things in each mode. */
const FIELD_LABELS: Record<PercentageMode, { a: string; b: string }> = {
  of: { a: "Percentage", b: "Of value" },
  isWhatPercent: { a: "This value", b: "Is what % of" },
  change: { a: "From (old)", b: "To (new)" },
  difference: { a: "First value", b: "Second value" },
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>("of");
  const [aStr, setAStr] = useState("20");
  const [bStr, setBStr] = useState("250");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const a = num(aStr);
  const b = num(bStr);
  const bothEntered = a !== null && b !== null;

  const result = useMemo(() => {
    if (!bothEntered) return null;
    switch (mode) {
      case "of":
        return { value: percentOf(a!, b!), undefinedReason: null };
      case "isWhatPercent": {
        const value = whatPercent(a!, b!);
        return {
          value,
          undefinedReason:
            value === null ? "Nothing is a meaningful percentage of zero." : null,
        };
      }
      case "change": {
        const value = percentChange(a!, b!);
        return {
          value,
          undefinedReason:
            value === null
              ? "Percent change from zero is undefined — any rise from 0 is infinite in percentage terms."
              : null,
        };
      }
      case "difference": {
        const value = percentDifference(a!, b!);
        return {
          value,
          undefinedReason:
            value === null ? "Percent difference needs a non-zero average." : null,
        };
      }
    }
  }, [mode, a, b, bothEntered]);

  const labels = FIELD_LABELS[mode];

  const headline = useMemo(() => {
    if (!result || result.value === null) return "—";
    switch (mode) {
      case "of":
        return fmt(result.value);
      default:
        return `${fmt(result.value)}%`;
    }
  }, [result, mode]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <FieldLabel>What do you want to work out?</FieldLabel>
        <div className="flex flex-col gap-1.5 mt-2">
          {PERCENTAGE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3 py-2 rounded-md text-xs font-bold text-left transition-all"
              style={{
                background: mode === m.id ? "var(--accent)" : "var(--quick-start-bg)",
                color: mode === m.id ? "#fff" : "var(--text-secondary)",
                border: mode === m.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              <span className="block">{m.label}</span>
              <span
                className="block font-normal mt-0.5 text-[11px]"
                style={{ color: mode === m.id ? "rgba(255,255,255,0.85)" : "var(--text-secondary)" }}
              >
                {m.blurb}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>{labels.a}</FieldLabel>
          {mode === "of" && <span className="text-[11px] text-secondary">%</span>}
        </div>
        <input
          type="number"
          aria-label={labels.a}
          value={aStr}
          onChange={(e) => setAStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>{labels.b}</FieldLabel>
        </div>
        <input
          type="number"
          aria-label={labels.b}
          value={bStr}
          onChange={(e) => setBStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>
    </div>
  );

  const results = (
    <div className="space-y-4 sm:space-y-5">
      {!bothEntered && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          Enter both values to see the result.
        </div>
      )}

      {result && result.undefinedReason && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--foreground)" }}>No answer for these values.</strong>{" "}
          {result.undefinedReason}
        </div>
      )}

      {result && result.value !== null && (
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
                Result
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">{headline}</p>
              {mode === "change" && (
                <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {result.value >= 0 ? "increase" : "decrease"}
                </p>
              )}
            </div>

            {mode === "of" && (
              <>
                <StatCard label="The sum" value={`${fmt(a!)}% × ${fmt(b!)}`} sub="what was calculated" />
                <StatCard
                  label="The rest"
                  value={fmt(b! - result.value)}
                  sub={`the other ${fmt(100 - a!)}%`}
                />
              </>
            )}

            {mode === "isWhatPercent" && (
              <>
                <StatCard label="The sum" value={`${fmt(a!)} ÷ ${fmt(b!)}`} sub="part divided by whole" />
                <StatCard
                  label="The remainder"
                  value={`${fmt(100 - result.value)}%`}
                  sub={`is the other ${fmt(b! - a!)}`}
                />
              </>
            )}

            {mode === "change" && (
              <>
                <StatCard
                  label="Absolute change"
                  value={fmt(b! - a!)}
                  sub={`from ${fmt(a!)} to ${fmt(b!)}`}
                />
                <StatCard
                  label="Reverse it"
                  value={`${fmt(percentChange(b!, a!) ?? 0)}%`}
                  sub="going back the other way"
                />
              </>
            )}

            {mode === "difference" && (
              <>
                <StatCard label="Absolute gap" value={fmt(Math.abs(a! - b!))} sub="how far apart" />
                <StatCard label="Their average" value={fmt((a! + b!) / 2)} sub="the comparison base" />
              </>
            )}
          </div>

          {mode === "change" && (
            <div
              className="rounded-xl px-4 py-4 text-sm"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3">
                Why the reverse isn&apos;t the same
              </p>
              <p>
                Going from {fmt(a!)} to {fmt(b!)} is{" "}
                <strong style={{ color: "var(--accent)" }}>{fmt(result.value)}%</strong>, but coming
                back from {fmt(b!)} to {fmt(a!)} is{" "}
                <strong style={{ color: "var(--foreground)" }}>
                  {fmt(percentChange(b!, a!) ?? 0)}%
                </strong>{" "}
                — not the same number with the sign flipped. Each percentage is measured against a
                different starting value, which is why a 50% fall needs a 100% rise to undo.
              </p>
            </div>
          )}

          {mode === "of" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatCard
                label={`${fmt(b!)} increased by ${fmt(a!)}%`}
                value={fmt(applyPercent(b!, a!))}
                sub="value + percentage"
              />
              <StatCard
                label={`${fmt(b!)} decreased by ${fmt(a!)}%`}
                value={fmt(applyPercent(b!, -a!))}
                sub="value − percentage"
              />
            </div>
          )}
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 shrink-0 flex items-center justify-center text-sm">
              🔢
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Percentage Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Percent of a number, percent change, and percent difference
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
              How the Percentage Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Percentage of a number
            </h3>
            <p className="mb-3">
              Multiply and divide by a hundred: <strong>result = value × percent ÷ 100</strong>. So
              20% of 250 is 250 × 20 ÷ 100 = 50. The shortcut worth internalising is that 10% is just
              the number with its decimal point moved one place left — everything else builds from
              there.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Percentage change vs percentage difference
            </h3>
            <p className="mb-3">
              These are not the same thing and the distinction matters.{" "}
              <strong>Percentage change</strong> has a direction — it measures a move from an old
              value to a new one, <strong>(new − old) ÷ old × 100</strong> — so swapping the inputs
              gives a different answer. <strong>Percentage difference</strong> compares two values
              against their average, <strong>|a − b| ÷ ((a + b) ÷ 2) × 100</strong>, and is symmetric.
              Use change for before-and-after; use difference when neither value is the baseline.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The asymmetry that catches people out
            </h3>
            <p className="mb-3">
              A 50% rise followed by a 50% fall does not return you to where you started. 100 rises
              to 150, then falls to 75 — because the fall is taken from the larger number. The same
              arithmetic is why an investment that drops 50% must gain 100% to break even. Percentages
              are always relative to whatever base they are applied to.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Percent versus percentage point
            </h3>
            <p className="mb-3">
              If a rate moves from 4% to 5%, that is a rise of one <em>percentage point</em> but a 25%
              relative increase. Both are correct, and quoting whichever sounds more dramatic is a
              favourite trick of misleading statistics.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {PERCENTAGE_FAQ.map((item) => (
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
