"use client";

import { SKIN_TYPES } from "@/lib/fitzpatrick";

interface StatsCardsProps {
  skinType: number;
  spf: number;
  uvIndex: number;
  maxTime: number;
}

function formatDuration(minutes: number): string {
  if (!isFinite(minutes) || minutes >= 1440) return "24h+";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function StatsCards({
  skinType,
  spf,
  uvIndex,
  maxTime,
}: StatsCardsProps) {
  const skin = SKIN_TYPES.find((s) => s.type === skinType)!;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        className="rounded-xl px-5 py-4 col-span-2 lg:col-span-1"
        style={{
          background: "var(--accent-card-bg)",
          border: "1px solid var(--accent-card-border)",
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-accent">
          Max Safe Time
        </p>
        <p className="text-4xl font-bold font-mono tracking-tight text-accent">
          {formatDuration(maxTime)}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          SPF {spf} · {skin.label}
        </p>
      </div>

      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
          UV Index
        </p>
        <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: "var(--foreground)" }}>
          {uvIndex.toFixed(1)}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : uvIndex <= 10 ? "Very high" : "Extreme"}
        </p>
      </div>

      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
          SPF Applied
        </p>
        <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: "var(--foreground)" }}>
          {spf}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {spf <= 1 ? "No sunscreen" : `${spf}x protection`}
        </p>
      </div>
    </div>
  );
}
