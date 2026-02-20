"use client";

import { useState } from "react";
import { subDays, format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StockSelector } from "@/components/composite/StockSelector";
import { ChartToolbar } from "@/components/features/chart/ChartToolbar";
import { CandlestickChart } from "@/components/features/chart/CandlestickChart";
import { StockPriceHeader } from "./StockPriceHeader";
import { StockMetricsGrid } from "./StockMetricsGrid";
import { ChartSkeleton } from "@/components/composite/LoadingOverlay";
import { EmptyState } from "@/components/composite/EmptyState";
import { useStockData } from "@/hooks/useStockData";
import { CHART_PERIODS, DEFAULT_PERIOD } from "@/lib/constants";
import type { Ticker, ChartPeriod } from "@/lib/types";
import { BarChart3, AlertCircle } from "lucide-react";

export function StockDemoPanel() {
  const [ticker, setTicker] = useState<Ticker>("AAPL");
  const [period, setPeriod] = useState<ChartPeriod>(DEFAULT_PERIOD);

  // 기간에 따른 날짜 계산
  const days = CHART_PERIODS.find((p) => p.value === period)?.days ?? 14;
  const today = new Date();
  const from = format(subDays(today, days), "yyyy-MM-dd");
  const to = format(today, "yyyy-MM-dd");

  const { data, isLoading, error } = useStockData(ticker, from, to);

  const ohlcv = data ?? [];
  const last = ohlcv[ohlcv.length - 1];
  const prev = ohlcv[ohlcv.length - 2];

  return (
    <div className="space-y-4">
      {/* 컨트롤 바 */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <StockSelector value={ticker} onChange={setTicker} disabled={isLoading} />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <ChartToolbar selected={period} onChange={setPeriod} disabled={isLoading} />
            <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
              {from} ~ {to}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 현재가 헤더 */}
      <Card>
        <CardHeader className="pb-3">
          <StockPriceHeader
            ticker={ticker}
            price={last?.close}
            prevClose={prev?.close}
            isLoading={isLoading}
          />
        </CardHeader>
      </Card>

      {/* 지표 그리드 */}
      <StockMetricsGrid data={ohlcv} isLoading={isLoading} />

      {/* 캔들스틱 차트 */}
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <ChartSkeleton height={420} />
          ) : error ? (
            <EmptyState
              title="데이터를 불러올 수 없습니다"
              description={error.message}
              icon={AlertCircle}
              className="h-[420px]"
            />
          ) : ohlcv.length === 0 ? (
            <EmptyState
              title="차트 데이터가 없습니다"
              description="종목과 기간을 선택하면 캔들스틱 차트가 표시됩니다."
              icon={BarChart3}
              className="h-[420px]"
            />
          ) : (
            <CandlestickChart data={ohlcv} height={420} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
