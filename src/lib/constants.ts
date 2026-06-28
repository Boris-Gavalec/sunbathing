export const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const UV_PRESETS = [
  { label: "Low", value: 2 },
  { label: "Moderate", value: 5 },
  { label: "High", value: 7 },
  { label: "Very High", value: 9 },
  { label: "Extreme", value: 11 },
] as const;
