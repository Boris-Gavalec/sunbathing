import { OPEN_METEO_BASE_URL } from "./constants";
import type { UvDataPoint } from "./dose";

export async function fetchUvData(
  lat: number,
  lon: number,
  date: string
): Promise<UvDataPoint[]> {
  const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=auto&start_date=${date}&end_date=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const data = await res.json();
  const times: string[] = data.hourly.time;
  const uvValues: (number | null)[] = data.hourly.uv_index;

  return times.map((t, i) => ({
    hour: new Date(t).getHours() + new Date(t).getMinutes() / 60,
    uvIndex: Math.max(0, uvValues[i] ?? 0),
  }));
}

export function estimateUvFromSolarElevation(
  lat: number,
  _lon: number,
  date: string
): UvDataPoint[] {
  const d = new Date(date);
  const dayOfYear =
    Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
    );

  const declination =
    23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const latRad = (lat * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;

  // Peak clear-sky UV estimate based on latitude and season
  const peakUv = 12 * Math.cos(latRad - declRad);

  const points: UvDataPoint[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourAngle = ((hour - 12) * 15 * Math.PI) / 180;
    const sinElevation =
      Math.sin(latRad) * Math.sin(declRad) +
      Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourAngle);
    const elevation = Math.asin(Math.max(-1, Math.min(1, sinElevation)));

    const uvIndex =
      elevation > 0 ? Math.max(0, peakUv * Math.sin(elevation)) : 0;

    points.push({ hour, uvIndex: Math.round(uvIndex * 10) / 10 });
  }

  return points;
}
