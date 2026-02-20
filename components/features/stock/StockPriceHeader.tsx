import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatChange, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Ticker } from "@/lib/types";

interface StockPriceHeaderProps {
  ticker: Ticker;
  price?: number;
  prevClose?: number;
  isLoading?: boolean;
}

export function StockPriceHeader({
  ticker,
  price,
  prevClose,
  isLoading,
}: StockPriceHeaderProps) {
  const change = price && prevClose ? price - prevClose : undefined;
  const changePct = change && prevClose ? change / prevClose : undefined;
  const isPositive = change !== undefined ? change >= 0 : undefined;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <Badge variant="outline" className="font-mono text-sm px-2 py-1">
        {ticker}
      </Badge>

      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : price ? (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formatCurrency(price)}</span>
          {change !== undefined && changePct !== undefined && (
            <span
              className={cn(
                "text-sm font-medium",
                isPositive ? "text-green-600" : "text-red-500"
              )}
            >
              {formatChange(change)} ({formatPercent(changePct)})
            </span>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">종목을 선택해주세요</span>
      )}
    </div>
  );
}
