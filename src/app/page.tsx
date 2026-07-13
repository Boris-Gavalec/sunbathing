"use client";

import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { CALCULATORS } from "@/lib/calculators";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <SiteNav />
      </nav>

      <main className="landing-main">
        <h1 className="landing-title">CalcSuite</h1>
        <p className="landing-subtitle">
          Free, fast online calculators — from safe sun exposure to daily
          calorie targets. No sign-up, no fluff, just answers.
        </p>

        <div className="landing-grid">
          {CALCULATORS.map((calc) =>
            calc.comingSoon ? (
              <div key={calc.name} className="landing-card landing-card-soon">
                <span className="landing-card-emoji">{calc.emoji}</span>
                <h2 className="landing-card-title">
                  {calc.name}
                  <span className="landing-card-badge">Work in progress</span>
                </h2>
                <p className="landing-card-desc">{calc.description}</p>
              </div>
            ) : (
              <Link
                key={calc.name}
                href={calc.href}
                className="landing-card landing-card-link"
              >
                <span className="landing-card-emoji">{calc.emoji}</span>
                <h2 className="landing-card-title">{calc.name}</h2>
                <p className="landing-card-desc">{calc.description}</p>
              </Link>
            )
          )}
        </div>

        <div className="landing-actions">
          <Link href="/calculator" className="btn-primary">
            Try the Sunbathing Calculator
          </Link>
          <Link href="/calorie-calculator" className="btn-outline">
            Calorie Calculator
          </Link>
        </div>

        <section className="landing-about">
          <h2 className="landing-about-title">What is CalcSuite?</h2>
          <p>
            CalcSuite is a growing collection of free, no-nonsense online
            calculators. Every tool is fast, works on any device, and needs no
            account — you enter your numbers and get a clear answer in seconds.
            Each calculator is backed by a transparent formula so you can see
            exactly how the result was reached, not just a black-box number.
          </p>
          <p>
            The <strong>Sunbathing Calculator</strong> tells you how long you can
            safely stay in the sun. It combines your Fitzpatrick skin type, the
            SPF of your sunscreen, and the current UV index into a single formula
            — <strong>max safe time = (skin type base × SPF) ÷ UV index</strong>{" "}
            — and pulls live UV data from Open-Meteo for your exact location so
            the result reflects what the sun is actually doing right now.
          </p>
          <p>
            The <strong>Calorie Calculator</strong> finds your daily calorie
            needs using the Mifflin-St Jeor equation to estimate your basal
            metabolic rate (BMR), then scales it by your activity level to get
            your total daily energy expenditure (TDEE). Planning a cut or a bulk?
            Enter a goal weight and it maps out your target intake and projects
            the date you will reach it.
          </p>

          <h2 className="landing-about-title">Coming Soon / Roadmap</h2>
          <p>
            A <strong>Body Fat Calculator</strong> that estimates your body fat
            percentage from simple tape measurements is currently a work in
            progress. Further out on the roadmap: a{" "}
            <strong>vitamin D calculator</strong> for the minimum sun exposure
            you need to hit your daily synthesis target, a{" "}
            <strong>sunscreen reapplication timer</strong> that accounts for
            water and sweat, and more everyday tools. Our goal is simple — give
            you the numbers you need in seconds so you can get on with your day.
          </p>
        </section>

        <nav
          aria-label="Site links"
          className="mt-8 flex flex-wrap gap-4 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <Link href="/calculator" style={{ color: "var(--accent)" }} className="hover:underline">
            Sunbathing Calculator
          </Link>
          <Link href="/calorie-calculator" style={{ color: "var(--accent)" }} className="hover:underline">
            Calorie Calculator
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
        <p>Free online calculators. No sign-up required.</p>
      </footer>
    </div>
  );
}
