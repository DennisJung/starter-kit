import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = BarChart3,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}
