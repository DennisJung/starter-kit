import { MetricCard } from "@/components/composite/MetricCard";
import { formatCurrency, formatVolume, formatPercent } from "@/lib/formatters";
import type { OHLCVData } from "@/lib/types";

interface StockMetricsGridProps {
  data: OHLCVData[];
  isLoading?: boolean;
}

export function StockMetricsGrid({ data, isLoading }: StockMetricsGridProps) {
  // 마지막 캔들에서 지표 계산
  const last = data[data.length - 1];
  const prev = data[data.length - 2];

  const change = last && prev ? last.close - prev.close : undefined;
  const changePct = change && prev ? change / prev.close : undefined;

  const high = data.length > 0 ? Math.max(...data.map((d) => d.high)) : undefined;
  const low = data.length > 0 ? Math.min(...data.map((d) => d.low)) : undefined;
  const avgVolume =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.volume, 0) / data.length
      : undefined;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MetricCard
        title="현재가"
        value={last ? formatCurrency(last.close) : "-"}
        subValue={changePct !== undefined ? formatPercent(changePct) : undefined}
        trend={changePct !== undefined ? (changePct >= 0 ? "up" : "down") : undefined}
        isLoading={isLoading}
      />
      <MetricCard
        title="기간 고가"
        value={high ? formatCurrency(high) : "-"}
        isLoading={isLoading}
      />
      <MetricCard
        title="기간 저가"
        value={low ? formatCurrency(low) : "-"}
        isLoading={isLoading}
      />
      <MetricCard
        title="평균 거래량"
        value={avgVolume ? formatVolume(avgVolume) : "-"}
        isLoading={isLoading}
      />
    </div>
  );
}
