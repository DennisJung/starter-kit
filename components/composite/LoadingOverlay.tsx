import { Skeleton } from "@/components/ui/skeleton";

interface LoadingOverlayProps {
  rows?: number;
}

export function LoadingOverlay({ rows = 4 }: LoadingOverlayProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

/** 차트 영역 스켈레톤 */
export function ChartSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}
