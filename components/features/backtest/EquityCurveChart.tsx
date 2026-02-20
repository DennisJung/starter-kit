"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineSeries,
} from "lightweight-charts";
import type { EquityPoint } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";

interface EquityCurveChartProps {
  data: EquityPoint[];
  height?: number;
}

export function EquityCurveChart({ data, height = 240 }: EquityCurveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const isDark = theme === "dark";
    const textColor = isDark ? "#9ca3af" : "#6b7280";
    const gridColor = isDark ? "#1f2937" : "#f3f4f6";
    const borderColor = isDark ? "#374151" : "#e5e7eb";

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor },
      timeScale: {
        borderColor,
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height,
    });

    // 수익률 곡선 라인 시리즈 (v5 API)
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 2,
      priceFormat: {
        type: "custom",
        formatter: (price: number) => `${price.toFixed(1)}%`,
        minMove: 0.01,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lineSeries.setData(data as any);
    chart.timeScale().fitContent();

    // 반응형 리사이즈
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, height, theme]);

  return <div ref={containerRef} className="w-full rounded-md overflow-hidden" />;
}
