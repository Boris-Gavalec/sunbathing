// Pure running pace / speed logic. No React.
// The mile definition is reused from @/lib/units.

import { KM_PER_MILE } from "@/lib/units";

export type DistanceUnit = "km" | "mi";

/** Which value the calculator worked out from the other two. */
export type SolvedFor = "time" | "distance" | "pace";

export interface PaceSolution {
  distanceKm: number;
  timeSeconds: number;
  paceSecPerKm: number;
  speedKmh: number;
  solvedFor: SolvedFor;
}

export function kmToUnit(km: number, unit: DistanceUnit): number {
  return unit === "mi" ? km / KM_PER_MILE : km;
}

export function unitToKm(value: number, unit: DistanceUnit): number {
  return unit === "mi" ? value * KM_PER_MILE : value;
}

/** Pace in sec/km expressed per the chosen unit. A mile is longer than a
 *  kilometre, so the pace *per mile* is a larger number. */
export function paceInUnit(secPerKm: number, unit: DistanceUnit): number {
  return unit === "mi" ? secPerKm * KM_PER_MILE : secPerKm;
}

export function paceFromUnit(secPerUnit: number, unit: DistanceUnit): number {
  return unit === "mi" ? secPerUnit / KM_PER_MILE : secPerUnit;
}

/**
 * Solve for whichever of distance / time / pace is missing, given the other two.
 *
 * Returns null unless exactly two are supplied and usable — with three the
 * inputs would be over-determined (and probably contradictory), and with fewer
 * than two there is nothing to solve.
 */
export function solvePace(
  distanceKm: number | null,
  timeSeconds: number | null,
  paceSecPerKm: number | null
): PaceSolution | null {
  const hasDistance = distanceKm !== null && distanceKm > 0;
  const hasTime = timeSeconds !== null && timeSeconds > 0;
  const hasPace = paceSecPerKm !== null && paceSecPerKm > 0;

  let d: number;
  let t: number;
  let p: number;
  let solvedFor: SolvedFor;

  if (hasDistance && hasTime) {
    d = distanceKm!;
    t = timeSeconds!;
    p = t / d;
    solvedFor = "pace";
  } else if (hasDistance && hasPace) {
    d = distanceKm!;
    p = paceSecPerKm!;
    t = d * p;
    solvedFor = "time";
  } else if (hasTime && hasPace) {
    t = timeSeconds!;
    p = paceSecPerKm!;
    d = t / p;
    solvedFor = "distance";
  } else {
    return null;
  }

  return {
    distanceKm: d,
    timeSeconds: t,
    paceSecPerKm: p,
    speedKmh: 3600 / p,
    solvedFor,
  };
}

/** Standard race distances, for projecting a finish time at the current pace. */
export const RACE_DISTANCES: { label: string; km: number }[] = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "Half marathon", km: 21.0975 },
  { label: "Marathon", km: 42.195 },
];

/** Seconds as H:MM:SS, dropping the hour when it is zero. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "—";
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

/** Pace as M:SS — hours would be meaningless here. */
export function formatPace(secPerUnit: number): string {
  if (!Number.isFinite(secPerUnit) || secPerUnit <= 0) return "—";
  const rounded = Math.round(secPerUnit);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export const PACE_FAQ: { q: string; a: string }[] = [
  {
    q: "How do I calculate running pace?",
    a: "Divide your time by the distance: pace = time ÷ distance. A 50-minute 10K is 50 ÷ 10 = 5 minutes per kilometre. Pace and speed are two views of the same thing — pace is time per unit of distance, speed is distance per unit of time, so one is the reciprocal of the other.",
  },
  {
    q: "What is the difference between pace and speed?",
    a: "Pace answers 'how long does each kilometre take?' and speed answers 'how far do I go each hour?'. Runners generally think in pace because it maps directly onto a race plan, while cyclists think in speed. A pace of 5:00 min/km is a speed of 12 km/h — the same effort described two ways.",
  },
  {
    q: "How do I convert pace per kilometre to pace per mile?",
    a: "Multiply by 1.609, since a mile is that many kilometres. A 5:00 min/km pace is about 8:03 min/mile. Note the direction: because a mile is longer, the pace per mile is always the larger number, which is the opposite of what happens when converting the distances themselves.",
  },
  {
    q: "What is a good running pace?",
    a: "It depends entirely on experience, distance and goals. Many recreational runners sit somewhere around 6:00-7:00 min/km for an easy run, while a sub-3-hour marathon needs roughly 4:15 min/km sustained for 42 km. The more useful comparison is with your own previous times rather than anyone else's.",
  },
  {
    q: "Can I predict a race time from my current pace?",
    a: "The projections here assume you hold exactly the same pace across the distance, which is optimistic for longer races — most runners slow down as distance increases. Treat a marathon projection from a 5K pace as an upper bound rather than a realistic target, and expect to add time as the distance grows.",
  },
  {
    q: "Why do I need to leave a field blank?",
    a: "The calculator solves for whatever is missing, so it needs exactly two of distance, time and pace. Filling in all three would over-determine the problem and the values would usually contradict each other. Clear the one you want to work out and it will be calculated from the other two.",
  },
];
