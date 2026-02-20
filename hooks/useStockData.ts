"use client";

import { useQuery } from "@tanstack/react-query";
import type { OHLCVData, Ticker } from "@/lib/types";

async function fetchOHLCV(ticker: Ticker, from: string, to: string): Promise<OHLCVData[]> {
  const res = await fetch(`/api/stock/${ticker}?from=${from}&to=${to}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `데이터 조회 실패 (${res.status})`);
  }
  return res.json();
}

export function useStockData(ticker: Ticker, from: string, to: string) {
  return useQuery({
    queryKey: ["stock", ticker, from, to],
    queryFn: () => fetchOHLCV(ticker, from, to),
    enabled: Boolean(ticker && from && to),
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
}
