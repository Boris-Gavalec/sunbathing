// Pure GPA logic. No React.

export interface GradeOption {
  letter: string;
  points: number;
}

// Standard US 4.0 scale. A+ is capped at 4.0 (the most common convention).
export const GRADES: GradeOption[] = [
  { letter: "A+", points: 4.0 },
  { letter: "A", points: 4.0 },
  { letter: "A−", points: 3.7 },
  { letter: "B+", points: 3.3 },
  { letter: "B", points: 3.0 },
  { letter: "B−", points: 2.7 },
  { letter: "C+", points: 2.3 },
  { letter: "C", points: 2.0 },
  { letter: "C−", points: 1.7 },
  { letter: "D+", points: 1.3 },
  { letter: "D", points: 1.0 },
  { letter: "D−", points: 0.7 },
  { letter: "F", points: 0.0 },
];

export type CourseType = "regular" | "honors" | "ap";

export const COURSE_TYPES: { value: CourseType; label: string; bonus: number }[] = [
  { value: "regular", label: "Regular", bonus: 0 },
  { value: "honors", label: "Honors", bonus: 0.5 },
  { value: "ap", label: "AP / IB", bonus: 1.0 },
];

export interface Course {
  id: string;
  name: string;
  credits: number | null;
  grade: string | null; // letter, null = not selected
  type: CourseType;
}

// FAQ shared between the calculator UI and the FAQPage JSON-LD in the
// /gpa-calculator route.
export const GPA_FAQ: { q: string; a: string }[] = [
  {
    q: "How is GPA calculated?",
    a: "Each letter grade maps to grade points on the 4.0 scale (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0). Multiply each course's grade points by its credits to get quality points, add them up, and divide by the total credits: GPA = Σ(grade points × credits) ÷ Σ credits.",
  },
  {
    q: "What is the difference between weighted and unweighted GPA?",
    a: "An unweighted GPA treats every course the same on the 4.0 scale. A weighted GPA adds a bonus for harder courses — typically +0.5 for honors and +1.0 for AP or IB — so an A in an AP class counts as 5.0. Weighted GPAs can therefore exceed 4.0. Failing grades receive no bonus.",
  },
  {
    q: "How do I calculate my cumulative GPA?",
    a: "Combine your previous GPA with this semester using credit weighting: multiply your prior GPA by your prior credits, add this semester's quality points, and divide by the combined total credits. Enable the cumulative option in this calculator and enter your prior GPA and credits to see it automatically.",
  },
  {
    q: "What is a good GPA?",
    a: "It depends on context. Nationally, the average high school GPA is around 3.0. Many universities expect 3.5+ for competitive admissions, and 3.7+ (mostly A grades) is considered excellent. For college students, staying above 3.0 keeps most scholarship and graduate school options open.",
  },
  {
    q: "Do pass/fail courses affect GPA?",
    a: "Usually not. Most schools exclude pass/fail (credit/no-credit) courses from the GPA calculation — you earn the credits, but no grade points. Leave such courses out of this calculator, or check your school's policy since some count a fail as an F.",
  },
];

export function gradePoints(letter: string): number | null {
  const grade = GRADES.find((g) => g.letter === letter);
  return grade ? grade.points : null;
}

/** Grade points including the weighted bonus. F never receives a bonus. */
export function weightedPoints(letter: string, type: CourseType, weighted: boolean): number | null {
  const base = gradePoints(letter);
  if (base === null) return null;
  if (!weighted || base === 0) return base;
  const bonus = COURSE_TYPES.find((t) => t.value === type)?.bonus ?? 0;
  return base + bonus;
}

export interface GpaResult {
  gpa: number | null; // null when no valid courses (avoids NaN)
  totalCredits: number;
  qualityPoints: number;
  courseCount: number; // courses that actually counted
}

/**
 * Semester GPA over courses that have both a grade and positive credits.
 * Rows without a grade or credits are simply ignored.
 */
export function computeGpa(courses: Course[], weighted: boolean): GpaResult {
  let totalCredits = 0;
  let qualityPoints = 0;
  let courseCount = 0;

  for (const course of courses) {
    if (course.grade === null || course.credits === null || course.credits <= 0) continue;
    const points = weightedPoints(course.grade, course.type, weighted);
    if (points === null) continue;
    totalCredits += course.credits;
    qualityPoints += points * course.credits;
    courseCount += 1;
  }

  return {
    gpa: totalCredits > 0 ? qualityPoints / totalCredits : null,
    totalCredits,
    qualityPoints,
    courseCount,
  };
}

/** Credit-weighted combination of a prior GPA with this semester's result. */
export function combineCumulative(
  priorGpa: number,
  priorCredits: number,
  semesterQualityPoints: number,
  semesterCredits: number
): number | null {
  const totalCredits = priorCredits + semesterCredits;
  if (totalCredits <= 0) return null;
  return (priorGpa * priorCredits + semesterQualityPoints) / totalCredits;
}

export function formatGpa(gpa: number | null): string {
  if (gpa === null || !isFinite(gpa)) return "—";
  return gpa.toFixed(2);
}
