// Pure hydration-target logic. No React.
// Weight conversion helpers are reused from @/lib/calories.

export type Climate = "temperate" | "hot";

/** Millilitres per kilogram of body weight per day. The commonly cited range is
 *  30-35 ml/kg for healthy adults; 33 sits in the middle. */
export const ML_PER_KG = 33;

/** Extra fluid per 30 minutes of exercise. Sports guidance typically suggests
 *  350-500 ml; 350 is the conservative end. */
export const ML_PER_30MIN_EXERCISE = 350;

/** Hot climates raise baseline needs by roughly this share. */
export const HOT_CLIMATE_UPLIFT = 0.15;

/** A US cup, for the friendlier "glasses of water" figure. */
export const ML_PER_CUP = 240;
export const ML_PER_FL_OZ = 29.5735;

export interface WaterResult {
  baseMl: number;
  exerciseMl: number;
  climateMl: number;
  totalMl: number;
  liters: number;
  cups: number;
  flOz: number;
}

/** Assumes weightKg > 0 and exerciseMinutes >= 0. */
export function computeWaterIntake(
  weightKg: number,
  exerciseMinutes: number,
  climate: Climate
): WaterResult {
  const baseMl = weightKg * ML_PER_KG;
  const exerciseMl = (exerciseMinutes / 30) * ML_PER_30MIN_EXERCISE;
  // The uplift applies to the baseline only — exercise fluid is already
  // accounted for separately and shouldn't be inflated twice.
  const climateMl = climate === "hot" ? baseMl * HOT_CLIMATE_UPLIFT : 0;
  const totalMl = baseMl + exerciseMl + climateMl;

  return {
    baseMl,
    exerciseMl,
    climateMl,
    totalMl,
    liters: totalMl / 1000,
    cups: totalMl / ML_PER_CUP,
    flOz: totalMl / ML_PER_FL_OZ,
  };
}

export const WATER_FAQ: { q: string; a: string }[] = [
  {
    q: "How much water should I drink a day?",
    a: "A common guideline for healthy adults is 30-35 ml of fluid per kilogram of body weight per day, which this calculator applies at 33 ml/kg. For an 80 kg person that is roughly 2.6 litres. Exercise, heat, illness and pregnancy all push the figure up, so treat it as a starting point rather than a precise prescription.",
  },
  {
    q: "Is the '8 glasses a day' rule true?",
    a: "It is a rough approximation with no strong scientific basis. Eight 240 ml glasses is about 1.9 litres, which is in the right ballpark for an average adult but ignores body size and activity entirely. A 55 kg desk worker and a 95 kg runner have very different needs — scaling by weight is a better starting point.",
  },
  {
    q: "Does coffee, tea or food count towards my intake?",
    a: "Yes. Tea and coffee are mostly water and count towards your total despite their mild diuretic effect. Food typically contributes around 20% of daily fluid intake, more if you eat a lot of fruit, vegetables and soup. The target here is total fluid, not water drunk from a glass.",
  },
  {
    q: "How much extra should I drink when exercising?",
    a: "Roughly 350-500 ml for every 30 minutes of exercise, which this calculator adds at 350 ml per 30 minutes. Actual sweat losses vary widely with intensity, heat and individual physiology — endurance athletes often weigh themselves before and after training, since each kilogram lost is about a litre of fluid to replace.",
  },
  {
    q: "Can I drink too much water?",
    a: "Yes, though it is rare. Drinking far more than your kidneys can excrete dilutes blood sodium, a condition called hyponatraemia, which is dangerous and occasionally fatal. It mostly affects endurance athletes who overdrink during long events. Spreading intake through the day rather than forcing large volumes at once avoids it.",
  },
  {
    q: "How do I know if I'm properly hydrated?",
    a: "Urine colour is the simplest everyday check: pale straw suggests you are well hydrated, while dark amber suggests you need more. Thirst is a reasonable guide for most healthy adults, though it becomes less reliable with age. Any calculated target is an estimate — your body's signals are the better feedback.",
  },
];
