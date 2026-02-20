import type { Ticker, ChartPeriod } from "./types";

/** 지원 종목 목록 */
export const TICKERS: { value: Ticker; label: string; description: string }[] = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc." },
  { value: "SPY", label: "SPY", description: "S&P 500 ETF" },
  { value: "SCHD", label: "SCHD", description: "Schwab Dividend ETF" },
];

/** 차트 기간 옵션 */
export const CHART_PERIODS: { value: ChartPeriod; label: string; days: number }[] = [
  { value: "1W", label: "1W", days: 7 },
  { value: "2W", label: "2W", days: 14 },
  { value: "1M", label: "1M", days: 30 },
  { value: "3M", label: "3M", days: 90 },
];

/** 기본 차트 기간 */
export const DEFAULT_PERIOD: ChartPeriod = "2W";

/** Yahoo Finance API 기본 URL */
export const YF_BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
