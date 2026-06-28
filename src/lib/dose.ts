export interface UvDataPoint {
  hour: number;
  uvIndex: number;
}

export function interpolateUv(uvData: UvDataPoint[], hourFraction: number): number {
  if (uvData.length === 0) return 0;

  const clamped = Math.max(uvData[0].hour, Math.min(uvData[uvData.length - 1].hour, hourFraction));

  let lower = uvData[0];
  let upper = uvData[uvData.length - 1];

  for (let i = 0; i < uvData.length - 1; i++) {
    if (uvData[i].hour <= clamped && uvData[i + 1].hour >= clamped) {
      lower = uvData[i];
      upper = uvData[i + 1];
      break;
    }
  }

  if (upper.hour === lower.hour) return lower.uvIndex;
  const t = (clamped - lower.hour) / (upper.hour - lower.hour);
  return lower.uvIndex + t * (upper.uvIndex - lower.uvIndex);
}

export function calculateMaxTime(baseMinutes: number, spf: number, uvIndex: number): number {
  if (uvIndex <= 0) return Infinity;
  const effectiveSpf = spf <= 0 ? 1 : spf;
  return (baseMinutes * effectiveSpf) / uvIndex;
}
