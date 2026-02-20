"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TICKERS } from "@/lib/constants";
import type { Ticker } from "@/lib/types";

interface StockSelectorProps {
  value: Ticker;
  onChange: (ticker: Ticker) => void;
  disabled?: boolean;
}

export function StockSelector({ value, onChange, disabled }: StockSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Ticker)} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {value}
            </Badge>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TICKERS.map((ticker) => (
          <SelectItem key={ticker.value} value={ticker.value}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs w-12 justify-center">
                {ticker.label}
              </Badge>
              <span className="text-muted-foreground text-xs">{ticker.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
