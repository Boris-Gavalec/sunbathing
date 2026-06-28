"use client";

import MedProgressBar from "./MedProgressBar";

interface ResultsPanelProps {
  uvIndex: number;
  maxTime: number;
  durationMinutes: number;
}

function formatDuration(minutes: number): string {
  if (!isFinite(minutes) || minutes >= 1440) return "24h+";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function ResultsPanel({
  uvIndex,
  maxTime,
  durationMinutes,
}: ResultsPanelProps) {
  const isSafe = durationMinutes <= maxTime;
  const timerMinutes = Math.floor(maxTime);
  const showTimer = isFinite(maxTime) && maxTime > 0 && maxTime < 480;

  const timerHours = Math.floor(timerMinutes / 60);
  const timerRemainingMins = timerMinutes % 60;
  const timerLabel =
    timerMinutes >= 60
      ? timerRemainingMins === 0
        ? `${timerHours} hour${timerHours > 1 ? "s" : ""}`
        : `${timerHours} hour${timerHours > 1 ? "s" : ""} ${timerRemainingMins} minute${timerRemainingMins > 1 ? "s" : ""}`
      : `${timerMinutes} minute${timerMinutes !== 1 ? "s" : ""}`;

  const timerQuery =
    timerMinutes >= 60
      ? timerRemainingMins === 0
        ? `timer+for+${timerHours}+hour${timerHours > 1 ? "s" : ""}`
        : `timer+for+${timerHours}+hour${timerHours > 1 ? "s" : ""}+${timerRemainingMins}+minute${timerRemainingMins > 1 ? "s" : ""}`
      : `timer+for+${timerMinutes}+minutes`;

  function openTimer() {
    window.open(
      `https://www.google.com/search?q=${timerQuery}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Session vs safe time
        </h2>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded"
          style={{
            background: isSafe ? "rgba(74, 222, 128, 0.15)" : "rgba(239, 68, 68, 0.15)",
            color: isSafe ? "#4ade80" : "#ef4444",
          }}
        >
          {isSafe ? "Safe" : "Exceeds limit"}
        </span>
      </div>

      <MedProgressBar
        current={durationMinutes}
        max={isFinite(maxTime) ? maxTime : durationMinutes * 2}
        label={`${formatDuration(durationMinutes)} of ${formatDuration(maxTime)} max`}
      />

      {showTimer && (
        <button
          onClick={openTimer}
          className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{
            background: "var(--primary)",
            color: "var(--primary-text)",
          }}
        >
          Set a {timerLabel} timer
        </button>
      )}
    </div>
  );
}
