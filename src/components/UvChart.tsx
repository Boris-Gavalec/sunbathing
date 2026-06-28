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

interface UvChartProps {
  uvData: UvDataPoint[];
  startHour: number;
  endHour: number;
  isEstimated: boolean;
}

function formatHourLabel(hour: number): string {
  const h = Math.floor(hour);
  const min = Math.round((hour % 1) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return min === 0 ? `${display}${suffix}` : `${display}:${min.toString().padStart(2, "0")}${suffix}`;
}

const SESSION_COLOR = "#06b6d4";
const REFERENCE_COLOR = "#e2e8f0";

function CustomLegend() {
  const items = [
    { color: "#f97316", label: "UV index" },
    { color: SESSION_COLOR, label: "session" },
    { color: REFERENCE_COLOR, label: "selected time", dashed: true },
  ];
  return (
    <div className="flex justify-end gap-4 text-[11px] mb-1" style={{ color: "#7d8fa3" }}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {item.dashed ? (
            <svg width="14" height="10">
              <line x1="0" y1="5" x2="14" y2="5" stroke={item.color} strokeWidth="2" strokeDasharray="3 2" />
            </svg>
          ) : (
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: item.color }} />
          )}
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
}: UvChartProps) {
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
          {isEstimated && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-1 inline-block bg-[rgba(234,179,8,0.15)] text-[#eab308]">
              Estimated (no live data)
            </span>
          )}
        </div>
      </div>
      <CustomLegend />
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
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
            <XAxis
              dataKey="hour"
              type="number"
              domain={[5, 21]}
              tickFormatter={(h: number) => formatHourLabel(h)}
              tick={{ fontSize: 10, fill: "#7d8fa3" }}
              axisLine={{ stroke: "#1e3048" }}
              tickLine={{ stroke: "#1e3048" }}
              ticks={[5, 7, 9, 11, 13, 15, 17, 19, 21]}
            />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 10, fill: "#7d8fa3" }}
              axisLine={{ stroke: "#1e3048" }}
              tickLine={{ stroke: "#1e3048" }}
              label={{
                value: "UV Index",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: "#7d8fa3" },
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#162032",
                border: "1px solid #1e3048",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e2e8f0",
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
              stroke={REFERENCE_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <ReferenceLine
              x={endHour}
              stroke={REFERENCE_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
