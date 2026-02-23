# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 코드 스타일 규칙은 @.claude/rules/code-style.md, Git 규칙은 @.claude/rules/git-rules.md, 전체 프로젝트 개요는 @README.md 를 참조하세요.

## 개발 명령어

```bash
# 프론트엔드 개발 서버 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 및 린트
npm run build
npm run lint

# 백엔드 FastAPI 서버 (http://localhost:8000) — 백테스트 기능에 필요
cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000
```

백테스트 기능은 **프론트엔드와 백엔드 서버를 동시에 실행**해야 동작한다.

# 커뮤니케이션
- 코드 변경 시 무엇을 왜 바꿨는지 간단히 설명
- 파일을 새로 만들 때는 먼저 계획을 말해주고 진행

## 아키텍처

### 5계층 컴포넌트 구조

```
Layer 1: components/layout/     - AppShell, Header, Sidebar, ContentArea
Layer 2: components/ui/         - shadcn/ui 원자 컴포넌트
Layer 3: components/composite/  - StockSelector, MetricCard, EmptyState
Layer 4: components/features/   - CandlestickChart, BacktestPanel, StockDemoPanel
Layer 5: app/*/page.tsx         - Next.js 페이지
```

상위 레이어는 하위 레이어에만 의존한다. 새 컴포넌트 추가 시 이 계층에 따라 위치를 결정할 것.

### 페이지 및 API 라우트

| 경로 | 역할 |
|------|------|
| `/` | `/demo`로 리다이렉트 |
| `/demo` | Yahoo Finance 캔들스틱 차트 (`StockDemoPanel`) |
| `/backtest` | SMA 크로스 백테스팅 (`BacktestPanel`) |
| `GET /api/stock/[ticker]` | Yahoo Finance v8 프록시 (ISR 5분 캐싱) |
| `POST /api/backtest` | FastAPI 백엔드 프록시 |

### 데이터 흐름

**데모:** `StockDemoPanel` → `useStockData()` (React Query) → `/api/stock/[ticker]` → Yahoo Finance

**백테스트:** `BacktestPanel` → `useBacktest()` (React Query) → `/api/backtest` → FastAPI `backtest.py` → SMA-20/60 계산 + 신호 반환

### 백테스트 파라미터 변경

`backend/backtest.py` 상단 상수를 수정한다:

```python
SMA_SHORT = 20   # 단기 이동평균
SMA_LONG  = 60   # 장기 이동평균 (변경 시 워밍업 timedelta(days=130)도 조정)
```

### 새 종목 추가

1. `lib/types.ts` — `Ticker` 유니온에 코드 추가
2. `lib/constants.ts` — `TICKERS` 배열에 메타데이터 추가

## lightweight-charts v5 API

v4에서 변경된 사항이므로 주의:

```typescript
// v4 → v5 변경
chart.addSeries(CandlestickSeries, options)   // addCandlestickSeries() 대체
chart.addSeries(HistogramSeries, options)      // addHistogramSeries() 대체
chart.addSeries(LineSeries, options)

// 마커는 standalone 함수로 분리됨
createSeriesMarkers(series, markers)           // series.setMarkers() 대체

import { CandlestickSeries, HistogramSeries, LineSeries, createSeriesMarkers } from 'lightweight-charts'
```

## 경로 별칭

`@/*` → 프로젝트 루트. 예: `import { cn } from '@/lib/utils'`
