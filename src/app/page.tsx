import Link from "next/link";

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
  return (
    <div className="landing-page">
      <style>{`
        body { background: #f0f4f8 !important; }
      `}</style>
      <main className="landing-main">
        <h1 className="landing-title">Sunbathing</h1>
        <p className="landing-subtitle">
          Your guide to soaking up the sun safely and making the most of every
          golden hour.
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
            Start Your Session
          </Link>
          <Link href="/calculator" className="btn-outline">
            Learn More
          </Link>
        </div>
      </main>

      <footer className="landing-footer">
        <hr className="landing-hr" />
        <p>Enjoy the sunshine responsibly.</p>
      </footer>
    </div>
  );
}
