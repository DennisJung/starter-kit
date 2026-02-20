import { MetricCard } from "@/components/composite/MetricCard";
import type { BacktestMetrics } from "@/lib/types";

interface BacktestMetricsGridProps {
  metrics?: BacktestMetrics;
  isLoading?: boolean;
}

export function BacktestMetricsGrid({ metrics, isLoading }: BacktestMetricsGridProps) {
  const totalReturn = metrics ? metrics.total_return * 100 : 0;
  const returnTrend = totalReturn >= 0 ? "up" : "down";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <MetricCard
        title="총 수익률"
        value={metrics ? `${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%` : "-"}
        trend={metrics ? returnTrend : undefined}
        isLoading={isLoading}
      />
      <MetricCard
        title="샤프지수"
        value={metrics ? metrics.sharpe_ratio.toFixed(2) : "-"}
        subValue={metrics ? (metrics.sharpe_ratio >= 1 ? "우수" : "보통") : undefined}
        trend={metrics ? (metrics.sharpe_ratio >= 1 ? "up" : "neutral") : undefined}
        isLoading={isLoading}
      />
      <MetricCard
        title="최대낙폭 (MDD)"
        value={metrics ? `${(metrics.max_drawdown * 100).toFixed(2)}%` : "-"}
        trend={metrics ? "down" : undefined}
        isLoading={isLoading}
      />
      <MetricCard
        title="승률"
        value={metrics ? `${(metrics.win_rate * 100).toFixed(1)}%` : "-"}
        subValue={metrics ? `${metrics.trade_count}회 거래` : undefined}
        trend={metrics ? (metrics.win_rate >= 0.5 ? "up" : "down") : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
