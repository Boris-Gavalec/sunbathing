# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

Single-page Next.js (App Router) sunbathing calculator. All state lives in `src/app/page.tsx` (client component). No API routes — Open-Meteo is called directly from the browser for live UV data.

**Library modules** (`src/lib/`):
- `dose.ts` — Simple formula: `maxTime = (baseMinutes × SPF) / uvIndex`, plus UV interpolation helper
- `uv.ts` — Open-Meteo API fetch + solar elevation fallback
- `fitzpatrick.ts` — Skin type definitions with base minute values
- `constants.ts` — UV presets, API URL

**Components** (`src/components/`):
- `InputPanel` — Fitzpatrick selector (with inline descriptions), SPF slider, UV preset buttons + custom input, start time/duration sliders, geolocation
- `UvChart` — Recharts interactive area chart with session overlay (dynamically imported, SSR disabled). Uses numerical X axis for correct half-hour rendering.
- `ResultsPanel` — Formula breakdown display, session-vs-safe-time progress bar
- `MedProgressBar` — Reusable progress bar (green→yellow→red)
- `StatsCards` — Max safe time, UV index, SPF summary cards
- `EducationalInfo` — Collapsible formula and UV index explanations

## Key formula

`max time (minutes) = (skin type base × SPF) / UV index`

Skin type base values: I=67, II=100, III=133, IV=167, V=200, VI=233
UV index: from live Open-Meteo data or manual preset (Low=2, Moderate=5, High=7, Very High=9, Extreme=11)
SPF default: 1 (no sunscreen)
