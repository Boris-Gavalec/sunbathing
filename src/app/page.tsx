"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

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
        <span className="landing-nav-brand">Sunbathing Calculator</span>
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

        <div className="landing-actions">
          <Link href="/calculator" className="btn-primary">
            Open Calculator
          </Link>
          <Link href="/calculator#how-it-works" className="btn-outline">
            How It Works
          </Link>
        </div>

        <div className="landing-grid">
          {cards.map((card) => (
            <div key={card.title} className="landing-card">
              <span className="landing-card-emoji">{card.emoji}</span>
              <h2 className="landing-card-title">{card.title}</h2>
              <p className="landing-card-desc">{card.description}</p>
            </div>
          ))}
        </div>

        <section className="landing-about">
          <h2 className="landing-about-title">What Is This?</h2>
          <p>
            Sunbathing Calculator is a free tool that helps you enjoy the sun safely. Too
            much UV exposure is the leading cause of sunburn and long-term skin damage, but
            most people have no idea how to calculate their personal limit. The answer
            depends on three things: your Fitzpatrick skin type (how much melanin your skin
            produces), the SPF of your sunscreen, and the UV index at your location right now.
          </p>
          <p>
            Our calculator combines all three into a single formula:{" "}
            <strong>max safe time = (skin type base × SPF) ÷ UV index</strong>. The skin type
            base ranges from 67 minutes for very fair skin (Type I) up to 233 minutes for
            deeply pigmented skin (Type VI). Apply SPF 50 sunscreen and that window grows
            significantly. A high UV index — like the extreme levels you find at noon in
            summer or at altitude — shrinks it fast. The tool fetches live UV data from
            Open-Meteo for your exact coordinates, so the result reflects what the sun is
            actually doing outside right now, not a generic average.
          </p>
          <p>
            The interactive UV chart shows the full arc of the day as a bell curve, highlights
            your planned session window, and updates in real time as you adjust your inputs.
            Whether you are planning a beach day, a hiking trip, or just a lunch break outside,
            you can dial in your skin type, sunscreen, start time, and session length and see
            immediately whether you are within safe limits.
          </p>

          <h2 className="landing-about-title">Coming Soon</h2>
          <p>
            We are building a full suite of sun and outdoor safety calculators. On the roadmap:
            a <strong>Vitamin D calculator</strong> that tells you the minimum sun exposure you
            need to meet your daily vitamin D synthesis target, a{" "}
            <strong>sunscreen reapplication timer</strong> that accounts for water activity and
            sweating, a <strong>UV forecast tool</strong> that maps safe exposure windows across
            the next 7 days, and an <strong>altitude UV booster</strong> that adjusts your limit
            for elevation (UV intensity rises roughly 10% for every 1,000 metres above sea level).
            All calculators will share the same skin-type and SPF inputs so you only have to enter
            your profile once.
          </p>
          <p>
            Our goal is to make sun safety information practical, not preachy — give you the
            numbers you need in seconds so you can get back to actually enjoying the outdoors.
          </p>
        </section>

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
