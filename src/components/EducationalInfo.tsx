"use client";

export default function EducationalInfo() {
  const sectionStyle = {
    color: "var(--text-secondary)",
  };

  const summaryStyle = {
    color: "var(--foreground)",
  };

  return (
    <div className="space-y-3 text-sm">
      <details className="group">
        <summary className="cursor-pointer font-semibold text-sm" style={summaryStyle}>
          How the formula works
        </summary>
        <div className="mt-2 space-y-2 pl-4 text-xs" style={sectionStyle}>
          <p>
            Your maximum safe sun exposure time is calculated as:
          </p>
          <p className="font-mono text-foreground">
            max time = (skin type value × SPF) / UV index
          </p>
          <p>
            Each Fitzpatrick skin type has a base value in minutes (Type I = 67, up to Type VI = 233).
            Applying sunscreen multiplies this by the SPF factor. Higher UV intensity reduces your safe time proportionally.
          </p>
          <p>
            SPF 1 means no sunscreen protection. SPF 30 means the sunscreen
            extends your natural burn time by a factor of 30.
          </p>
        </div>
      </details>

      <details className="group">
        <summary className="cursor-pointer font-semibold text-sm" style={summaryStyle}>
          About UV index levels
        </summary>
        <div className="mt-2 space-y-2 pl-4 text-xs" style={sectionStyle}>
          <p>
            The UV index measures the intensity of ultraviolet radiation from the sun.
            Higher values mean stronger UV and faster skin damage.
          </p>
          <ul className="space-y-1 list-none">
            <li><span className="font-mono text-foreground">1-2</span> — Low: minimal risk</li>
            <li><span className="font-mono text-foreground">3-5</span> — Moderate: wear sunscreen</li>
            <li><span className="font-mono text-foreground">6-7</span> — High: reduce exposure midday</li>
            <li><span className="font-mono text-foreground">8-10</span> — Very high: seek shade</li>
            <li><span className="font-mono text-foreground">11+</span> — Extreme: avoid outdoor exposure</li>
          </ul>
        </div>
      </details>

      <div className="mt-4 p-3 rounded-lg text-[11px]"
        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
        <strong>Disclaimer:</strong> This calculator is for informational purposes
        only and is not medical advice. Individual UV sensitivity varies.
      </div>
    </div>
  );
}
