// ─── 공유 타입 정의 ────────────────────────────────────────────────────────────

/** 지원하는 종목 티커 */
export type Ticker = "AAPL" | "SPY" | "SCHD";

/** OHLCV 데이터 (TradingView Lightweight Charts 호환 형식) */
export interface OHLCVData {
  time: string;   // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 날짜 범위 */
export interface DateRange {
  from: string;   // "YYYY-MM-DD"
  to: string;     // "YYYY-MM-DD"
}

/** 종목 현재가 지표 */
export interface StockMetrics {
  price: number;
  change: number;           // 전일 대비 변동 금액
  changePercent: number;    // 전일 대비 변동률 (소수, 예: 0.0342)
  volume: number;
  week52High?: number;
  week52Low?: number;
}

/** 차트 기간 선택 옵션 */
export type ChartPeriod = "1W" | "2W" | "1M" | "3M";

/** 네비게이션 항목 (Sidebar 데이터 주입용) */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}
