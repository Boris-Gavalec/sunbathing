"use client";

interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
}

export default function MedProgressBar({ current, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  const barColor =
    percentage < 50
      ? "#4ade80"
      : percentage < 80
        ? "#eab308"
        : "#ef4444";

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-mono font-bold" style={{ color: "var(--foreground)" }}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
