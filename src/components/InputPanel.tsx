"use client";

import { useState } from "react";
import { SKIN_TYPES } from "@/lib/fitzpatrick";
import { UV_PRESETS } from "@/lib/constants";

interface InputPanelProps {
  skinType: number;
  setSkinType: (v: number) => void;
  spf: number;
  setSpf: (v: number) => void;
  lat: number | null;
  lon: number | null;
  setLocation: (lat: number, lon: number) => void;
  startHour: number;
  setStartHour: (v: number) => void;
  durationMinutes: number;
  setDurationMinutes: (v: number) => void;
  locationLoading: boolean;
  setLocationLoading: (v: boolean) => void;
  locationError: string | null;
  setLocationError: (v: string | null) => void;
  manualUvIndex: number | null;
  setManualUvIndex: (v: number | null) => void;
  liveUvIndex: number;
  hasLiveData: boolean;
  applyQuickStart: (skinType: number, spf: number, uvIndex: number) => void;
}

const QUICK_STARTS = [
  { label: "Fair skin, no sunscreen, moderate sun", skinType: 2, spf: 1, uvIndex: 5 },
  { label: "Medium skin, SPF 30, high sun", skinType: 3, spf: 30, uvIndex: 7 },
  { label: "Olive skin, SPF 50, extreme sun", skinType: 4, spf: 50, uvIndex: 11 },
];

