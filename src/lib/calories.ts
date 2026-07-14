// Pure calorie / TDEE / goal-planning logic. No React.

export type Sex = "male" | "female";
export type GoalMode = "maintain" | "cut" | "bulk";
export type UnitSystem = "metric" | "imperial";

export interface ActivityLevel {
  value: string;
  label: string;
  description: string;
  multiplier: number;
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", description: "Little or no exercise", multiplier: 1.2 },
  { value: "light", label: "Lightly active", description: "Light exercise 1–3 days/week", multiplier: 1.375 },
  { value: "moderate", label: "Moderately active", description: "Moderate exercise 3–5 days/week", multiplier: 1.55 },
  { value: "active", label: "Very active", description: "Hard exercise 6–7 days/week", multiplier: 1.725 },
  { value: "very_active", label: "Extra active", description: "Physical job or 2x training", multiplier: 1.9 },
];

export interface PaceOption {
  value: number; // kg per week
  label: string; // metric label
  labelImperial: string; // lb per week label
}

export const PACE_OPTIONS: PaceOption[] = [
  { value: 0.25, label: "0.25 kg / week", labelImperial: "0.55 lb / week" },
  { value: 0.5, label: "0.5 kg / week", labelImperial: "1.1 lb / week" },
  { value: 1.0, label: "1 kg / week", labelImperial: "2.2 lb / week" },
];

// FAQ shared between the calculator UI and the FAQPage JSON-LD in the
// /calorie-calculator route. Lives here (not in the client component) so the
// server page can import it as plain data.
export const CALORIE_FAQ: { q: string; a: string }[] = [
  {
    q: "How accurate is this calorie calculator?",
    a: "It uses the Mifflin-St Jeor equation, one of the most accurate formulas for estimating basal metabolic rate. Real needs vary with body composition, genetics, and activity, so treat the numbers as a starting point and adjust based on how your weight actually changes over 2–3 weeks.",
  },
  {
    q: "What is the difference between BMR and TDEE?",
    a: "BMR (basal metabolic rate) is the energy your body burns at complete rest just to stay alive. TDEE (total daily energy expenditure) is your BMR multiplied by an activity factor, representing everything you burn in a full day. Eating at your TDEE keeps your weight stable.",
  },
  {
    q: "How fast should I cut or bulk?",
    a: "A deficit or surplus of about 500 kcal/day changes your weight by roughly 0.5 kg (1.1 lb) per week. Faster cuts risk muscle loss and fatigue; faster bulks add more fat. Most people do best with 0.25–0.5 kg per week.",
  },
  {
    q: "Why is there a minimum calorie warning?",
    a: "Eating too little slows your metabolism and makes diets hard to sustain. We flag targets below 1,500 kcal for men and 1,200 kcal for women. If your plan falls below the floor, choose a slower pace or increase your activity instead.",
  },
];

// Energy density used to translate weight change into daily calories.
// ~7700 kcal per kg of body mass, spread across 7 days.
export const KCAL_PER_KG = 7700;

// Safety floors for minimum daily intake.
export const SAFETY_FLOOR_MALE = 1500;
export const SAFETY_FLOOR_FEMALE = 1200;

// ── Unit conversion helpers ──
export const LB_PER_KG = 2.20462;
export const CM_PER_IN = 2.54;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  // Handle rounding that pushes inches to 12
  if (inches === 12) return { feet: feet + 1, inches: 0 };
  return { feet, inches };
}

export function ftInToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

// ── Core formulas ──

/**
 * Mifflin-St Jeor Basal Metabolic Rate.
 * @param weightKg body weight in kilograms
 * @param heightCm height in centimeters
 * @param age years
 */
export function calculateBmr(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/** Total Daily Energy Expenditure = BMR × activity multiplier. */
export function calculateTdee(bmr: number, multiplier: number): number {
  return bmr * multiplier;
}

/** Daily calorie adjustment (kcal/day) for a given weekly weight-change pace. */
export function dailyAdjustmentForPace(paceKgPerWeek: number): number {
  return (paceKgPerWeek * KCAL_PER_KG) / 7;
}

export function safetyFloor(sex: Sex): number {
  return sex === "male" ? SAFETY_FLOOR_MALE : SAFETY_FLOOR_FEMALE;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  dailyAdjustment: number; // signed: negative for cut, positive for bulk, 0 for maintain
  // Goal-specific (undefined for maintain or when goal weight is missing/equal):
  weeksToGoal?: number;
  totalWeightChangeKg?: number; // signed: negative for loss, positive for gain
  goalDate?: Date;
  belowSafetyFloor: boolean;
  safetyFloorValue: number;
}

export interface CalorieInputs {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityMultiplier: number;
  goalMode: GoalMode;
  goalWeightKg?: number;
  paceKgPerWeek?: number;
  today?: Date; // injectable for testing
}

/**
 * Compute the full result set. Assumes inputs are already validated numbers.
 */
export function computeCalories(inputs: CalorieInputs): CalorieResult {
  const {
    sex,
    age,
    heightCm,
    weightKg,
    activityMultiplier,
    goalMode,
    goalWeightKg,
    paceKgPerWeek,
    today = new Date(),
  } = inputs;

  const bmr = calculateBmr(sex, weightKg, heightCm, age);
  const tdee = calculateTdee(bmr, activityMultiplier);
  const floor = safetyFloor(sex);

  if (goalMode === "maintain") {
    return {
      bmr,
      tdee,
      targetCalories: tdee,
      dailyAdjustment: 0,
      belowSafetyFloor: tdee < floor,
      safetyFloorValue: floor,
    };
  }

  const pace = paceKgPerWeek ?? PACE_OPTIONS[1].value;
  const adjustmentMagnitude = dailyAdjustmentForPace(pace);
  const sign = goalMode === "cut" ? -1 : 1;
  const dailyAdjustment = sign * adjustmentMagnitude;
  const targetCalories = tdee + dailyAdjustment;

  const result: CalorieResult = {
    bmr,
    tdee,
    targetCalories,
    dailyAdjustment,
    belowSafetyFloor: targetCalories < floor,
    safetyFloorValue: floor,
  };

  // Goal projections only when a valid, different goal weight is provided
  // that is consistent with the chosen direction.
  if (
    goalWeightKg !== undefined &&
    isFinite(goalWeightKg) &&
    goalWeightKg > 0 &&
    pace > 0 &&
    goalWeightKg !== weightKg
  ) {
    const diff = goalWeightKg - weightKg; // signed
    const directionOk = (goalMode === "cut" && diff < 0) || (goalMode === "bulk" && diff > 0);
    if (directionOk) {
      const weeks = Math.abs(diff) / pace;
      const goalDate = new Date(today.getTime());
      goalDate.setDate(goalDate.getDate() + Math.round(weeks * 7));
      result.weeksToGoal = weeks;
      result.totalWeightChangeKg = diff;
      result.goalDate = goalDate;
    }
  }

  return result;
}

// ── Formatting helpers ──

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatWeeks(weeks: number): string {
  if (!isFinite(weeks)) return "—";
  const rounded = Math.round(weeks * 10) / 10;
  const label = rounded === 1 ? "week" : "weeks";
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} ${label}`;
}
