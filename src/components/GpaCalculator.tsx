"use client";

import { useState, useMemo, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import {
  GRADES,
  COURSE_TYPES,
  GPA_FAQ,
  computeGpa,
  combineCumulative,
  formatGpa,
  type Course,
  type CourseType,
} from "@/lib/gpa";

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

interface CourseRow {
  id: string;
  name: string;
  creditsStr: string;
  grade: string; // "" = not selected
  type: CourseType;
}

export default function GpaCalculator() {
  const nextId = useRef(4);
  const [rows, setRows] = useState<CourseRow[]>([
    { id: "0", name: "", creditsStr: "3", grade: "", type: "regular" },
    { id: "1", name: "", creditsStr: "3", grade: "", type: "regular" },
    { id: "2", name: "", creditsStr: "3", grade: "", type: "regular" },
    { id: "3", name: "", creditsStr: "3", grade: "", type: "regular" },
  ]);
  const [weighted, setWeighted] = useState(false);
  const [cumulative, setCumulative] = useState(false);
  const [priorGpaStr, setPriorGpaStr] = useState("");
  const [priorCreditsStr, setPriorCreditsStr] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function updateRow(id: string, patch: Partial<CourseRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: String(nextId.current++), name: "", creditsStr: "3", grade: "", type: "regular" },
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const result = useMemo(() => {
    const courses: Course[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      credits: num(r.creditsStr),
      grade: r.grade === "" ? null : r.grade,
      type: r.type,
    }));
    return computeGpa(courses, weighted);
  }, [rows, weighted]);

  const cumulativeResult = useMemo(() => {
    if (!cumulative) return null;
    const priorGpa = num(priorGpaStr);
    const priorCredits = num(priorCreditsStr);
    if (priorGpa === null || priorCredits === null || priorGpa < 0 || priorCredits < 0) return null;
    return combineCumulative(priorGpa, priorCredits, result.qualityPoints, result.totalCredits);
  }, [cumulative, priorGpaStr, priorCreditsStr, result]);

  const options = (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Options</h2>
      </div>

      {/* Weighted toggle */}
      <div>
        <FieldLabel>Grading scale</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {[false, true].map((w) => (
            <button
              key={String(w)}
              onClick={() => setWeighted(w)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: weighted === w ? "var(--accent)" : "var(--quick-start-bg)",
                color: weighted === w ? "#fff" : "var(--text-secondary)",
                border: weighted === w ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {w ? "Weighted" : "Unweighted"}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-2" style={{ color: "var(--text-secondary)" }}>
          Weighted adds +0.5 for Honors and +1.0 for AP/IB courses.
        </p>
      </div>

      {/* Cumulative toggle */}
      <div>
        <FieldLabel>Cumulative GPA</FieldLabel>
        <div className="flex gap-1.5 mt-2">
          {[false, true].map((c) => (
            <button
              key={String(c)}
              onClick={() => setCumulative(c)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: cumulative === c ? "var(--accent)" : "var(--quick-start-bg)",
                color: cumulative === c ? "#fff" : "var(--text-secondary)",
                border: cumulative === c ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {c ? "Include prior" : "This semester"}
            </button>
          ))}
        </div>
      </div>

      {cumulative && (
        <>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>Prior GPA</FieldLabel>
              <span className="text-[11px] text-secondary">0.0–5.0</span>
            </div>
            <input
              type="number"
              min={0}
              max={5}
              step={0.01}
              aria-label="Prior cumulative GPA"
              value={priorGpaStr}
              onChange={(e) => setPriorGpaStr(e.target.value)}
              placeholder="e.g. 3.50"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>Prior credits</FieldLabel>
              <span className="text-[11px] text-secondary">completed</span>
            </div>
            <input
              type="number"
              min={0}
              aria-label="Prior credits completed"
              value={priorCreditsStr}
              onChange={(e) => setPriorCreditsStr(e.target.value)}
              placeholder="e.g. 60"
              className="w-full px-3 py-2 rounded-md text-sm font-mono input-muted"
            />
          </div>
        </>
      )}
    </div>
  );

  const courseList = (
    <div className="rounded-xl p-4 sm:p-5 bg-card card-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Courses</h2>
        <button
          onClick={addRow}
          className="px-3 h-8 rounded-md text-xs font-bold transition-all"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          + Add course
        </button>
      </div>

      <div className="space-y-2">
        {rows.length === 0 && (
          <p className="text-sm py-2" style={{ color: "var(--text-secondary)" }}>
            No courses yet — add one to get started.
          </p>
        )}
        {rows.map((row, i) => (
          <div key={row.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input
              type="text"
              aria-label={`Course ${i + 1} name`}
              value={row.name}
              onChange={(e) => updateRow(row.id, { name: e.target.value })}
              placeholder={`Course ${i + 1} (optional)`}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-md text-sm input-muted"
            />
            <input
              type="number"
              min={0}
              max={20}
              step={0.5}
              aria-label={`Course ${i + 1} credits`}
              value={row.creditsStr}
              onChange={(e) => updateRow(row.id, { creditsStr: e.target.value })}
              placeholder="Cr"
              title="Credits"
              className="w-16 px-2 py-2 rounded-md text-sm font-mono input-muted"
            />
            <select
              aria-label={`Course ${i + 1} grade`}
              value={row.grade}
              onChange={(e) => updateRow(row.id, { grade: e.target.value })}
              className="w-20 px-2 py-2 rounded-md text-sm input-muted"
            >
              <option value="">Grade</option>
              {GRADES.map((g) => (
                <option key={g.letter} value={g.letter}>
                  {g.letter}
                </option>
              ))}
            </select>
            {weighted && (
              <select
                aria-label={`Course ${i + 1} type`}
                value={row.type}
                onChange={(e) => updateRow(row.id, { type: e.target.value as CourseType })}
                className="w-24 px-2 py-2 rounded-md text-sm input-muted"
              >
                {COURSE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => removeRow(row.id)}
              aria-label={`Remove course ${i + 1}`}
              title="Remove course"
              className="w-8 h-8 shrink-0 rounded-md text-sm font-bold transition-all"
              style={{
                background: "var(--quick-start-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--card-border)",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const results = (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        className="rounded-xl px-5 py-4 col-span-2 lg:col-span-1"
        style={{ background: "var(--accent-card-bg)", border: "1px solid var(--accent-card-border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">
          {weighted ? "Weighted GPA" : "Semester GPA"}
        </p>
        <p className="text-4xl font-bold font-mono tracking-tight text-accent">{formatGpa(result.gpa)}</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {result.gpa === null
            ? "select grades to calculate"
            : `across ${result.courseCount} course${result.courseCount === 1 ? "" : "s"}`}
        </p>
      </div>

      <StatCard label="Total credits" value={result.totalCredits > 0 ? String(result.totalCredits) : "—"} sub="counted this semester" />
      <StatCard
        label="Quality points"
        value={result.totalCredits > 0 ? (Math.round(result.qualityPoints * 100) / 100).toString() : "—"}
        sub="grade points × credits"
      />
      {cumulative ? (
        <StatCard
          label="Cumulative GPA"
          value={formatGpa(cumulativeResult)}
          sub={cumulativeResult === null ? "enter prior GPA & credits" : "including prior semesters"}
        />
      ) : (
        <StatCard label="Scale" value={weighted ? "5.0" : "4.0"} sub={weighted ? "weighted maximum" : "standard US scale"} />
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 shrink-0 flex items-center justify-center text-sm">
              🎓
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">GPA Calculator</h1>
              <p className="text-xs text-secondary hidden sm:block">
                Semester and cumulative GPA on the 4.0 scale, weighted or unweighted
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: collapsible options */}
      <div className="lg:hidden border-b border-card bg-card">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          <span>Options</span>
          <span style={{ color: "var(--text-secondary)" }}>{sidebarOpen ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {sidebarOpen && <div className="p-4 border-t border-card">{options}</div>}
      </div>

      <main className="flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-[300px] shrink-0 border-r p-5 overflow-y-auto border-card bg-card">
          {options}
        </aside>

        <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto">
          {results}
          {courseList}

          {/* Educational / SEO content */}
          <section className="rounded-xl p-4 sm:p-6 bg-card card-border text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              How the GPA Calculator Works
            </h2>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              The formula
            </h3>
            <p className="mb-3">
              Every letter grade maps to grade points on the standard US 4.0 scale — A = 4.0, B = 3.0,
              C = 2.0, D = 1.0, F = 0, with plus/minus steps of 0.3 in between. Each course contributes
              its grade points multiplied by its credit hours (its <em>quality points</em>), and your
              GPA is <strong>total quality points ÷ total credits</strong>. A 3-credit A and a 4-credit
              B therefore give (4.0×3 + 3.0×4) ÷ 7 = 3.43.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Weighted grades
            </h3>
            <p className="mb-3">
              Many high schools reward harder courses with bonus points: +0.5 for Honors and +1.0 for AP
              or IB classes, so an A in AP Calculus counts as 5.0 instead of 4.0. Switch to the weighted
              scale and tag each course to see this. Failing grades never receive a bonus, and colleges
              usually recalculate an unweighted GPA anyway — so check both numbers.
            </p>

            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              Cumulative GPA
            </h3>
            <p className="mb-3">
              Your cumulative GPA combines all semesters, weighted by credits. Enable the cumulative
              option and enter your prior GPA and total completed credits; the calculator merges this
              semester in using credit weighting, so a heavy semester moves your cumulative GPA more
              than a light one.
            </p>

            <h2 className="text-lg font-bold mt-8 mb-4" style={{ color: "var(--foreground)" }}>
              Frequently asked questions
            </h2>
            {GPA_FAQ.map((item) => (
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
              Grading scales and weighting policies vary between schools — always confirm how your
              institution calculates GPA. This tool uses the most common US conventions.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
