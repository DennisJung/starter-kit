# 퀀트 스톡 인테그레이터 에이전트 메모리

## 추가된 종목 목록 (누적)
| 티커 | 설명 | 추가일 |
|------|------|--------|
| AAPL | Apple Inc. | 프로젝트 초기 |
| SPY | S&P 500 ETF | 프로젝트 초기 |
| SCHD | Schwab Dividend ETF | 프로젝트 초기 |
| QQQ | 나스닥 100 ETF | 2026-02-23 |

## TICKERS 배열 정렬 규칙
- 알파벳 순서로 정렬 (A → Q → S 순)
- 현재 순서: AAPL → QQQ → SPY → SCHD

## 핵심 파일 경로
- 타입 정의: `/Users/dennis/workspace/courses/claude-nextjs-starters/lib/types.ts`
- 상수 정의: `/Users/dennis/workspace/courses/claude-nextjs-starters/lib/constants.ts`

## lib/types.ts 현재 Ticker 타입
```typescript
export type Ticker = "AAPL" | "QQQ" | "SPY" | "SCHD";
```

## lib/constants.ts 현재 TICKERS 배열
```typescript
export const TICKERS: { value: Ticker; label: string; description: string }[] = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc." },
  { value: "QQQ", label: "QQQ", description: "나스닥 100 ETF" },
  { value: "SPY", label: "SPY", description: "S&P 500 ETF" },
  { value: "SCHD", label: "SCHD", description: "Schwab Dividend ETF" },
]
```

## 검증 방법
- `npm run build` 실행 후 TypeScript 오류 없고 7개 페이지 정상 빌드 확인
- 빌드 성공 기준: "Generating static pages (7/7)" + 오류 없음