function formatHour(h: number): string {
  const hour = Math.floor(h);
  const min = Math.round((h % 1) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return min === 0 ? `${display}${suffix}` : `${display}:${min.toString().padStart(2, "0")}${suffix}`;
}

function formatDuration(m: number): string {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return mins === 0 ? `${h}h` : `${h}h ${mins}m`;
}

function EditableValue({
  value,
  onCommit,
  min,
  max,
  prefix,
}: {
  value: number;
  onCommit: (v: number) => void;
  min: number;
  max: number;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  function commit() {
    const parsed = parseInt(draft);
    if (!isNaN(parsed)) onCommit(Math.max(min, Math.min(max, parsed)));
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        type="number"
        autoFocus
        min={min}
        max={max}
        aria-label="Edit value"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="w-16 px-1 py-0 rounded text-sm text-right font-mono font-bold input-overlay"
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className="text-sm font-bold font-mono cursor-text hover:underline decoration-dotted underline-offset-2"
      style={{ color: "var(--foreground)" }}
      title="Click to type a value"
    >
      {prefix}{value}
    </button>
  );
}

export default function InputPanel({
  skinType,
  setSkinType,
  spf,
  setSpf,
  lat,
  lon,
  setLocation,
  startHour,
  setStartHour,
  durationMinutes,
  setDurationMinutes,
  locationLoading,
  setLocationLoading,
  locationError,
  setLocationError,
  manualUvIndex,
  setManualUvIndex,
  liveUvIndex,
  hasLiveData,
  applyQuickStart,
}: InputPanelProps) {
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [customUvDraft, setCustomUvDraft] = useState("");
  const [showCustomUv, setShowCustomUv] = useState(false);

  const selectedSkin = SKIN_TYPES.find((s) => s.type === skinType);

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(
          Math.round(pos.coords.latitude * 100) / 100,
          Math.round(pos.coords.longitude * 100) / 100
        );
        setLocationLoading(false);
        setManualUvIndex(null);
      },
      (err) => {
        setLocationError(err.message);
        setLocationLoading(false);
      }
    );
  }

  const SPF_STOPS = [1, 10, 15, 30, 50, 70, 100];

  function spfToSlider(spf: number): number {
    const idx = SPF_STOPS.indexOf(spf);
    return idx !== -1 ? idx : -1;
  }

  const sliderValue = spfToSlider(spf);
  const isCustom = sliderValue === -1;

  const activeUvPreset = UV_PRESETS.find((p) => p.value === manualUvIndex);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">
          Parameters
        </h2>
      </div>

      {/* Quick start */}
      <div>
        <p className="text-[11px] mb-2" style={{ color: "var(--text-secondary)" }}>Quick start:</p>
        <div className="space-y-1.5">
          {QUICK_STARTS.map((qs, i) => (
            <button
              key={i}
              onClick={() => applyQuickStart(qs.skinType, qs.spf, qs.uvIndex)}
              className="w-full text-left px-3 py-2 rounded-md text-[11px] transition-all hover:brightness-125"
              style={{
                background: "var(--quick-start-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              {qs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fitzpatrick type */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-secondary">Skin type</span>
          <span className="text-sm font-bold font-mono text-foreground">
            {selectedSkin?.label.replace("Type ", "") ?? skinType}
          </span>
        </div>
        <div className="flex gap-1.5">
          {SKIN_TYPES.map((st) => (
            <button
              key={st.type}
              onClick={() => setSkinType(st.type)}
              className="flex-1 h-9 rounded-md text-xs font-bold transition-all"
              style={{
                background: skinType === st.type ? st.color : "var(--quick-start-bg)",
                color: skinType === st.type ? (st.type <= 2 ? "#1a1a2e" : "#fff") : "var(--text-secondary)",
                border: skinType === st.type ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              {st.type <= 3 ? ["I", "II", "III"][st.type - 1] : ["IV", "V", "VI"][st.type - 4]}
            </button>
          ))}
        </div>
        {selectedSkin && (
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            {selectedSkin.description}
          </p>
        )}
      </div>

      {/* SPF */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-secondary">Sunscreen</span>
          <EditableValue value={spf} onCommit={setSpf} min={1} max={200} prefix="SPF " />
        </div>
        <input
          type="range"
          min={0}
          max={SPF_STOPS.length - 1}
          step={1}
          value={isCustom ? 0 : sliderValue}
          onChange={(e) => setSpf(SPF_STOPS[parseInt(e.target.value)])}
          className="w-full"
          aria-label="SPF slider"
        />
        <div className="flex justify-between text-[10px] mt-1 text-secondary">
          {SPF_STOPS.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>

      {/* UV Index */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-secondary">UV index</span>
          {hasLiveData && manualUvIndex === null && (
            <span className="text-xs font-mono text-accent">
              Live: {liveUvIndex.toFixed(1)}
            </span>
          )}
          {manualUvIndex !== null && (
            <span className="text-xs font-mono text-foreground">
              {manualUvIndex}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {UV_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setManualUvIndex(preset.value);
                setShowCustomUv(false);
              }}
              className="flex-1 min-w-0 px-1 py-1.5 rounded-md text-[11px] font-bold transition-all text-center"
              style={{
                background: activeUvPreset?.value === preset.value ? "var(--accent)" : "var(--quick-start-bg)",
                color: activeUvPreset?.value === preset.value ? "var(--accent-btn-text)" : "var(--text-secondary)",
                border: activeUvPreset?.value === preset.value ? "2px solid var(--accent)" : "1px solid var(--card-border)",
              }}
            >
              <span className="block leading-tight">{preset.label}</span>
              <span className="block text-[9px] opacity-70">{preset.value}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setShowCustomUv((v) => !v)}
            className="text-[11px] hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            {showCustomUv ? "▾ Custom" : "▸ Custom UV"}
          </button>
          {hasLiveData && manualUvIndex !== null && (
            <button
              onClick={() => setManualUvIndex(null)}
              className="text-[11px] hover:underline ml-auto"
              style={{ color: "var(--accent)" }}
            >
              Use live data
            </button>
          )}
        </div>
        {showCustomUv && (
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="20"
              aria-label="Custom UV index"
              value={customUvDraft}
              onChange={(e) => setCustomUvDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = parseFloat(customUvDraft);
                  if (!isNaN(val) && val > 0) setManualUvIndex(Math.min(20, val));
                }
              }}
              placeholder="e.g. 6.5"
              className="flex-1 px-2 py-1.5 rounded text-xs font-mono input-muted"
            />
            <button
              onClick={() => {
                const val = parseFloat(customUvDraft);
                if (!isNaN(val) && val > 0) setManualUvIndex(Math.min(20, val));
              }}
              className="px-3 py-1.5 rounded text-xs font-bold"
              style={{ background: "var(--accent)", color: "var(--accent-btn-text)" }}
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Start time */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-secondary">Start time</span>
          <span className="text-sm font-bold font-mono text-foreground">
            {formatHour(startHour)}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={20}
          step={0.5}
          value={startHour}
          onChange={(e) => setStartHour(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Start time slider"
        />
        <div className="flex justify-between text-[10px] mt-1 text-secondary">
          <span>{formatHour(5)}</span>
          <span>{formatHour(20)}</span>
        </div>
      </div>

      {/* Duration */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-secondary">Duration</span>
          <span className="text-sm font-bold font-mono text-foreground">
            {formatDuration(durationMinutes)}
          </span>
        </div>
        <input
          type="range"
          min={15}
          max={480}
          step={15}
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
          className="w-full"
          aria-label="Duration slider"
        />
        <div className="flex justify-between text-[10px] mt-1 text-secondary">
          <span>{formatDuration(15)}</span>
          <span>{formatDuration(480)}</span>
        </div>
      </div>

      {/* Location */}
      <div className="pt-2">
        <button
          onClick={detectLocation}
          disabled={locationLoading}
          className="w-full px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 border-accent bg-transparent text-accent"
          style={{ border: "1px solid var(--accent)" }}
        >
          {locationLoading ? "Detecting..." : "Check My UV Now"}
        </button>
        {locationError && (
          <p className="text-red-400 text-xs mt-2">{locationError}</p>
        )}
        {lat !== null && lon !== null && (
          <p className="text-[11px] mt-2 text-center font-mono" style={{ color: "var(--text-secondary)" }}>
            Lat {lat} · Lon {lon}
          </p>
        )}
        <button
          onClick={() => setShowManualCoords((v) => !v)}
          className="mt-2 text-[11px] w-full text-center hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          {showManualCoords ? "▾ Hide manual input" : "▸ Enter manually"}
        </button>
        {showManualCoords && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1 text-secondary">Lat</label>
              <input
                type="number"
                step="0.01"
                aria-label="Latitude"
                value={lat ?? ""}
                onChange={(e) =>
                  setLocation(parseFloat(e.target.value) || 0, lon ?? 0)
                }
                placeholder="48.15"
                className="w-full px-2 py-1.5 rounded text-xs font-mono input-muted"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-1 text-secondary">Lon</label>
              <input
                type="number"
                step="0.01"
                aria-label="Longitude"
                value={lon ?? ""}
                onChange={(e) =>
                  setLocation(lat ?? 0, parseFloat(e.target.value) || 0)
                }
                placeholder="17.11"
                className="w-full px-2 py-1.5 rounded text-xs font-mono input-muted"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
