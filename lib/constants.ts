import type { Ticker, ChartPeriod, BacktestPeriod } from "./types";

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

// ─── 백테스트 상수 ────────────────────────────────────────────────────────────

/** SMA 단기 기간 (고정) */
export const SMA_SHORT = 20;

/** SMA 장기 기간 (고정) */
export const SMA_LONG = 60;

/** 백테스트 기간 옵션 */
export const BACKTEST_PERIODS: { value: BacktestPeriod; label: string; days: number }[] = [
  { value: "6M", label: "6개월", days: 180 },
  { value: "1Y", label: "1년",   days: 365 },
  { value: "2Y", label: "2년",   days: 730 },
  { value: "5Y", label: "5년",   days: 1825 },
];

/** 기본 백테스트 기간 */
export const DEFAULT_BACKTEST_PERIOD: BacktestPeriod = "1Y";

/** FastAPI 백엔드 URL */
export const FASTAPI_BASE_URL = "http://localhost:8000";
