"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import { computeTip, TIP_FAQ, TIP_PRESETS } from "@/lib/tip";
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

export default function TipCalculator() {
  const [billStr, setBillStr] = useState("85");
  const [tipStr, setTipStr] = useState("18");
  const [peopleStr, setPeopleStr] = useState("2");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bill = num(billStr);
  const tipPct = num(tipStr);
  const people = num(peopleStr);

  const valid =
    bill !== null &&
    bill >= 0 &&
    tipPct !== null &&
    tipPct >= 0 &&
    people !== null &&
    people >= 1;

  const result = useMemo(() => {
    if (!valid) return null;
    // People is a headcount: fractional entries would produce a nonsense split.
    return computeTip(bill!, tipPct!, Math.floor(people!));
  }, [valid, bill, tipPct, people]);

  const splitting = people !== null && Math.floor(people) > 1;

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Bill amount</FieldLabel>
          <span className="text-[11px] text-secondary">USD</span>
        </div>
        <input
          type="number"
          min={0}
          step="0.01"
          aria-label="Bill amount"
          value={billStr}
          onChange={(e) => setBillStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Tip percentage</FieldLabel>
          <span className="text-[11px] text-secondary">{tipStr || 0}%</span>
        </div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {TIP_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setTipStr(String(preset))}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: tipStr === String(preset) ? "var(--accent)" : "var(--quick-start-bg)",
                color: tipStr === String(preset) ? "#fff" : "var(--text-secondary)",
                border:
                  tipStr === String(preset)
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
          aria-label="Custom tip percentage"
          value={tipStr}
          onChange={(e) => setTipStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Split between</FieldLabel>
          <span className="text-[11px] text-secondary">people</span>
        </div>
        <input
          type="number"
          min={1}
          step={1}
          aria-label="Number of people"
          value={peopleStr}
          onChange={(e) => setPeopleStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
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
          Enter a bill amount, a tip percentage, and at least one person to see the split.
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
                {splitting ? "Each person pays" : "Total to pay"}
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {formatMoney(splitting ? result.perPersonTotal : result.total)}
              </p>
              {splitting && (
                <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {Math.floor(people!)} people · {formatMoney(result.total)} total
                </p>
              )}
            </div>

            <StatCard label="Tip amount" value={formatMoney(result.tipAmount)} sub={`${tipPct}% of the bill`} />
            <StatCard label="Bill + tip" value={formatMoney(result.total)} sub="what leaves your wallet" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Tip per person"
              value={formatMoney(result.perPersonTip)}
              sub={splitting ? `split ${Math.floor(people!)} ways` : "just you"}
            />
            <StatCard
              label="Bill per person"
              value={formatMoney(bill! / Math.floor(people!))}
              sub="before the tip"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shrink-0 flex items-center justify-center text-sm">
              💵
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Tip Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Tip amount, bill total, and the split per person
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
              How the Tip Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              The tip is the bill multiplied by the percentage:{" "}
              <strong>tip = bill × (percent ÷ 100)</strong>. The total is the bill plus the tip, and
              splitting divides both figures evenly by the number of people. Nothing here is
              complicated — the value is in getting it right at the table without doing arithmetic in
              your head while everyone waits.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              How much to tip
            </h3>
            <p className="mb-3">
              In the United States, 15-20% is the usual range for table service, and 20% or more is
              normal for service you were pleased with. Counter service and takeaway carry lower
              expectations. These norms are strongly regional — tipping is modest or absent in much
              of Europe and Asia, so treat the presets as a US-centric starting point rather than a
              universal standard.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Pre-tax or post-tax?
            </h3>
            <p className="mb-3">
              Tipping on the pre-tax subtotal is the traditional convention, since tax is not part of
              the service. Plenty of people tip on the post-tax total because it is simpler, and on a
              typical bill the difference is a dollar or two. Enter whichever figure you want to tip
              on as the bill amount.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {TIP_FAQ.map((item) => (
              <div key={item.q} className="mb-4">
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {item.q}
                </h3>
                <p>{item.a}</p>
              </div>
            ))}
          </section>

          <footer className="text-center py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
            <p>Tipping customs vary by country and venue. These figures are guidance, not a rule.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
