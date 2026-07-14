import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";

export const metadata: Metadata = {
  title: { absolute: "CalcSuite — Free Online Calculators" },
  description:
    "Free, fast online calculators for health and education — safe sun exposure, daily calories, BMI, and GPA. No sign-up, no fluff, just answers.",
  alternates: {
    canonical: "https://calcsuite.app",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CalcSuite Calculators",
  itemListElement: CALCULATORS.filter((c) => !c.comingSoon).map((calc, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: calc.name,
    url: `https://calcsuite.app${calc.href}`,
  })),
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <nav className="landing-nav">
        <SiteNav />
      </nav>

      <main className="landing-main">
        <h1 className="landing-title">CalcSuite</h1>
        <p className="landing-subtitle">
          Free, fast online calculators for health and education — safe sun
          exposure, daily calories, BMI, and GPA. No sign-up, no fluff, just
          answers.
        </p>

        <div className="landing-actions">
          <a href="#calculators" className="btn-primary">
            Browse Calculators
          </a>
          <Link href="/calculator#how-it-works" className="btn-outline">
            How It Works
          </Link>
        </div>

        <div id="calculators">
          {CATEGORIES.map((category) => (
            <section key={category.id} aria-label={category.label}>
              <h2 className="landing-section-title">{category.label}</h2>
              <div className="landing-grid">
                {CALCULATORS.filter((calc) => calc.category === category.id).map((calc) =>
                  calc.comingSoon ? (
                    <div key={calc.name} className="landing-card landing-card-soon">
                      <span className="landing-card-emoji">{calc.emoji}</span>
                      <h3 className="landing-card-title">
                        {calc.name}
                        <span className="landing-card-badge">Work in progress</span>
                      </h3>
                      <p className="landing-card-desc">{calc.description}</p>
                    </div>
                  ) : (
                    <Link
                      key={calc.name}
                      href={calc.href}
                      className="landing-card landing-card-link"
                    >
                      <span className="landing-card-emoji">{calc.emoji}</span>
                      <h3 className="landing-card-title">{calc.name}</h3>
                      <p className="landing-card-desc">{calc.description}</p>
                    </Link>
                  )
                )}
              </div>
            </section>
          ))}
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
          <p>
            The <strong>BMI Calculator</strong> computes your body mass index —{" "}
            <strong>BMI = weight (kg) ÷ height (m)²</strong> — and places it in
            the WHO weight categories, from underweight to the obesity classes.
            It also shows the healthy weight range for your height plus extras
            like BMI prime and the ponderal index, in metric or imperial units.
          </p>
          <p>
            The <strong>GPA Calculator</strong> turns your letter grades and
            credit hours into a grade point average on the standard US 4.0 scale
            — <strong>GPA = Σ(grade points × credits) ÷ Σ credits</strong>. It
            supports weighted honors and AP/IB grades and can merge this
            semester with your prior GPA for a credit-weighted cumulative
            result.
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
          {CALCULATORS.filter((c) => !c.comingSoon).map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              style={{ color: "var(--accent)" }}
              className="hover:underline"
            >
              {calc.name}
            </Link>
          ))}
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
