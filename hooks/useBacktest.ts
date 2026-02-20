"use client";

import { useQuery } from "@tanstack/react-query";
import type { BacktestResult, Ticker } from "@/lib/types";

async function fetchBacktest(
  ticker: Ticker,
  from: string,
  to: string
): Promise<BacktestResult> {
  const res = await fetch("/api/backtest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, from_date: from, to_date: to }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `백테스트 실패 (${res.status})`);
  }

  return res.json();
}

export function useBacktest(ticker: Ticker, from: string, to: string) {
  return useQuery({
    queryKey: ["backtest", "sma", ticker, from, to],
    queryFn: () => fetchBacktest(ticker, from, to),
    enabled: Boolean(ticker && from && to),
    staleTime: 10 * 60 * 1000, // 10분 캐시
    retry: 1,
  });
}
