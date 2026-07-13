"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import InputPanel from "@/components/InputPanel";
import ResultsPanel from "@/components/ResultsPanel";
import StatsCards from "@/components/StatsCards";
import EducationalInfo from "@/components/EducationalInfo";
import SiteNav from "@/components/SiteNav";
import { fetchUvData, estimateUvFromSolarElevation } from "@/lib/uv";
import { interpolateUv, calculateMaxTime, type UvDataPoint } from "@/lib/dose";
import { SKIN_TYPES } from "@/lib/fitzpatrick";

const UvChart = dynamic(() => import("@/components/UvChart"), { ssr: false });

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function generateSyntheticUvCurve(peakUv: number): UvDataPoint[] {
  const points: UvDataPoint[] = [];
  for (let h = 5; h <= 21; h += 0.5) {
    // Gaussian bell curve: rises from 5 AM, peaks at 12:30, drops to 0 by 9 PM
    const normalized = Math.exp(-Math.pow((h - 12.5) / 3.8, 2));
    const uv = Math.max(0, peakUv * normalized);
    points.push({ hour: h, uvIndex: Math.round(uv * 10) / 10 });
  }
  return points;
}

const DEFAULT_UV = 5;

export default function Calculator() {
  const [skinType, setSkinType] = useState(2);
  const [spf, setSpf] = useState(1);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [startHour, setStartHour] = useState(12);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [manualUvIndex, setManualUvIndex] = useState<number | null>(DEFAULT_UV);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [uvData, setUvData] = useState<UvDataPoint[]>(() => generateSyntheticUvCurve(DEFAULT_UV));
  const [isEstimated, setIsEstimated] = useState(false);
  const [isSynthetic, setIsSynthetic] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const date = todayString();
  const endHour = startHour + durationMinutes / 60;

  const setLocation = useCallback((newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
  }, []);

  // Keep synthetic curve in sync with the selected UV index (when no real location yet)
  useEffect(() => {
    if (lat !== null || !isSynthetic) return;
    const peak = manualUvIndex ?? DEFAULT_UV;
    setUvData(generateSyntheticUvCurve(peak));
  }, [manualUvIndex, lat, isSynthetic]);

  // Load real UV data when location is set
  useEffect(() => {
    if (lat === null || lon === null) return;

    let cancelled = false;

    async function loadUv() {
      try {
        const data = await fetchUvData(lat!, lon!, date);
        if (!cancelled) {
          setUvData(data);
          setIsEstimated(false);
          setIsSynthetic(false);
        }
      } catch {
        const fallback = estimateUvFromSolarElevation(lat!, lon!, date);
        if (!cancelled) {
          setUvData(fallback);
          setIsEstimated(true);
          setIsSynthetic(false);
        }
      }
    }

    loadUv();
    return () => {
      cancelled = true;
    };
  }, [lat, lon, date]);

  const liveUvIndex = !isSynthetic ? interpolateUv(uvData, startHour) : 0;
  const effectiveUvIndex = manualUvIndex ?? liveUvIndex;

  const skin = useMemo(() => SKIN_TYPES.find((s) => s.type === skinType)!, [skinType]);
  const maxTime = calculateMaxTime(skin.baseMinutes, spf, effectiveUvIndex);

  const applyQuickStart = useCallback((newSkinType: number, newSpf: number, newUvIndex: number) => {
    setSkinType(newSkinType);
    setSpf(newSpf);
    setManualUvIndex(newUvIndex);
  }, []);

  return (
    <>
      <header className="border-b border-card bg-card">
        <div className="px-4 pt-3">
          <SiteNav />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Sunbathing Calculator
              </h1>
              <p className="text-xs text-secondary hidden sm:block">
                Know exactly when to get out of the sun — before your skin decides for you
              </p>
            </div>
          </div>
          {effectiveUvIndex > 0 && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-secondary">UV Index</p>
              <p className="text-2xl font-bold text-accent">{effectiveUvIndex.toFixed(1)}</p>
            </div>
          )}
        </div>
      </header>

      {/* Mobile: collapsible parameters toggle */}
      <div className="lg:hidden border-b border-card bg-card">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          <span>Parameters</span>
          <span style={{ color: "var(--text-secondary)" }}>{sidebarOpen ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {sidebarOpen && (
          <div className="p-4 space-y-5 border-t border-card">
            <InputPanel
              skinType={skinType}
              setSkinType={setSkinType}
              spf={spf}
              setSpf={setSpf}
              lat={lat}
              lon={lon}
              setLocation={setLocation}
              startHour={startHour}
              setStartHour={setStartHour}
              durationMinutes={durationMinutes}
              setDurationMinutes={setDurationMinutes}
              locationLoading={locationLoading}
              setLocationLoading={setLocationLoading}
              locationError={locationError}
              setLocationError={setLocationError}
              manualUvIndex={manualUvIndex}
              setManualUvIndex={setManualUvIndex}
              liveUvIndex={liveUvIndex}
              hasLiveData={!isSynthetic}
              applyQuickStart={applyQuickStart}
            />
          </div>
        )}
      </div>

      <main className="flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-[300px] shrink-0 border-r p-5 space-y-5 overflow-y-auto border-card bg-card">
          <InputPanel
            skinType={skinType}
            setSkinType={setSkinType}
            spf={spf}
            setSpf={setSpf}
            lat={lat}
            lon={lon}
            setLocation={setLocation}
            startHour={startHour}
            setStartHour={setStartHour}
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
            locationLoading={locationLoading}
            setLocationLoading={setLocationLoading}
            locationError={locationError}
            setLocationError={setLocationError}
            manualUvIndex={manualUvIndex}
            setManualUvIndex={setManualUvIndex}
            liveUvIndex={liveUvIndex}
            hasLiveData={!isSynthetic}
            applyQuickStart={applyQuickStart}
          />
        </aside>

        <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto">
          <StatsCards
            skinType={skinType}
            spf={spf}
            uvIndex={effectiveUvIndex}
            maxTime={maxTime}
          />

          <div className="rounded-xl p-4 sm:p-5 bg-card card-border">
            <ResultsPanel
              uvIndex={effectiveUvIndex}
              maxTime={maxTime}
              durationMinutes={durationMinutes}
            />
          </div>

          <div className="rounded-xl p-4 sm:p-5 bg-card card-border">
            <UvChart
              uvData={uvData}
              startHour={startHour}
              endHour={endHour}
              isEstimated={isEstimated}
              isSynthetic={isSynthetic}
            />
          </div>

          <div className="rounded-xl p-4 sm:p-5 bg-card card-border">
            <EducationalInfo />
          </div>
        </div>
      </main>
    </>
  );
}
