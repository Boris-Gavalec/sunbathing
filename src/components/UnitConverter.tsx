"use client";

import { useState, useMemo } from "react";
import SiteNav from "@/components/SiteNav";
import {
  convert,
  formatConverted,
  isBelowAbsoluteZero,
  unitById,
  unitsFor,
  ABSOLUTE_ZERO_C,
  UNITS_FAQ,
  UNIT_CATEGORIES,
  type UnitCategory,
} from "@/lib/units";

function num(value: string): number | null {
  if (value.trim() === "") return null;
  const n = parseFloat(value);
  return isNaN(n) ? null : n;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-secondary">{children}</span>;
}

/** Sensible starting pair per category. */
const DEFAULT_UNITS: Record<UnitCategory, { from: string; to: string }> = {
  length: { from: "cm", to: "in" },
  weight: { from: "kg", to: "lb" },
  temperature: { from: "c", to: "f" },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState(DEFAULT_UNITS.length.from);
  const [toUnit, setToUnit] = useState(DEFAULT_UNITS.length.to);
  const [valueStr, setValueStr] = useState("180");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Units belong to a category, so switching category must reset the pair —
  // otherwise "cm" would linger while converting temperature.
  function switchCategory(next: UnitCategory) {
    if (next === category) return;
    setCategory(next);
    setFromUnit(DEFAULT_UNITS[next].from);
    setToUnit(DEFAULT_UNITS[next].to);
  }

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  const value = num(valueStr);
  const units = unitsFor(category);

  const impossibleTemp =
    category === "temperature" && value !== null && isBelowAbsoluteZero(value, fromUnit);

  const converted = useMemo(() => {
    if (value === null || impossibleTemp) return null;
    return convert(value, fromUnit, toUnit, category);
  }, [value, fromUnit, toUnit, category, impossibleTemp]);

  const fromLabel = unitById(category, fromUnit);
  const toLabel = unitById(category, toUnit);

  // A compact reference row: this value in every other unit of the category.
  const allConversions = useMemo(() => {
    if (value === null || impossibleTemp) return [];
    return units
      .filter((u) => u.id !== fromUnit)
      .map((u) => ({ unit: u, result: convert(value, fromUnit, u.id, category) }))
      .filter((row): row is { unit: typeof units[0]; result: number } => row.result !== null);
  }, [value, fromUnit, category, units, impossibleTemp]);

  const inputs = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Parameters</h2>
      </div>

      <div>
        <FieldLabel>Category</FieldLabel>
        <div className="flex flex-col gap-1.5 mt-2">
          {UNIT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCategory(c.id)}
              className="px-3 py-2 rounded-md text-xs font-bold text-left transition-all flex items-center gap-2"
              style={{
                background: category === c.id ? "var(--accent)" : "var(--quick-start-bg)",
                color: category === c.id ? "#fff" : "var(--text-secondary)",
                border:
                  category === c.id ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              <span aria-hidden="true">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>Value</FieldLabel>
          <span className="text-[11px] text-secondary">{fromLabel?.short}</span>
        </div>
        <input
          type="number"
          aria-label="Value to convert"
          value={valueStr}
          onChange={(e) => setValueStr(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>From</FieldLabel>
        </div>
        <select
          aria-label="Convert from unit"
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm input-muted"
        >
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label} ({u.short})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={swap}
        className="w-full h-9 rounded-md text-xs font-bold transition-all"
        style={{
          background: "var(--quick-start-bg)",
          color: "var(--text-secondary)",
          border: "1px solid var(--card-border)",
        }}
      >
        ⇅ Swap units
      </button>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel>To</FieldLabel>
        </div>
        <select
          aria-label="Convert to unit"
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm input-muted"
        >
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label} ({u.short})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const results = (
    <div className="space-y-4 sm:space-y-5">
      {value === null && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          Enter a value to convert.
        </div>
      )}

      {impossibleTemp && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--foreground)" }}>Below absolute zero.</strong> Nothing can be
          colder than {ABSOLUTE_ZERO_C}°C (0 K, −459.67°F), so there is no temperature to convert.
        </div>
      )}

      {converted !== null && (
        <>
          <div
            className="rounded-xl px-5 py-5"
            style={{
              background: "var(--accent-card-bg)",
              border: "1px solid var(--accent-card-border)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">
              {fromLabel?.label} → {toLabel?.label}
            </p>
            <p className="text-4xl font-bold font-mono tracking-tight text-accent break-all">
              {formatConverted(converted)}
              <span className="text-xl ml-2">{toLabel?.short}</span>
            </p>
            <p className="text-xs mt-2 font-semibold" style={{ color: "var(--text-secondary)" }}>
              {formatConverted(value!)} {fromLabel?.short} = {formatConverted(converted)}{" "}
              {toLabel?.short}
            </p>
          </div>

          <div
            className="rounded-xl px-4 py-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {formatConverted(value!)} {fromLabel?.short} in every unit
            </p>
            <div className="space-y-2">
              {allConversions.map(({ unit, result }) => (
                <div key={unit.id} className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>{unit.label}</span>
                  <span
                    className="font-mono"
                    style={{
                      color: unit.id === toUnit ? "var(--accent)" : "var(--foreground)",
                      fontWeight: unit.id === toUnit ? 700 : 400,
                    }}
                  >
                    {formatConverted(result)} {unit.short}
                  </span>
                </div>
              ))}
            </div>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 shrink-0 flex items-center justify-center text-sm">
              📐
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Unit Converter</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Length, weight and temperature — converted instantly
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
              How the Unit Converter Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Length and weight: ratio scales
            </h3>
            <p className="mb-3">
              Every length is stored as a multiple of a metre and every weight as a multiple of a
              kilogram. Converting is then two steps: multiply into the base unit, divide into the
              target. Because all the units share a base, any pair converts directly and the
              relationships stay consistent — a foot is always exactly twelve inches, however you get
              there.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Temperature is different
            </h3>
            <p className="mb-3">
              Temperature is <strong>not</strong> a ratio scale, and treating it like one is the
              classic bug. 20°C is not twice as hot as 10°C, because zero on the Celsius scale is an
              arbitrary point rather than an absence of temperature. Celsius and Fahrenheit disagree
              about both where zero sits and how large a degree is, so conversion needs an offset as
              well as a scale factor: <strong>°F = °C × 9/5 + 32</strong>. This converter routes every
              temperature through Celsius so the offsets stay correct — including negatives, where
              −40°C and −40°F are the same temperature.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Absolute zero
            </h3>
            <p className="mb-3">
              Kelvin starts at absolute zero — {ABSOLUTE_ZERO_C}°C — the point where there is no
              thermal energy left to remove. Nothing can be colder, so the converter refuses values
              below it rather than returning a negative Kelvin figure that cannot exist.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Very large and very small results
            </h3>
            <p className="mb-3">
              Conversions can span an enormous range: a millimetre is roughly 0.00000062 miles, which
              would round to zero at any normal number of decimal places. Results outside a readable
              range switch to exponential notation so the answer survives instead of being rounded
              away.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {UNITS_FAQ.map((item) => (
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
