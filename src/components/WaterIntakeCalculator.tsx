"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  computeWaterIntake,
  HOT_CLIMATE_UPLIFT,
  ML_PER_30MIN_EXERCISE,
  ML_PER_KG,
  WATER_FAQ,
  type Climate,
} from "@/lib/water";
import { kgToLb, lbToKg, type UnitSystem } from "@/lib/calories";

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

const CLIMATES: { id: Climate; label: string }[] = [
  { id: "temperate", label: "Temperate" },
  { id: "hot", label: "Hot / humid" },
];

export default function WaterIntakeCalculator() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [weightStr, setWeightStr] = useState("75");
  const [exerciseStr, setExerciseStr] = useState("30");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isImperial = units === "imperial";
  const weightUnit = isImperial ? "lb" : "kg";

  // Convert the entered value on switch so the number stays sensible.
  function switchUnits(next: UnitSystem) {
    if (next === units) return;
    const w = num(weightStr);
    if (w !== null) {
      setWeightStr(String(Math.round(next === "imperial" ? kgToLb(w) : lbToKg(w))));
    }
    setUnits(next);
  }

  const rawWeight = num(weightStr);
  const weightKg = rawWeight === null ? null : isImperial ? lbToKg(rawWeight) : rawWeight;
  const exercise = num(exerciseStr);

  const valid = weightKg !== null && weightKg > 0 && exercise !== null && exercise >= 0;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeWaterIntake(weightKg!, exercise!, climate);
  }, [valid, weightKg, exercise, climate]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

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
              {u === "metric" ? "Metric (kg)" : "Imperial (lb)"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Body weight</FieldLabel>
          <span className="text-[11px] text-secondary">{weightUnit}</span>
        </div>
        <input
          type="number"
          min={1}
          aria-label={`Body weight in ${weightUnit}`}
          value={weightStr}
          onChange={(e) => setWeightStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Exercise</FieldLabel>
          <span className="text-[11px] text-secondary">minutes / day</span>
        </div>
        <input
          type="number"
          min={0}
          max={600}
          step={15}
          aria-label="Daily exercise in minutes"
          value={exerciseStr}
          onChange={(e) => setExerciseStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
        <div className="flex gap-1.5 mt-2">
          {[0, 30, 60, 90].map((preset) => (
            <button
              key={preset}
              onClick={() => setExerciseStr(String(preset))}
              className="flex-1 h-8 rounded-md text-xs font-bold transition-all"
              style={{
                background:
                  exerciseStr === String(preset) ? "var(--accent)" : "var(--quick-start-bg)",
                color: exerciseStr === String(preset) ? "#fff" : "var(--text-secondary)",
                border:
                  exerciseStr === String(preset)
                    ? "2px solid var(--accent)"
                    : "1px solid var(--card-border)",
              }}
            >
              {preset}m
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Climate</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {CLIMATES.map((c) => (
            <button
              key={c.id}
              onClick={() => setClimate(c.id)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: climate === c.id ? "var(--accent)" : "var(--quick-start-bg)",
                color: climate === c.id ? "#fff" : "var(--text-secondary)",
                border:
                  climate === c.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {c.label}
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
          Enter your body weight and daily exercise to see your hydration target.
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
                Daily target
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {result.liters.toFixed(1)}
                <span className="text-xl ml-1">L</span>
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                total fluid, food and drinks included
              </p>
            </div>

            <StatCard
              label="In glasses"
              value={String(Math.round(result.cups))}
              sub="240 ml cups"
            />
            <StatCard
              label="In fluid ounces"
              value={String(Math.round(result.flOz))}
              sub="US fl oz"
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
              Where the target comes from
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>
                  Baseline ({ML_PER_KG} ml × {Math.round(weightKg!)} kg)
                </span>
                <span className="font-mono" style={{ color: "var(--foreground)" }}>
                  {Math.round(result.baseMl)} ml
                </span>
              </div>
              {result.exerciseMl > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Exercise ({exercise} min)
                  </span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    +{Math.round(result.exerciseMl)} ml
                  </span>
                </div>
              )}
              {result.climateMl > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Hot climate (+{HOT_CLIMATE_UPLIFT * 100}%)
                  </span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    +{Math.round(result.climateMl)} ml
                  </span>
                </div>
              )}
              <div
                className="flex justify-between pt-2 font-bold"
                style={{ borderTop: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                <span>Total</span>
                <span className="font-mono">{Math.round(result.totalMl)} ml</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Baseline only"
              value={`${(result.baseMl / 1000).toFixed(1)} L`}
              sub={`${ML_PER_KG} ml per kg of body weight`}
            />
            <StatCard
              label="Per waking hour"
              value={`${Math.round(result.totalMl / 16)} ml`}
              sub="spread across ~16 hours"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shrink-0 flex items-center justify-center text-sm">
              💧
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Water Intake Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Your daily hydration target from weight, activity and climate
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
              How the Water Intake Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              The baseline is <strong>{ML_PER_KG} ml per kilogram of body weight</strong>, sitting in
              the middle of the widely cited 30-35 ml/kg range for healthy adults. Exercise adds{" "}
              <strong>{ML_PER_30MIN_EXERCISE} ml per 30 minutes</strong>, and a hot or humid climate
              lifts the baseline by <strong>{HOT_CLIMATE_UPLIFT * 100}%</strong>. The uplift applies
              to the baseline only — exercise fluid is counted separately and would otherwise be
              inflated twice.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Why scale by weight?
            </h3>
            <p className="mb-3">
              Because &quot;eight glasses a day&quot; ignores the person drinking them. Eight 240 ml
              glasses is about 1.9 litres — a reasonable average, but a 55 kg office worker and a 95 kg
              runner have very different needs. Scaling by body weight gets you materially closer with
              barely more effort.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              This is total fluid, not glasses of water
            </h3>
            <p className="mb-3">
              The target covers everything you take in. Tea and coffee count despite their mild
              diuretic effect, and food typically supplies around 20% of daily fluid — more if you eat
              plenty of fruit, vegetables and soup. You do not need to drink the whole figure from a
              glass.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Treat it as a starting point
            </h3>
            <p className="mb-3">
              Illness, pregnancy, breastfeeding, altitude and certain medications all shift
              requirements, and some medical conditions call for restricted fluid intake. Urine colour
              is the simplest day-to-day check — pale straw is the goal. And more is not always
              better: drinking far beyond what your kidneys can excrete dilutes blood sodium, which is
              genuinely dangerous, if rare outside endurance events.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {WATER_FAQ.map((item) => (
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
              An estimate for informational purposes only and not medical advice. If you have a
              kidney, heart or liver condition, follow your clinician&apos;s fluid guidance instead.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
