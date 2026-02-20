import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subValue,
  trend,
  isLoading,
  className,
}: MetricCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        {isLoading ? (
          <Skeleton className="h-7 w-24 mt-1" />
        ) : (
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">{value}</p>
            {subValue && trend && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs mb-0.5",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-muted-foreground"
                )}
              >
                <TrendIcon className="h-3 w-3" />
                {subValue}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
