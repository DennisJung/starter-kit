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

// ─── 백테스트 타입 ────────────────────────────────────────────────────────────

/** 매매 신호 (골든크로스/데드크로스) */
export interface BacktestSignal {
  date: string;           // "YYYY-MM-DD"
  type: "buy" | "sell";
  price: number;
}

/** 수익률 곡선 데이터 포인트 (초기 자본 대비 %) */
export interface EquityPoint {
  time: string;           // "YYYY-MM-DD"
  value: number;          // 100 기준 (예: 112.5 = +12.5%)
}

/** 백테스트 성과 지표 */
export interface BacktestMetrics {
  total_return: number;   // 소수 (예: 0.1234 = 12.34%)
  sharpe_ratio: number;
  max_drawdown: number;   // 음수 (예: -0.082 = -8.2%)
  win_rate: number;       // 소수 (예: 0.6 = 60%)
  trade_count: number;
}

/** 백테스트 결과 전체 */
export interface BacktestResult {
  signals: BacktestSignal[];
  equity_curve: EquityPoint[];
  metrics: BacktestMetrics;
}

/** 백테스트 기간 옵션 */
export type BacktestPeriod = "6M" | "1Y" | "2Y" | "5Y";
