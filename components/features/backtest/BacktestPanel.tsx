"use client";

import { useState } from "react";
import { subDays, format } from "date-fns";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StockSelector } from "@/components/composite/StockSelector";
import { ChartSkeleton } from "@/components/composite/LoadingOverlay";
import { EmptyState } from "@/components/composite/EmptyState";
import { CandlestickChart } from "@/components/features/chart/CandlestickChart";
import { EquityCurveChart } from "./EquityCurveChart";
import { BacktestMetricsGrid } from "./BacktestMetricsGrid";
import { useBacktest } from "@/hooks/useBacktest";
import { useStockData } from "@/hooks/useStockData";
import { BACKTEST_PERIODS, DEFAULT_BACKTEST_PERIOD, SMA_SHORT, SMA_LONG } from "@/lib/constants";
import type { Ticker, BacktestPeriod } from "@/lib/types";

export function BacktestPanel() {
  const [ticker, setTicker] = useState<Ticker>("AAPL");
  const [period, setPeriod] = useState<BacktestPeriod>(DEFAULT_BACKTEST_PERIOD);

  // 기간에 따른 날짜 계산
  const days = BACKTEST_PERIODS.find((p) => p.value === period)?.days ?? 365;
  const today = new Date();
  const from = format(subDays(today, days), "yyyy-MM-dd");
  const to = format(today, "yyyy-MM-dd");

  const { data: backtest, isLoading, error } = useBacktest(ticker, from, to);
  const { data: ohlcv } = useStockData(ticker, from, to);

  return (
    <div className="space-y-4">
      {/* 컨트롤 바 */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <StockSelector value={ticker} onChange={setTicker} disabled={isLoading} />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* 백테스트 기간 선택 */}
            <div className="flex gap-1">
              {BACKTEST_PERIODS.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => setPeriod(p.value)}
                  disabled={isLoading}
                >
                  {p.label}
                </Button>
              ))}
            </div>

            <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
              SMA {SMA_SHORT} / {SMA_LONG} · {from} ~ {to}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 성과 지표 카드 */}
      <BacktestMetricsGrid metrics={backtest?.metrics} isLoading={isLoading} />

      {/* 캔들스틱 차트 + 매매 신호 */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            캔들스틱 + 매매 신호
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <ChartSkeleton height={380} />
          ) : error ? (
            <EmptyState
              title="백테스트를 실행할 수 없습니다"
              description={error.message}
              icon={AlertCircle}
              className="h-[380px]"
            />
          ) : !ohlcv || ohlcv.length === 0 ? (
            <EmptyState
              title="차트 데이터가 없습니다"
              description="종목과 기간을 선택하면 차트가 표시됩니다."
              icon={TrendingUp}
              className="h-[380px]"
            />
          ) : (
            <CandlestickChart
              data={ohlcv}
              height={380}
              signals={backtest?.signals}
            />
          )}
        </CardContent>
      </Card>

      {/* 수익률 곡선 차트 */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            수익률 곡선 (초기 투자금 = 100 기준)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <ChartSkeleton height={240} />
          ) : backtest?.equity_curve && backtest.equity_curve.length > 0 ? (
            <EquityCurveChart data={backtest.equity_curve} height={240} />
          ) : (
            <EmptyState
              title="수익률 곡선 데이터 없음"
              icon={TrendingUp}
              className="h-[240px]"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
