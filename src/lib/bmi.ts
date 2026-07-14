// Pure BMI logic. No React.

export type { UnitSystem } from "@/lib/calories";

export interface BmiCategory {
  label: string;
  min: number; // inclusive
  max: number; // exclusive (Infinity for the last band)
  color: string;
}

// WHO adult BMI classification.
export const BMI_CATEGORIES: BmiCategory[] = [
  { label: "Underweight", min: 0, max: 18.5, color: "#60a5fa" },
  { label: "Normal weight", min: 18.5, max: 25, color: "#4ade80" },
  { label: "Overweight", min: 25, max: 30, color: "#eab308" },
  { label: "Obesity class I", min: 30, max: 35, color: "#f97316" },
  { label: "Obesity class II", min: 35, max: 40, color: "#ef4444" },
  { label: "Obesity class III", min: 40, max: Infinity, color: "#b91c1c" },
];

// Healthy range bounds (WHO "normal weight" band). Kept in sync with the
// "Normal weight" entry in BMI_CATEGORIES ([18.5, 25)) so the healthy weight
// range always covers exactly the category a BMI is assigned to. 25 is the
// exclusive upper bound; it is displayed conventionally as "18.5–24.9".
export const HEALTHY_BMI_MIN = 18.5;
export const HEALTHY_BMI_MAX = 25;

// FAQ shared between the calculator UI and the FAQPage JSON-LD in the
// /bmi-calculator route.
export const BMI_FAQ: { q: string; a: string }[] = [
  {
    q: "What is BMI and how is it calculated?",
    a: "Body mass index (BMI) is your weight in kilograms divided by the square of your height in meters: BMI = kg / m². It is a quick screening tool that classifies adults as underweight, normal weight, overweight, or obese using the WHO cut-off points.",
  },
  {
    q: "What is a healthy BMI?",
    a: "For adults, the World Health Organization considers a BMI between 18.5 and 24.9 to be the normal (healthy) range. Below 18.5 is underweight, 25 to 29.9 is overweight, and 30 or above falls into the obesity classes.",
  },
  {
    q: "What are the limitations of BMI?",
    a: "BMI does not distinguish muscle from fat, so muscular athletes can be classified as overweight while people with low muscle mass can have a normal BMI despite excess body fat. It also doesn't account for age, sex, or fat distribution. Treat it as a screening starting point, not a diagnosis.",
  },
  {
    q: "What is BMI prime?",
    a: "BMI prime is your BMI divided by 25, the upper limit of the normal range. A BMI prime below 1.0 means you are within or under the normal range; above 1.0 shows how far over the limit you are (for example, 1.10 is 10% over).",
  },
  {
    q: "What is the ponderal index?",
    a: "The ponderal index (PI) is weight divided by height cubed (kg / m³). Because it cubes height rather than squaring it, it gives more reliable readings for very tall or very short people. A typical healthy PI is roughly 11 to 15.",
  },
];

/** BMI = weight (kg) / height (m)². */
export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function categoryForBmi(bmi: number): BmiCategory {
  return (
    BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ??
    BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
  );
}

/** Weight range (kg) that keeps BMI within the WHO normal band. */
export function healthyWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  return {
    minKg: HEALTHY_BMI_MIN * heightM * heightM,
    maxKg: HEALTHY_BMI_MAX * heightM * heightM,
  };
}

/** BMI prime = BMI / 25 (ratio to the upper normal limit). */
export function bmiPrime(bmi: number): number {
  return bmi / 25;
}

/** Ponderal index = weight (kg) / height (m)³. */
export function ponderalIndex(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM * heightM);
}

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  healthyRange: { minKg: number; maxKg: number };
  bmiPrime: number;
  ponderalIndex: number;
}

/** Compute the full result set. Assumes inputs are already validated numbers. */
export function computeBmi(weightKg: number, heightCm: number): BmiResult {
  const bmi = calculateBmi(weightKg, heightCm);
  return {
    bmi,
    category: categoryForBmi(bmi),
    healthyRange: healthyWeightRange(heightCm),
    bmiPrime: bmiPrime(bmi),
    ponderalIndex: ponderalIndex(weightKg, heightCm),
  };
}
