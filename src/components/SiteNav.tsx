"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import {
  CALCULATORS,
  CATEGORIES,
  type CalculatorCategory,
  type CalculatorEntry,
} from "@/lib/calculators";

function entriesFor(category: CalculatorCategory): CalculatorEntry[] {
  return CALCULATORS.filter((calc) => calc.category === category);
}

/** One calculator row, shared by the desktop dropdowns and the mobile sheet.
 *  Coming-soon entries are inert text rather than links to nowhere. */
function MenuItem({ calc, onNavigate }: { calc: CalculatorEntry; onNavigate: () => void }) {
  if (calc.comingSoon) {
    return (
      <span className="site-nav-menu-item disabled" role="menuitem" aria-disabled="true">
        <span className="site-nav-menu-emoji">{calc.emoji}</span>
        <span>
          {calc.name}
          <span className="site-nav-menu-soon">Coming soon</span>
        </span>
      </span>
    );
  }
  return (
    <Link
      href={calc.href}
      className="site-nav-menu-item"
      role="menuitem"
      onClick={onNavigate}
    >
      <span className="site-nav-menu-emoji">{calc.emoji}</span>
      <span>{calc.name}</span>
    </Link>
  );
}

function CategoryMenu({
  label,
  entries,
  open,
  onToggle,
  onNavigate,
}: {
  label: string;
  entries: CalculatorEntry[];
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="site-nav-category">
      <button
        className="site-nav-dropdown-btn"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label} <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="site-nav-menu" role="menu" aria-label={label}>
          {entries.map((calc) => (
            <MenuItem key={calc.name} calc={calc} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteNav() {
  const { theme, toggle } = useTheme();
  // Only one dropdown may be open at a time, so this is a single id rather than
  // a boolean per category.
  const [openCategory, setOpenCategory] = useState<CalculatorCategory | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const anyOpen = openCategory !== null || mobileOpen;

  useEffect(() => {
    if (!anyOpen) return;

    function closeAll() {
      setOpenCategory(null);
      setMobileOpen(false);
    }
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeAll();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anyOpen]);

  function closeAll() {
    setOpenCategory(null);
    setMobileOpen(false);
  }

  return (
    <div className="site-nav" ref={navRef}>
      <div className="site-nav-left">
        <Link href="/" className="site-nav-brand" onClick={closeAll}>
          CalcSuite
        </Link>

        {/* Desktop: one dropdown per category. Hidden under 768px, where five
            of these would never fit. */}
        <div className="site-nav-categories">
          {CATEGORIES.map((category) => (
            <CategoryMenu
              key={category.id}
              label={category.label}
              entries={entriesFor(category.id)}
              open={openCategory === category.id}
              onToggle={() =>
                setOpenCategory((current) => (current === category.id ? null : category.id))
              }
              onNavigate={closeAll}
            />
          ))}
        </div>

        {/* Mobile: a single sheet listing every category. */}
        <div className="site-nav-mobile">
          <button
            className="site-nav-dropdown-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-haspopup="menu"
            aria-label="Calculators menu"
          >
            <span aria-hidden="true">☰</span> Calculators
          </button>
          {mobileOpen && (
            <div className="site-nav-menu site-nav-menu-sheet" role="menu">
              {CATEGORIES.map((category) => (
                <div key={category.id}>
                  <span className="site-nav-menu-header">{category.label}</span>
                  {entriesFor(category.id).map((calc) => (
                    <MenuItem key={calc.name} calc={calc} onNavigate={closeAll} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggle}
        className="landing-theme-btn"
        title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
