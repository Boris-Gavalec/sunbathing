"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  formatDuration,
  formatPace,
  paceFromUnit,
  paceInUnit,
  kmToUnit,
  unitToKm,
  solvePace,
  PACE_FAQ,
  RACE_DISTANCES,
  type DistanceUnit,
  type SolvedFor,
} from "@/lib/pace";

function num(value: string): number | null {
  if (value.trim() === "") return null;
  const n = parseFloat(value);
  return isNaN(n) ? null : n;
}

/** Blank sub-fields read as 0 so "50 minutes" needs no leading "0" hours. */
function part(value: string): number {
  const n = num(value);
  return n === null || n < 0 ? 0 : n;
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

const SOLVE_OPTIONS: { id: SolvedFor; label: string }[] = [
  { id: "pace", label: "Pace" },
  { id: "time", label: "Time" },
  { id: "distance", label: "Distance" },
];

export default function PaceCalculator() {
  // An explicit choice of what to solve for, rather than inferring it from
  // whichever field is blank: with all three filled the inputs contradict each
  // other, and there is no non-arbitrary way to pick a winner.
  const [solveFor, setSolveFor] = useState<SolvedFor>("pace");
  const [unit, setUnit] = useState<DistanceUnit>("km");

  const [distanceStr, setDistanceStr] = useState("10");
  const [hoursStr, setHoursStr] = useState("0");
  const [minutesStr, setMinutesStr] = useState("50");
  const [secondsStr, setSecondsStr] = useState("0");
  const [paceMinStr, setPaceMinStr] = useState("5");
  const [paceSecStr, setPaceSecStr] = useState("0");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Convert the entered distance and pace so switching units keeps the same run.
  function switchUnit(next: DistanceUnit) {
    if (next === unit) return;
    const d = num(distanceStr);
    if (d !== null) {
      setDistanceStr(String(Math.round(kmToUnit(unitToKm(d, unit), next) * 100) / 100));
    }
    const paceSecPerKm = paceFromUnit(part(paceMinStr) * 60 + part(paceSecStr), unit);
    const nextPace = Math.round(paceInUnit(paceSecPerKm, next));
    setPaceMinStr(String(Math.floor(nextPace / 60)));
    setPaceSecStr(String(nextPace % 60));
    setUnit(next);
  }

  const distanceKm = useMemo(() => {
    const d = num(distanceStr);
    return d === null ? null : unitToKm(d, unit);
  }, [distanceStr, unit]);

  const timeSeconds = part(hoursStr) * 3600 + part(minutesStr) * 60 + part(secondsStr);
  const paceSecPerKm = paceFromUnit(part(paceMinStr) * 60 + part(paceSecStr), unit);

  // Feed in null for the value being solved for, so solvePace uses the other two.
  const result = useMemo(() => {
    return solvePace(
      solveFor === "distance" ? null : distanceKm,
      solveFor === "time" ? null : timeSeconds || null,
      solveFor === "pace" ? null : paceSecPerKm || null
    );
  }, [solveFor, distanceKm, timeSeconds, paceSecPerKm]);

  const showDistance = solveFor !== "distance";
  const showTime = solveFor !== "time";
  const showPace = solveFor !== "pace";

  const unitLabel = unit === "km" ? "km" : "mi";

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <FieldLabel>Calculate</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {SOLVE_OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setSolveFor(o.id)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: solveFor === o.id ? "var(--accent)" : "var(--quick-start-bg)",
                color: solveFor === o.id ? "#fff" : "var(--text-secondary)",
                border:
                  solveFor === o.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Enter the other two and this is worked out for you.
        </p>
      </div>

      <div>
        <FieldLabel>Distance unit</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {(["km", "mi"] as DistanceUnit[]).map((u) => (
            <button
              key={u}
              onClick={() => switchUnit(u)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: unit === u ? "var(--accent)" : "var(--quick-start-bg)",
                color: unit === u ? "#fff" : "var(--text-secondary)",
                border: unit === u ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {u === "km" ? "Kilometres" : "Miles"}
            </button>
          ))}
        </div>
      </div>

      {showDistance && (
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <FieldLabel>Distance</FieldLabel>
            <span className="text-[11px] text-secondary">{unitLabel}</span>
          </div>
          <input
            type="number"
            min={0}
            step="0.01"
            aria-label={`Distance in ${unitLabel}`}
            value={distanceStr}
            onChange={(e) => setDistanceStr(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
          />
          <div className="flex gap-1.5 mt-2">
            {RACE_DISTANCES.map((race) => (
              <button
                key={race.label}
                onClick={() =>
                  setDistanceStr(String(Math.round(kmToUnit(race.km, unit) * 100) / 100))
                }
                className="flex-1 h-8 rounded-md text-[10px] font-bold transition-all"
                style={{
                  background: "var(--quick-start-bg)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {race.label === "Half marathon" ? "Half" : race.label === "Marathon" ? "Full" : race.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showTime && (
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <FieldLabel>Time</FieldLabel>
            <span className="text-[11px] text-secondary">h : m : s</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              aria-label="Hours"
              value={hoursStr}
              onChange={(e) => setHoursStr(e.target.value)}
              placeholder="h"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
            <input
              type="number"
              min={0}
              max={59}
              aria-label="Minutes"
              value={minutesStr}
              onChange={(e) => setMinutesStr(e.target.value)}
              placeholder="m"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
            <input
              type="number"
              min={0}
              max={59}
              aria-label="Seconds"
              value={secondsStr}
              onChange={(e) => setSecondsStr(e.target.value)}
              placeholder="s"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>
        </div>
      )}

      {showPace && (
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <FieldLabel>Pace</FieldLabel>
            <span className="text-[11px] text-secondary">min : sec per {unitLabel}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              aria-label={`Pace minutes per ${unitLabel}`}
              value={paceMinStr}
              onChange={(e) => setPaceMinStr(e.target.value)}
              placeholder="min"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
            <input
              type="number"
              min={0}
              max={59}
              aria-label={`Pace seconds per ${unitLabel}`}
              value={paceSecStr}
              onChange={(e) => setPaceSecStr(e.target.value)}
              placeholder="sec"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>
        </div>
      )}
    </div>
  );

  const headline = useMemo(() => {
    if (!result) return { value: "—", label: "", sub: "" };
    switch (solveFor) {
      case "pace":
        return {
          value: formatPace(paceInUnit(result.paceSecPerKm, unit)),
          label: "Your pace",
          sub: `min/${unitLabel}`,
        };
      case "time":
        return {
          value: formatDuration(result.timeSeconds),
          label: "Your finish time",
          sub: `over ${Math.round(kmToUnit(result.distanceKm, unit) * 100) / 100} ${unitLabel}`,
        };
      case "distance":
        return {
          value: String(Math.round(kmToUnit(result.distanceKm, unit) * 100) / 100),
          label: "Distance covered",
          sub: unitLabel,
        };
    }
  }, [result, solveFor, unit, unitLabel]);

  const results = (
    <div className="space-y-4 sm:space-y-5">
      {!result && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          Enter the other two values — all must be above zero — to work out your{" "}
          {solveFor === "pace" ? "pace" : solveFor === "time" ? "finish time" : "distance"}.
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
                {headline.label}
              </p>
              <p className="text-4xl font-bold font-mono tracking-tight text-accent">
                {headline.value}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                {headline.sub}
              </p>
            </div>

            <StatCard
              label="Speed"
              value={`${(unit === "km" ? result.speedKmh : kmToUnit(result.speedKmh, "mi")).toFixed(2)}`}
              sub={unit === "km" ? "km/h" : "mph"}
            />
            <StatCard
              label={`Pace per ${unit === "km" ? "mile" : "km"}`}
              value={formatPace(paceInUnit(result.paceSecPerKm, unit === "km" ? "mi" : "km"))}
              sub={`the same effort in ${unit === "km" ? "min/mi" : "min/km"}`}
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
              Race times at this pace
            </p>
            <div className="space-y-2">
              {RACE_DISTANCES.map((race) => (
                <div key={race.label} className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>
                    {race.label}{" "}
                    <span className="text-[11px]">
                      ({Math.round(kmToUnit(race.km, unit) * 100) / 100} {unitLabel})
                    </span>
                  </span>
                  <span className="font-mono" style={{ color: "var(--foreground)" }}>
                    {formatDuration(race.km * result.paceSecPerKm)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>
              Assumes you hold this exact pace the whole way. Most runners slow as the distance grows,
              so read the longer races as an optimistic ceiling rather than a target.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              label="Total time"
              value={formatDuration(result.timeSeconds)}
              sub={`for ${Math.round(kmToUnit(result.distanceKm, unit) * 100) / 100} ${unitLabel}`}
            />
            <StatCard
              label="Time per 400m lap"
              value={formatDuration(0.4 * result.paceSecPerKm)}
              sub="one lap of a running track"
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 shrink-0 flex items-center justify-center text-sm">
              🏃
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Pace Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Running pace, speed, time and distance — solve for any one
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
              How the Pace Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              One formula, three questions
            </h3>
            <p className="mb-3">
              Everything here comes from <strong>pace = time ÷ distance</strong>, rearranged. Give it
              distance and time and it returns pace; distance and pace and it returns your finish
              time; time and pace and it returns how far you went. Pick what you want to calculate and
              fill in the other two.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Pace and speed are the same thing
            </h3>
            <p className="mb-3">
              Pace is time per unit of distance; speed is distance per unit of time. They are
              reciprocals, so 5:00 min/km is exactly 12 km/h. Runners tend to think in pace because it
              translates straight into a race plan — you can watch it on a watch and know instantly
              whether you are on target. Cyclists tend to think in speed.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Converting between km and miles
            </h3>
            <p className="mb-3">
              A mile is about 1.609 km, so a 5:00 min/km pace is roughly 8:03 min/mile. Watch the
              direction: because a mile is <em>longer</em>, the pace per mile is the <em>bigger</em>{" "}
              number — the opposite of what happens when you convert the distances themselves. Switching
              units above converts your entries rather than reinterpreting them, so the run stays the
              same.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              About the race projections
            </h3>
            <p className="mb-3">
              The race table assumes you hold exactly the same pace over every distance, which is
              optimistic. In reality pace drifts as distance grows — a marathon projected from your 5K
              pace is a ceiling, not a plan. Experienced runners typically add a meaningful margin per
              step up in distance.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {PACE_FAQ.map((item) => (
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
