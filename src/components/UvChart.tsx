"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { UvDataPoint } from "@/lib/dose";
import { interpolateUv } from "@/lib/dose";
import { useTheme } from "@/components/ThemeProvider";

interface UvChartProps {
  uvData: UvDataPoint[];
  startHour: number;
  endHour: number;
  isEstimated: boolean;
  isSynthetic?: boolean;
}

function formatHourLabel(hour: number): string {
  const h = Math.floor(hour);
  const min = Math.round((hour % 1) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return min === 0 ? `${display}${suffix}` : `${display}:${min.toString().padStart(2, "0")}${suffix}`;
}

const SESSION_COLOR = "#06b6d4";

const THEME_COLORS = {
  light: {
    grid: "#e2e8f0",
    tick: "#64748b",
    axis: "#e2e8f0",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e2e8f0",
    tooltipText: "#1e293b",
    legend: "#64748b",
    reference: "#94a3b8",
  },
  dark: {
    grid: "#1e3048",
    tick: "#7d8fa3",
    axis: "#1e3048",
    tooltipBg: "#162032",
    tooltipBorder: "#1e3048",
    tooltipText: "#e2e8f0",
    legend: "#7d8fa3",
    reference: "#e2e8f0",
  },
};

function CustomLegend({ legendColor }: { legendColor: string }) {
  const items = [
    { color: "#f97316", label: "UV index" },
    { color: SESSION_COLOR, label: "session" },
  ];
  return (
    <div className="flex justify-end gap-4 text-[11px] mb-1" style={{ color: legendColor }}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function UvChart({
  uvData,
  startHour,
  endHour,
  isEstimated,
  isSynthetic = false,
}: UvChartProps) {
  const { theme } = useTheme();
  const c = THEME_COLORS[theme];

  const filtered = uvData.filter((d) => d.hour >= 5 && d.hour <= 21);

  const syntheticPoints: UvDataPoint[] = [];
  for (const hour of [startHour, endHour]) {
    if (hour >= 5 && hour <= 21 && !filtered.some((d) => Math.abs(d.hour - hour) < 0.01)) {
      syntheticPoints.push({ hour, uvIndex: interpolateUv(uvData, hour) });
    }
  }

  const allPoints = [...filtered, ...syntheticPoints].sort((a, b) => a.hour - b.hour);

  const chartData = allPoints.map((d) => {
    const inSession = d.hour >= startHour - 0.01 && d.hour <= endHour + 0.01;
    return {
      hour: d.hour,
      uvIndex: d.uvIndex,
      sessionUv: inSession ? d.uvIndex : null,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            UV irradiance · sunrise to sunset
          </h2>
          {isSynthetic && (
            <span className="text-[10px] px-2 py-0.5 rounded mt-1 inline-block bg-[rgba(0,0,0,0.05)]" style={{ color: "var(--text-secondary)" }}>
              Sample curve. Click Check My UV to use your location
            </span>
          )}
          {!isSynthetic && isEstimated && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-1 inline-block bg-[rgba(234,179,8,0.15)] text-[#eab308]">
              Estimated (no live data)
            </span>
          )}
        </div>
      </div>
      <CustomLegend legendColor={c.legend} />
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="40%" stopColor="#f97316" stopOpacity={0.7} />
                <stop offset="70%" stopColor="#eab308" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SESSION_COLOR} stopOpacity={0.45} />
                <stop offset="100%" stopColor={SESSION_COLOR} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis
              dataKey="hour"
              type="number"
              domain={[5, 21]}
              tickFormatter={(h: number) => formatHourLabel(h)}
              tick={{ fontSize: 10, fill: c.tick }}
              axisLine={{ stroke: c.axis }}
              tickLine={{ stroke: c.axis }}
              ticks={[5, 7, 9, 11, 13, 15, 17, 19, 21]}
            />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 10, fill: c.tick }}
              axisLine={{ stroke: c.axis }}
              tickLine={{ stroke: c.axis }}
              label={{
                value: "UV Index",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: c.tick },
              }}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: c.tooltipText,
              }}
              formatter={(value, name) => {
                if (value == null) return [null, null];
                const label = name === "sessionUv" ? "Session UV" : "UV Index";
                return [Number(value).toFixed(1), label];
              }}
              labelFormatter={(hour) => formatHourLabel(Number(hour))}
            />
            <Area
              type="monotone"
              dataKey="uvIndex"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#uvGradient)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="sessionUv"
              stroke={SESSION_COLOR}
              strokeWidth={2}
              fill="url(#sessionGradient)"
              isAnimationActive={false}
              connectNulls={false}
            />
            <ReferenceLine
              x={startHour}
              stroke={c.reference}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <ReferenceLine
              x={endHour}
              stroke={c.reference}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
