"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import InputPanel from "@/components/InputPanel";
import ResultsPanel from "@/components/ResultsPanel";
import StatsCards from "@/components/StatsCards";
import EducationalInfo from "@/components/EducationalInfo";
import { fetchUvData, estimateUvFromSolarElevation } from "@/lib/uv";
import { interpolateUv, calculateMaxTime, type UvDataPoint } from "@/lib/dose";
import { SKIN_TYPES } from "@/lib/fitzpatrick";

const UvChart = dynamic(() => import("@/components/UvChart"), { ssr: false });

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export default function Calculator() {
  const [skinType, setSkinType] = useState(2);
  const [spf, setSpf] = useState(1);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [startHour, setStartHour] = useState(12);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [manualUvIndex, setManualUvIndex] = useState<number | null>(5);

  const [uvData, setUvData] = useState<UvDataPoint[]>([]);
  const [isEstimated, setIsEstimated] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const date = todayString();
  const endHour = startHour + durationMinutes / 60;

  const setLocation = useCallback((newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
  }, []);

  useEffect(() => {
    if (lat === null || lon === null) return;

    let cancelled = false;

    async function loadUv() {
      try {
        const data = await fetchUvData(lat!, lon!, date);
        if (!cancelled) {
          setUvData(data);
          setIsEstimated(false);
        }
      } catch {
        const fallback = estimateUvFromSolarElevation(lat!, lon!, date);
        if (!cancelled) {
          setUvData(fallback);
          setIsEstimated(true);
        }
      }
    }

    loadUv();
    return () => {
      cancelled = true;
    };
  }, [lat, lon, date]);

  const liveUvIndex = uvData.length > 0 ? interpolateUv(uvData, startHour) : 0;
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
      <header className="border-b px-6 py-3 flex items-center justify-between border-card bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Sunbathing Calculator
            </h1>
            <p className="text-xs text-secondary">
              Know exactly when to get out of the sun — before your skin decides for you
            </p>
          </div>
        </div>
        {effectiveUvIndex > 0 && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-secondary">
              UV Index
            </p>
            <p className="text-2xl font-bold text-accent">
              {effectiveUvIndex.toFixed(1)}
            </p>
          </div>
        )}
      </header>

      <main className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-60px)]">
        <aside className="lg:w-[300px] shrink-0 border-r p-5 space-y-5 overflow-y-auto border-card bg-card">
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
            hasLiveData={uvData.length > 0}
            applyQuickStart={applyQuickStart}
          />
        </aside>

        <div className="flex-1 p-5 space-y-5 overflow-y-auto">
          <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Every skin type has a limit. Find yours in 10 seconds.
          </p>

          <StatsCards
            skinType={skinType}
            spf={spf}
            uvIndex={effectiveUvIndex}
            maxTime={maxTime}
          />

          {uvData.length > 0 && (
            <div className="rounded-xl p-5 bg-card card-border">
              <UvChart
                uvData={uvData}
                startHour={startHour}
                endHour={endHour}
                isEstimated={isEstimated}
              />
            </div>
          )}

          <div className="rounded-xl p-5 bg-card card-border">
            <ResultsPanel
              uvIndex={effectiveUvIndex}
              maxTime={maxTime}
              durationMinutes={durationMinutes}
            />
          </div>

          <div className="rounded-xl p-5 bg-card card-border">
            <EducationalInfo />
          </div>
        </div>
      </main>
    </>
  );
}
