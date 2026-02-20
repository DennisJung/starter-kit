// ─── 숫자/통화/퍼센트 포매팅 유틸 (브라우저 내장 Intl API 사용) ─────────────────

/** 통화 포매팅: 1234.56 → "$1,234.56" */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** 퍼센트 포매팅: 0.0342 → "+3.42%", -0.05 → "-5.00%" */
export function formatPercent(value: number, showSign = true): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  if (!showSign) return formatted;
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

/** 거래량 포매팅: 12340000 → "12.34M", 1234 → "1.23K" */
export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toString();
}

/** 변동 금액 포매팅: 1.23 → "+$1.23", -0.5 → "-$0.50" */
export function formatChange(value: number): string {
  const abs = formatCurrency(Math.abs(value));
  return value >= 0 ? `+${abs}` : `-${abs}`;
}

/** 간단한 숫자 포매팅: 1234567 → "1,234,567" */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
