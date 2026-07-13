"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { CALCULATORS } from "@/lib/calculators";

export default function SiteNav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="site-nav">
      <div className="site-nav-left">
        <Link href="/" className="site-nav-brand">
          CalcSuite
        </Link>

        <div className="site-nav-dropdown" ref={menuRef}>
          <button
            className="site-nav-dropdown-btn"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            Calculators <span aria-hidden="true">{open ? "▴" : "▾"}</span>
          </button>

          {open && (
            <div className="site-nav-menu" role="menu">
              {CALCULATORS.map((calc) =>
                calc.comingSoon ? (
                  <span key={calc.name} className="site-nav-menu-item disabled" role="menuitem" aria-disabled="true">
                    <span className="site-nav-menu-emoji">{calc.emoji}</span>
                    <span>
                      {calc.name}
                      <span className="site-nav-menu-soon">Coming soon</span>
                    </span>
                  </span>
                ) : (
                  <Link
                    key={calc.name}
                    href={calc.href}
                    className="site-nav-menu-item"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <span className="site-nav-menu-emoji">{calc.emoji}</span>
                    <span>{calc.name}</span>
                  </Link>
                )
              )}
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
