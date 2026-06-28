"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

// Page title / description are set in layout.tsx root metadata

const cards = [
  {
    emoji: "🍩",
    title: "Morning Glow",
    description:
      "The best time to catch gentle rays is between 7–10 AM. Lower UV, warmer light, and a peaceful start to your day.",
  },
  {
    emoji: "🌻",
    title: "UV Index",
    description:
      "Always check the UV index before heading out. Aim for moderate levels (3–5) and use SPF 30+ for longer sessions.",
  },
  {
    emoji: "💧",
    title: "Stay Hydrated",
    description:
      "Drink plenty of water before, during, and after sun exposure. Your skin and body will thank you.",
  },
  {
    emoji: "🍴",
    title: "Golden Hour",
    description:
      "Late afternoon sun (4–6 PM) offers beautiful warm light with reduced UV intensity. Perfect for relaxing outdoors.",
  },
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-nav-brand">Sunbathing</span>
        <button
          onClick={toggle}
          className="landing-theme-btn"
          title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>

      <main className="landing-main">
        <h1 className="landing-title">Sunbathing Calculator</h1>
        <p className="landing-subtitle">
          Find out exactly how long you can safely stay in the sun based on your
          skin type, SPF sunscreen, and real-time UV index — in under 10 seconds.
        </p>

        <div className="landing-grid">
          {cards.map((card) => (
            <div key={card.title} className="landing-card">
              <span className="landing-card-emoji">{card.emoji}</span>
              <h2 className="landing-card-title">{card.title}</h2>
              <p className="landing-card-desc">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="landing-actions">
          <Link href="/calculator" className="btn-primary">
            Open Calculator
          </Link>
          <Link href="/calculator#how-it-works" className="btn-outline">
            How It Works
          </Link>
        </div>

        <nav aria-label="Site links" className="mt-8 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          <Link href="/calculator" style={{ color: "var(--accent)" }} className="hover:underline">
            Calculator
          </Link>
          <Link href="/calculator#how-it-works" style={{ color: "var(--accent)" }} className="hover:underline">
            How It Works
          </Link>
          <Link href="/calculator#faq" style={{ color: "var(--accent)" }} className="hover:underline">
            FAQ
          </Link>
        </nav>
      </main>

      <footer className="landing-footer">
        <hr className="landing-hr" />
        <p>Enjoy the sunshine responsibly.</p>
      </footer>
    </div>
  );
}
