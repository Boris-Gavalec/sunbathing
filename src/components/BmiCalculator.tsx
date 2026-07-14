"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  BMI_CATEGORIES,
  BMI_FAQ,
  computeBmi,
  type BmiResult,
} from "@/lib/bmi";
import {
  cmToFtIn,
  ftInToCm,
  kgToLb,
  lbToKg,
  type UnitSystem,
} from "@/lib/calories";

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

// Visual scale from BMI 15 to 40 with WHO category segments and a marker.
const SCALE_MIN = 15;
const SCALE_MAX = 40;

function BmiScale({ result }: { result: BmiResult }) {
  const clamped = Math.min(Math.max(result.bmi, SCALE_MIN), SCALE_MAX);
  const markerPct = ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
        Where you fall on the scale
      </p>
      <div className="relative pt-4 pb-1">
        {/* Marker */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${markerPct}%` }}
          aria-hidden="true"
        >
          <span
            className="text-[10px] font-bold font-mono px-1 rounded"
            style={{ color: result.category.color }}
          >
            {result.bmi.toFixed(1)}
          </span>
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `6px solid ${result.category.color}`,
            }}
          />
        </div>
        {/* Segmented track */}
        <div className="flex h-3 rounded-full overflow-hidden mt-4">
          {BMI_CATEGORIES.map((cat) => {
            const start = Math.max(cat.min, SCALE_MIN);
            const end = Math.min(cat.max === Infinity ? SCALE_MAX : cat.max, SCALE_MAX);
            if (end <= start) return null;
            const width = ((end - start) / (SCALE_MAX - SCALE_MIN)) * 100;
            return (
              <div
                key={cat.label}
                title={`${cat.label}: ${cat.min}${cat.max === Infinity ? "+" : `–${cat.max}`}`}
                style={{
                  width: `${width}%`,
                  background: cat.color,
                  opacity: cat.label === result.category.label ? 1 : 0.35,
                }}
              />
            );
          })}
        </div>
        {/* Tick labels */}
        <div className="relative h-4 mt-1 text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
          {[18.5, 25, 30, 35].map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2"
              style={{ left: `${((tick - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {BMI_CATEGORIES.map((cat) => (
          <span key={cat.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: cat.color }} />
            {cat.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BmiCalculator() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  // metric height
  const [heightCmStr, setHeightCmStr] = useState("180");
  // imperial height
  const [heightFtStr, setHeightFtStr] = useState("5");
  const [heightInStr, setHeightInStr] = useState("11");
  // weight stored in the active unit's string
  const [weightStr, setWeightStr] = useState("80");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isImperial = units === "imperial";
  const weightUnit = isImperial ? "lb" : "kg";

  // Switch units: convert the entered values so the number stays sensible.
  function switchUnits(next: UnitSystem) {
    if (next === units) return;
    if (next === "imperial") {
      const cm = num(heightCmStr);
      if (cm !== null) {
        const { feet, inches } = cmToFtIn(cm);
        setHeightFtStr(String(feet));
        setHeightInStr(String(inches));
      }
      const w = num(weightStr);
      if (w !== null) setWeightStr(String(Math.round(kgToLb(w))));
    } else {
      const ft = num(heightFtStr) ?? 0;
      const inch = num(heightInStr) ?? 0;
      setHeightCmStr(String(Math.round(ftInToCm(ft, inch))));
      const w = num(weightStr);
      if (w !== null) setWeightStr(String(Math.round(lbToKg(w))));
    }
    setUnits(next);
  }

  const parsed = useMemo(() => {
    let heightCm: number | null;
    if (isImperial) {
      const ft = num(heightFtStr);
      const inch = num(heightInStr);
      heightCm = ft === null && inch === null ? null : ftInToCm(ft ?? 0, inch ?? 0);
    } else {
      heightCm = num(heightCmStr);
    }
    const rawWeight = num(weightStr);
    const weightKg = rawWeight === null ? null : isImperial ? lbToKg(rawWeight) : rawWeight;
    return { heightCm, weightKg };
  }, [heightCmStr, heightFtStr, heightInStr, weightStr, isImperial]);

  const valid =
    parsed.heightCm !== null && parsed.heightCm > 0 && parsed.weightKg !== null && parsed.weightKg > 0;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeBmi(parsed.weightKg!, parsed.heightCm!);
  }, [valid, parsed]);

  function formatWeight(kg: number): string {
    const val = isImperial ? kgToLb(kg) : kg;
    return `${Math.round(val * 10) / 10}`;
  }

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      {/* Units */}
      <div>
        <FieldLabel>Units</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {(["metric", "imperial"] as UnitSystem[]).map((u) => (
            <button
              key={u}
              onClick={() => switchUnits(u)}
              className="flex-1 h-9 rounded-md text-xs font-bold capitalize transition-all"
              style={{
                background: units === u ? "var(--accent)" : "var(--quick-start-bg)",
                color: units === u ? "#fff" : "var(--text-secondary)",
                border: units === u ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
            </button>
          ))}
        </div>
      </div>

      {/* Height */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Height</FieldLabel>
          <span className="text-[11px] text-secondary">{isImperial ? "ft / in" : "cm"}</span>
        </div>
        {isImperial ? (
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={8}
              aria-label="Height feet"
              value={heightFtStr}
              onChange={(e) => setHeightFtStr(e.target.value)}
              placeholder="ft"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
            <input
              type="number"
              min={0}
              max={11}
              aria-label="Height inches"
              value={heightInStr}
              onChange={(e) => setHeightInStr(e.target.value)}
              placeholder="in"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>
        ) : (
          <input
            type="number"
            min={50}
            max={260}
            aria-label="Height in centimeters"
            value={heightCmStr}
            onChange={(e) => setHeightCmStr(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
          />
        )}
      </div>

      {/* Weight */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Weight</FieldLabel>
          <span className="text-[11px] text-secondary">{weightUnit}</span>
        </div>
        <input
          type="number"
          min={1}
          aria-label={`Weight in ${weightUnit}`}
          value={weightStr}
          onChange={(e) => setWeightStr(e.target.value)}
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
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
        >
          Enter your height and weight to see your BMI and weight category.
        </div>
      )}

      {result && (
        <>
          {/* Big accent BMI card */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              className="rounded-xl px-5 py-4 col-span-2 lg:col-span-1"
              style={{ background: "var(--accent-card-bg)", border: "1px solid var(--accent-card-border)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">Your BMI</p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">{result.bmi.toFixed(1)}</p>
              <p className="text-xs mt-1 font-semibold" style={{ color: result.category.color }}>
                {result.category.label}
              </p>
            </div>

            <StatCard
              label="Healthy weight range"
              value={`${formatWeight(result.healthyRange.minKg)}–${formatWeight(result.healthyRange.maxKg)}`}
              sub={`${weightUnit} for your height`}
            />
            <StatCard label="BMI prime" value={result.bmiPrime.toFixed(2)} sub="ratio to upper normal limit (1.0)" />
          </div>

          <BmiScale result={result} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Ponderal index"
              value={result.ponderalIndex.toFixed(1)}
              sub="kg/m³ — better for very tall or short people"
            />
            <StatCard
              label="Normal BMI band"
              value="18.5–24.9"
              sub="WHO healthy range for adults"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shrink-0 flex items-center justify-center text-sm">
              ⚖️
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">BMI Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Body mass index, WHO weight category, and your healthy weight range
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: collapsible parameters */}
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

      <main className="flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-[300px] shrink-0 border-r p-5 overflow-y-auto border-card bg-card">
          {inputs}
        </aside>

        <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto">
          {results}

          {/* Educational / SEO content */}
          <section className="rounded-xl p-4 sm:p-6 bg-card card-border text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              How the BMI Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              Body mass index divides your weight in kilograms by the square of your height in meters:
              <strong> BMI = kg / m²</strong>. If you enter imperial units, they are converted first, so
              the result is identical either way. The World Health Organization then classifies the
              number: under 18.5 is underweight, 18.5–24.9 is the normal range, 25–29.9 is overweight,
              and 30 or above falls into the three obesity classes.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Healthy weight range
            </h3>
            <p className="mb-3">
              The healthy weight range shown is simply the weight that would put your BMI between 18.5
              and 24.9 at your current height. It is a population-level guideline rather than a personal
              target — where you feel and perform best within (or near) that range depends on your build
              and muscle mass.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Know the limits
            </h3>
            <p className="mb-3">
              BMI is a screening tool, not a body composition measurement. It cannot tell muscle from
              fat, so a muscular athlete may read as overweight while someone with little muscle can
              read normal despite high body fat. BMI prime and the ponderal index shown alongside give
              extra context, but for a real assessment of body composition, look at measurements like
              waist circumference or a body fat estimate.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {BMI_FAQ.map((item) => (
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
              BMI is a screening estimate for informational purposes only and is not medical advice.
              Consult a qualified professional for a proper health assessment.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
