import { ImageResponse } from "next/og";

// Root-level OG image, inherited by every route that doesn't define its own.
export const alt = "CalcSuite — Free Online Calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: "#fbbf24",
            marginBottom: 12,
          }}
        >
          CalcSuite
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Free Online Calculators
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#cbd5e1",
            marginTop: 28,
          }}
        >
          BMI · GPA · Calorie · Sunbathing
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            marginTop: 40,
          }}
        >
          No sign-up. No fluff. Just answers.
        </div>
      </div>
    ),
    { ...size }
  );
}
