"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { OHLCVData } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";

interface CandlestickChartProps {
  data: OHLCVData[];
  height?: number;
}

export function CandlestickChart({ data, height = 420 }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // 테마 상태로 색상 결정
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
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor,
      },
      timeScale: {
        borderColor,
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height,
    });

    // v5 API: chart.addSeries(SeriesDefinition, options)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // OHLCVData → Lightweight Charts 형식으로 변환
    const candleData = data.map(({ time, open, high, low, close }) => ({
      time,
      open,
      high,
      low,
      close,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    candleSeries.setData(candleData as any);

    // 거래량 히스토그램 (v5 API)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#3b82f640",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map(({ time, volume, open, close }) => ({
        time,
        value: volume,
        color: close >= open ? "#22c55e40" : "#ef444440",
      })) as any
    );

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
