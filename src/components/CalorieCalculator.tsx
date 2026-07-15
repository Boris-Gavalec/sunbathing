"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  ACTIVITY_LEVELS,
  PACE_OPTIONS,
  CALORIE_FAQ,
  computeCalories,
  cmToFtIn,
  ftInToCm,
  kgToLb,
  lbToKg,
  formatDate,
  formatWeeks,
  type Sex,
  type GoalMode,
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

export default function CalorieCalculator() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [ageStr, setAgeStr] = useState("30");
  // metric height
  const [heightCmStr, setHeightCmStr] = useState("180");
  // imperial height
  const [heightFtStr, setHeightFtStr] = useState("5");
  const [heightInStr, setHeightInStr] = useState("11");
  // weight stored in the active unit's string
  const [weightStr, setWeightStr] = useState("80");
  const [activity, setActivity] = useState(ACTIVITY_LEVELS[2].value);
  const [goalMode, setGoalMode] = useState<GoalMode>("maintain");
  const [goalWeightStr, setGoalWeightStr] = useState("");
  const [pace, setPace] = useState(PACE_OPTIONS[1].value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isImperial = units === "imperial";

  // Switch units: convert the entered values so the number stays sensible.
  function switchUnits(next: UnitSystem) {
    if (next === units) return;
    if (next === "imperial") {
      // metric -> imperial
      const cm = num(heightCmStr);
      if (cm !== null) {
        const { feet, inches } = cmToFtIn(cm);
        setHeightFtStr(String(feet));
        setHeightInStr(String(inches));
      }
      const w = num(weightStr);
      if (w !== null) setWeightStr(String(Math.round(kgToLb(w))));
      const gw = num(goalWeightStr);
      if (gw !== null) setGoalWeightStr(String(Math.round(kgToLb(gw))));
    } else {
      // imperial -> metric
      const ft = num(heightFtStr) ?? 0;
      const inch = num(heightInStr) ?? 0;
      setHeightCmStr(String(Math.round(ftInToCm(ft, inch))));
      const w = num(weightStr);
      if (w !== null) setWeightStr(String(Math.round(lbToKg(w))));
      const gw = num(goalWeightStr);
      if (gw !== null) setGoalWeightStr(String(Math.round(lbToKg(gw))));
    }
    setUnits(next);
  }

  const parsed = useMemo(() => {
    const age = num(ageStr);
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
    const rawGoal = num(goalWeightStr);
    const goalWeightKg = rawGoal === null ? undefined : isImperial ? lbToKg(rawGoal) : rawGoal;

    return { age, heightCm, weightKg, goalWeightKg };
  }, [ageStr, heightCmStr, heightFtStr, heightInStr, weightStr, goalWeightStr, isImperial]);

  const activityMultiplier = ACTIVITY_LEVELS.find((a) => a.value === activity)!.multiplier;

  const valid =
    parsed.age !== null &&
    parsed.age > 0 &&
    parsed.heightCm !== null &&
    parsed.heightCm > 0 &&
    parsed.weightKg !== null &&
    parsed.weightKg > 0;

  const result = useMemo(() => {
    if (!valid) return null;
    return computeCalories({
      sex,
      age: parsed.age!,
      heightCm: parsed.heightCm!,
      weightKg: parsed.weightKg!,
      activityMultiplier,
      goalMode,
      goalWeightKg: parsed.goalWeightKg,
      paceKgPerWeek: pace,
    });
  }, [valid, sex, parsed, activityMultiplier, goalMode, pace]);

  // Display weight-change in the active unit
  function formatWeightChange(kg: number): string {
    const val = isImperial ? kgToLb(Math.abs(kg)) : Math.abs(kg);
    const unit = isImperial ? "lb" : "kg";
    const dir = kg < 0 ? "lose" : "gain";
    return `${dir} ${Math.round(val * 10) / 10} ${unit}`;
  }

  const weightUnit = isImperial ? "lb" : "kg";

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

      {/* Sex */}
      <div>
        <FieldLabel>Sex</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {(["male", "female"] as Sex[]).map((s) => (
            <button
              key={s}
              onClick={() => setSex(s)}
              className="flex-1 h-9 rounded-md text-xs font-bold capitalize transition-all"
              style={{
                background: sex === s ? "var(--accent)" : "var(--quick-start-bg)",
                color: sex === s ? "#fff" : "var(--text-secondary)",
                border: sex === s ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Age</FieldLabel>
          <span className="text-[11px] text-secondary">years</span>
        </div>
        <input
          type="number"
          min={1}
          max={120}
          aria-label="Age"
          value={ageStr}
          onChange={(e) => setAgeStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
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

      {/* Activity */}
      <div>
        <div className="mb-2">
          <FieldLabel>Activity level</FieldLabel>
        </div>
        <select
          aria-label="Activity level"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm input-muted"
        >
          {ACTIVITY_LEVELS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}: {a.description}
            </option>
          ))}
        </select>
      </div>

      {/* Goal mode */}
      <div>
        <div className="mb-2">
          <FieldLabel>Goal</FieldLabel>
        </div>
        <div className="flex gap-1.5">
          {(["maintain", "cut", "bulk"] as GoalMode[]).map((g) => (
            <button
              key={g}
              onClick={() => setGoalMode(g)}
              className="flex-1 h-9 rounded-md text-xs font-bold capitalize transition-all"
              style={{
                background: goalMode === g ? "var(--accent)" : "var(--quick-start-bg)",
                color: goalMode === g ? "#fff" : "var(--text-secondary)",
                border: goalMode === g ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Goal weight + pace (cut/bulk only) */}
      {goalMode !== "maintain" && (
        <>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>Goal weight</FieldLabel>
              <span className="text-[11px] text-secondary">{weightUnit}</span>
            </div>
            <input
              type="number"
              min={1}
              aria-label={`Goal weight in ${weightUnit}`}
              value={goalWeightStr}
              onChange={(e) => setGoalWeightStr(e.target.value)}
              placeholder={goalMode === "cut" ? "lower than current" : "higher than current"}
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>

          <div>
            <div className="mb-2">
              <FieldLabel>Pace</FieldLabel>
            </div>
            <div className="space-y-1.5">
              {PACE_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPace(p.value)}
                  className="w-full text-left px-3 py-2 rounded-md text-[11px] font-bold transition-all"
                  style={{
                    background: pace === p.value ? "var(--accent)" : "var(--quick-start-bg)",
                    color: pace === p.value ? "#fff" : "var(--text-secondary)",
                    border: pace === p.value ? "2px solid var(--accent)" : "1px solid var(--card-border)",
                  }}
                >
                  {isImperial ? p.labelImperial : p.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const goalActive = goalMode !== "maintain";
  const showProjection = result && goalActive && result.goalDate !== undefined;

  const results = (
    <div className="space-y-4 sm:space-y-5">
      {!valid && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
        >
          Enter your age, height, and weight to see your daily calorie target.
        </div>
      )}

      {result && (
        <>
          {result.belowSafetyFloor && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#ef4444" }}
            >
              <strong>Heads up:</strong> your target of {Math.round(result.targetCalories).toLocaleString()} kcal/day is
              below the recommended minimum of {result.safetyFloorValue.toLocaleString()} kcal for {sex === "male" ? "men" : "women"}.
              Consider a slower pace or more activity.
            </div>
          )}

          {/* Big accent target card */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              className="rounded-xl px-5 py-4 col-span-2 lg:col-span-1"
              style={{ background: "var(--accent-card-bg)", border: "1px solid var(--accent-card-border)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">
                {goalMode === "maintain" ? "Daily Target" : goalMode === "cut" ? "Cutting Target" : "Bulking Target"}
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {Math.round(result.targetCalories).toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                kcal / day
                {result.dailyAdjustment !== 0 &&
                  ` · ${result.dailyAdjustment < 0 ? "−" : "+"}${Math.round(Math.abs(result.dailyAdjustment))} vs maintenance`}
              </p>
            </div>

            <StatCard label="Maintenance (TDEE)" value={Math.round(result.tdee).toLocaleString()} sub="kcal / day" />
            <StatCard label="BMR" value={Math.round(result.bmr).toLocaleString()} sub="kcal at rest" />
          </div>

          {/* Goal projection */}
          {showProjection && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                label="Total change"
                value={formatWeightChange(result.totalWeightChangeKg!)}
                sub={`to your goal`}
              />
              <StatCard label="Time to goal" value={formatWeeks(result.weeksToGoal!)} sub="at chosen pace" />
              <StatCard label="Projected date" value={formatDate(result.goalDate!)} sub="if consistent" />
            </div>
          )}

          {goalActive && !showProjection && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
            >
              Enter a goal weight {goalMode === "cut" ? "below" : "above"} your current weight to see your timeline and projected date.
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-sm">
              🍎
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Calorie Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Find your daily calorie needs and plan a cut or bulk with a real target date
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
              How the Calorie Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Basal Metabolic Rate (BMR)
            </h3>
            <p className="mb-3">
              Your BMR is the number of calories your body burns at complete rest to keep your heart
              beating, lungs breathing, and cells working. This calculator uses the Mifflin-St Jeor
              equation, which is widely regarded as one of the most accurate BMR formulas. It factors in
              your sex, age, height, and weight.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Total Daily Energy Expenditure (TDEE)
            </h3>
            <p className="mb-3">
              TDEE is your BMR multiplied by an activity factor ranging from 1.2 (sedentary) to 1.9
              (extremely active). It represents all the calories you burn in a typical day, including
              exercise and daily movement. Eating at your TDEE keeps your weight stable. This is your
              maintenance level.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Cutting and bulking pace
            </h3>
            <p className="mb-3">
              To lose or gain weight, you eat below or above your maintenance calories. Roughly 7,700
              calories equal one kilogram of body mass, so a 0.5 kg/week pace means a daily deficit or
              surplus of about 550 calories. Faster paces produce quicker results but a cut that is too
              aggressive risks muscle loss, while a bulk that is too fast adds excess fat. The projected
              date assumes a steady, consistent pace.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {CALORIE_FAQ.map((item) => (
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
              These figures are estimates for informational purposes only and are not medical or
              nutritional advice. Individual needs vary, so consult a qualified professional before making
              significant dietary changes.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
