import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";

const LIVE_CALCULATORS = CALCULATORS.filter((calc) => !calc.comingSoon);

export const metadata: Metadata = {
  title: { absolute: "CalcSuite: Free Online Calculators for Health, Money & More" },
  description:
    "Free, fast online calculators for health, money, study and everyday maths, covering BMI, calories, loans, mortgages, percentages, and dates. No sign-up, just answers.",
  alternates: {
    canonical: "https://calcsuite.app",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CalcSuite",
  url: "https://calcsuite.app",
  description:
    "Free, fast online calculators for health, money, study and everyday maths.",
  publisher: {
    "@type": "Organization",
    name: "CalcSuite",
    url: "https://calcsuite.app",
    logo: "https://calcsuite.app/opengraph-image",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CalcSuite Calculators",
  itemListElement: LIVE_CALCULATORS.map((calc, i) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <nav className="landing-nav">
        <SiteNav />
      </nav>

      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="landing-title">Calculators that just give you the answer</h1>
          <p className="landing-subtitle">
            Free, fast online calculators for health, money, study and everyday
            maths. Every tool shows the formula behind the result. No sign-up,
            no fluff, no black boxes.
          </p>

          {/* Counts are derived from the registry so they can't drift as
              calculators are added. */}
          <ul className="landing-stats">
            <li>
              <strong>{LIVE_CALCULATORS.length}</strong> calculators
            </li>
            <li>
              <strong>{CATEGORIES.length}</strong> categories
            </li>
            <li>
              <strong>100%</strong> free
            </li>
            <li>
              <strong>No</strong> login required
            </li>
          </ul>

          <div className="landing-actions">
            <a href="#calculators" className="btn-primary">
              Browse Calculators
            </a>
            <Link href="/calculator#how-it-works" className="btn-outline">
              How It Works
            </Link>
          </div>
        </div>

        <div id="calculators">
          {CATEGORIES.filter((category) =>
            CALCULATORS.some((calc) => calc.category === category.id),
          ).map((category) => (
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
            account. You enter your numbers and get a clear answer in seconds.
            Each calculator is backed by a transparent formula so you can see
            exactly how the result was reached, not just a black-box number.
          </p>

          <h2 className="landing-about-title">Health &amp; Fitness</h2>
          <p>
            The <strong>Sunbathing Calculator</strong> tells you how long you can
            safely stay in the sun. It combines your Fitzpatrick skin type, the
            SPF of your sunscreen, and the current UV index into a single
            formula, <strong>max safe time = (skin type base × SPF) ÷ UV index</strong>,
            and pulls live UV data from Open-Meteo for your exact location so
            the result reflects what the sun is actually doing right now.
          </p>
          <p>
            The <strong>Calorie Calculator</strong> finds your daily calorie
            needs using the Mifflin-St Jeor equation, then scales it by your
            activity level to get your total daily energy expenditure. The{" "}
            <strong>BMI Calculator</strong> computes body mass index (
            <strong>kg ÷ m²</strong>) and places it in the WHO weight categories.
            Alongside them, the <strong>Water Intake Calculator</strong> sets a
            daily hydration target from your weight and activity, and the{" "}
            <strong>Pace Calculator</strong> converts between running pace,
            speed, time and distance.
          </p>

          <h2 className="landing-about-title">Money</h2>
          <p>
            The <strong>Loan Calculator</strong> and{" "}
            <strong>Mortgage Calculator</strong> both use the standard
            amortisation formula to turn a principal, an interest rate and a term
            into a monthly payment. The mortgage version adds property tax,
            insurance and PMI for a true monthly outlay.
          </p>

          <h2 className="landing-about-title">Study &amp; Everyday</h2>
          <p>
            The <strong>GPA Calculator</strong> turns your letter grades and
            credit hours into a grade point average on the standard US 4.0 scale,{" "}
            <strong>GPA = Σ(grade points × credits) ÷ Σ credits</strong>, with
            weighted honors and AP/IB support. The{" "}
            <strong>Date Difference Calculator</strong> does calendar-correct
            date maths, using real month lengths and leap years rather than
            30-day approximations.
          </p>

          <h2 className="landing-about-title">Coming Soon / Roadmap</h2>
          <p>
            Four tools are in progress. A <strong>Body Fat Calculator</strong>{" "}
            will estimate body fat percentage from simple tape measurements, a{" "}
            <strong>Vitamin D Calculator</strong> will work out the minimum sun
            exposure needed to hit your daily synthesis target, and a{" "}
            <strong>Sunscreen Timer</strong> will tell you when to reapply,
            accounting for water and sweat. For students,{" "}
            <strong>Flashcards</strong> will turn your notes into a study deck.
            Our goal is simple: give you the numbers you need in seconds so you
            can get on with your day.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
