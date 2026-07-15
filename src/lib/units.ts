// Pure unit-conversion logic. No React.
//
// Length and weight are ratio scales, so every unit is expressed as a factor
// against a base unit (metres, kilograms) and converting is one multiply and
// one divide. Temperature is NOT a ratio scale — 20°C is not "twice" 10°C —
// so it needs offsets and is handled separately below. Sharing a factor table
// between them would be quietly wrong.

import { CM_PER_IN, LB_PER_KG } from "@/lib/calories";

export type UnitCategory = "length" | "weight" | "temperature";

export interface Unit {
  id: string;
  label: string;
  short: string;
}

export const UNIT_CATEGORIES: { id: UnitCategory; label: string; emoji: string }[] = [
  { id: "length", label: "Length", emoji: "📏" },
  { id: "weight", label: "Weight", emoji: "⚖️" },
  { id: "temperature", label: "Temperature", emoji: "🌡️" },
];

// ── Length: factors to metres ──
// Derived from CM_PER_IN so the site has a single inch definition.
const M_PER_IN = CM_PER_IN / 100;

export const LENGTH_UNITS: Unit[] = [
  { id: "mm", label: "Millimetres", short: "mm" },
  { id: "cm", label: "Centimetres", short: "cm" },
  { id: "m", label: "Metres", short: "m" },
  { id: "km", label: "Kilometres", short: "km" },
  { id: "in", label: "Inches", short: "in" },
  { id: "ft", label: "Feet", short: "ft" },
  { id: "yd", label: "Yards", short: "yd" },
  { id: "mi", label: "Miles", short: "mi" },
];

const LENGTH_FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: M_PER_IN,
  ft: M_PER_IN * 12,
  yd: M_PER_IN * 36,
  mi: M_PER_IN * 12 * 5280,
};

/** Kilometres per mile. Exported so the Pace calculator shares this definition
 *  rather than hardcoding its own 1.609. */
export const KM_PER_MILE = LENGTH_FACTORS.mi / 1000;

// ── Weight: factors to kilograms ──
// Derived from LB_PER_KG for the same reason.
const KG_PER_LB = 1 / LB_PER_KG;

export const WEIGHT_UNITS: Unit[] = [
  { id: "mg", label: "Milligrams", short: "mg" },
  { id: "g", label: "Grams", short: "g" },
  { id: "kg", label: "Kilograms", short: "kg" },
  { id: "t", label: "Metric tons", short: "t" },
  { id: "oz", label: "Ounces", short: "oz" },
  { id: "lb", label: "Pounds", short: "lb" },
  { id: "st", label: "Stone", short: "st" },
];

const WEIGHT_FACTORS: Record<string, number> = {
  mg: 1e-6,
  g: 0.001,
  kg: 1,
  t: 1000,
  oz: KG_PER_LB / 16,
  lb: KG_PER_LB,
  st: KG_PER_LB * 14,
};

// ── Temperature ──
export const TEMPERATURE_UNITS: Unit[] = [
  { id: "c", label: "Celsius", short: "°C" },
  { id: "f", label: "Fahrenheit", short: "°F" },
  { id: "k", label: "Kelvin", short: "K" },
];

/** Absolute zero, as a floor for validation. */
export const ABSOLUTE_ZERO_C = -273.15;

function toCelsius(value: number, from: string): number {
  switch (from) {
    case "f":
      return ((value - 32) * 5) / 9;
    case "k":
      return value + ABSOLUTE_ZERO_C;
    default:
      return value;
  }
}

function fromCelsius(celsius: number, to: string): number {
  switch (to) {
    case "f":
      return (celsius * 9) / 5 + 32;
    case "k":
      return celsius - ABSOLUTE_ZERO_C;
    default:
      return celsius;
  }
}

export function unitsFor(category: UnitCategory): Unit[] {
  switch (category) {
    case "length":
      return LENGTH_UNITS;
    case "weight":
      return WEIGHT_UNITS;
    case "temperature":
      return TEMPERATURE_UNITS;
  }
}

export function unitById(category: UnitCategory, id: string): Unit | undefined {
  return unitsFor(category).find((u) => u.id === id);
}

/**
 * Convert between two units of the same category.
 *
 * Returns null for unknown unit ids rather than silently producing NaN.
 */
export function convert(
  value: number,
  from: string,
  to: string,
  category: UnitCategory
): number | null {
  if (category === "temperature") {
    if (!TEMPERATURE_UNITS.some((u) => u.id === from)) return null;
    if (!TEMPERATURE_UNITS.some((u) => u.id === to)) return null;
    // Offsets, not ratios: go via Celsius rather than scaling by a factor.
    return fromCelsius(toCelsius(value, from), to);
  }

  const factors = category === "length" ? LENGTH_FACTORS : WEIGHT_FACTORS;
  const fromFactor = factors[from];
  const toFactor = factors[to];
  if (fromFactor === undefined || toFactor === undefined) return null;

  return (value * fromFactor) / toFactor;
}

/** Is this temperature below absolute zero, i.e. physically impossible? */
export function isBelowAbsoluteZero(value: number, unit: string): boolean {
  return toCelsius(value, unit) < ABSOLUTE_ZERO_C - 1e-9;
}

/**
 * Format a converted value. Unit conversion spans a huge dynamic range — a
 * millimetre in miles is 6.2e-7 — so fixed decimals would show "0.00" for
 * perfectly good answers. Very large and very small magnitudes fall back to
 * exponential notation.
 */
export function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e9 || magnitude < 1e-4) return value.toExponential(4);
  // Round to 6 significant figures, then drop trailing zeros.
  return String(parseFloat(value.toPrecision(6)));
}

export const UNITS_FAQ: { q: string; a: string }[] = [
  {
    q: "How does unit conversion work?",
    a: "For length and weight, every unit is defined as a fixed multiple of a base unit — metres and kilograms here. To convert, the value is multiplied into the base unit and then divided into the target, which is why any pair of units in a category can be converted directly.",
  },
  {
    q: "Why is temperature converted differently?",
    a: "Because temperature scales have offsets, not just different sizes of degree. Celsius and Fahrenheit disagree about both where zero sits and how big a degree is, so you cannot convert by multiplying alone: °F = °C × 9/5 + 32. This calculator converts every temperature via Celsius, which keeps the offsets correct.",
  },
  {
    q: "What is the one temperature where Celsius and Fahrenheit agree?",
    a: "−40. It is the single point where the two scales cross, so −40°C is exactly −40°F. It is a useful check on any temperature converter.",
  },
  {
    q: "How many pounds are in a kilogram?",
    a: "One kilogram is about 2.205 pounds, and one pound is about 0.454 kilograms. A stone is 14 pounds, so roughly 6.35 kilograms — a unit still commonly used for body weight in the UK and Ireland.",
  },
  {
    q: "Why is the answer shown in exponential notation?",
    a: "Because some conversions span an enormous range. A millimetre is about 0.00000062 miles, which would read as 0.00 at any sensible number of decimal places. Very large and very small results switch to exponential form so the answer is still meaningful rather than rounded away.",
  },
  {
    q: "Is a US ton the same as a metric ton?",
    a: "No. This converter uses the metric ton (tonne), which is exactly 1,000 kilograms, or about 2,205 pounds. A US short ton is 2,000 pounds — roughly 907 kilograms — so the two differ by about 10%.",
  },
];
