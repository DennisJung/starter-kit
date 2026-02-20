import { NextRequest, NextResponse } from "next/server";
import type { OHLCVData } from "@/lib/types";

interface RouteParams {
  params: Promise<{ ticker: string }>;
}

/**
 * Yahoo Finance v8 Chart API에서 OHLCV 데이터를 수집합니다.
 * GET /api/stock/[ticker]?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { ticker } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!ticker || !from || !to) {
    return NextResponse.json(
      { error: "ticker, from, to 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const fromTs = Math.floor(new Date(from).getTime() / 1000);
    const toTs = Math.floor(new Date(to).getTime() / 1000);

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
      `?period1=${fromTs}&period2=${toTs}&interval=1d&events=history`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance API 오류: ${res.status}`);
    }

    const json = await res.json();
    const result = json?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json(
        { error: `'${ticker}' 데이터를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    const timestamps: number[] = result.timestamp ?? [];
    const quote = result.indicators?.quote?.[0] ?? {};
    const opens: number[] = quote.open ?? [];
    const highs: number[] = quote.high ?? [];
    const lows: number[] = quote.low ?? [];
    const closes: number[] = quote.close ?? [];
    const volumes: number[] = quote.volume ?? [];

    const ohlcv: OHLCVData[] = timestamps
      .map((ts, i) => ({
        time: new Date(ts * 1000).toISOString().split("T")[0],
        open: Math.round(opens[i] * 100) / 100,
        high: Math.round(highs[i] * 100) / 100,
        low: Math.round(lows[i] * 100) / 100,
        close: Math.round(closes[i] * 100) / 100,
        volume: volumes[i] ?? 0,
      }))
      .filter((d) => d.open && d.high && d.low && d.close); // null 값 제거

    return NextResponse.json(ohlcv);
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
