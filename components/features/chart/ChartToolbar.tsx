"use client";

import { Button } from "@/components/ui/button";
import { CHART_PERIODS } from "@/lib/constants";
import type { ChartPeriod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChartToolbarProps {
  selected: ChartPeriod;
  onChange: (period: ChartPeriod) => void;
  disabled?: boolean;
}

export function ChartToolbar({ selected, onChange, disabled }: ChartToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      {CHART_PERIODS.map((p) => (
        <Button
          key={p.value}
          variant={selected === p.value ? "default" : "ghost"}
          size="sm"
          className={cn("h-7 px-2 text-xs", disabled && "opacity-50")}
          onClick={() => onChange(p.value)}
          disabled={disabled}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
