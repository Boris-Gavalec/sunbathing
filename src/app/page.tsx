export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background font-sans">
      <main className="flex flex-1 w-full max-w-lg flex-col gap-8 px-5 py-12 sm:max-w-2xl sm:px-8 sm:py-16">
        <section className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <div className="text-6xl sm:text-7xl">&#9728;&#65039;</div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sunbathing
          </h1>
          <p className="text-lg leading-relaxed text-text-muted">
            Your guide to soaking up the sun safely and making the most of
            every golden hour.
          </p>
        </section>

        <section className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-shadow transition-colors hover:bg-surface-hover">
            <div className="mb-3 text-2xl">&#9749;</div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Morning Glow
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              The best time to catch gentle rays is between 7-10 AM. Lower UV,
              warmer light, and a peaceful start to your day.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-shadow transition-colors hover:bg-surface-hover">
            <div className="mb-3 text-2xl">&#127774;</div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              UV Index
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Always check the UV index before heading out. Aim for moderate
              levels (3-5) and use SPF 30+ for longer sessions.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-shadow transition-colors hover:bg-surface-hover">
            <div className="mb-3 text-2xl">&#128167;</div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Stay Hydrated
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Drink plenty of water before, during, and after sun exposure.
              Your skin and body will thank you.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-shadow transition-colors hover:bg-surface-hover">
            <div className="mb-3 text-2xl">&#127860;</div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Golden Hour
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Late afternoon sun (4-6 PM) offers beautiful warm light with
              reduced UV intensity. Perfect for relaxing outdoors.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            className="flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98] sm:h-11"
            href="#"
          >
            Start Your Session
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-border px-6 text-base font-medium text-foreground transition-colors hover:bg-surface-hover active:scale-[0.98] sm:h-11"
            href="#"
          >
            Learn More
          </a>
        </section>

        <footer className="mt-auto border-t border-border pt-6 text-center text-sm text-text-muted">
          <p>Enjoy the sunshine responsibly.</p>
        </footer>
      </main>
    </div>
  );
}
