# Quant Backtesting Starter Kit

Yahoo Finance 데이터를 기반으로 한 주식 차트 시각화 및 퀀트 백테스팅 스타터 킷입니다.
Next.js 16 App Router + TradingView 경량 차트 + shadcn/ui로 구성되어 있으며, Phase 2에서 FastAPI 백엔드 연동 및 백테스팅 엔진이 추가될 예정입니다.

---

## 스크린샷

| 데모 차트 페이지 | 백테스트 페이지 (준비 중) |
|:-:|:-:|
| AAPL, SPY, SCHD 캔들스틱 차트 + 거래량 | SMA 크로스 전략 (Phase 2 예정) |

---

## 주요 기능

- **캔들스틱 차트**: TradingView 경량 차트(lightweight-charts v5)로 OHLCV 데이터 시각화
- **거래량 히스토그램**: 차트 하단에 거래량 바 차트 병렬 표시
- **종목 선택**: AAPL (애플), SPY (S&P 500 ETF), SCHD (배당 ETF)
- **기간 선택**: 1주일 / 2주일 / 1개월 / 3개월
- **다크/라이트 모드**: 시스템 설정 연동 또는 수동 전환
- **반응형 레이아웃**: 데스크톱 사이드바 + 모바일 Sheet 드로어
- **API 캐싱**: ISR 5분 설정으로 불필요한 Yahoo Finance 요청 최소화

---

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19 + TypeScript 5 |
| 스타일링 | Tailwind CSS v4 + shadcn/ui (new-york 스타일) |
| 차트 | lightweight-charts v5 (TradingView) |
| 서버 상태 | TanStack Query v5 |
| 유틸리티 | date-fns v3, lucide-react, Radix UI |

---

## 시작하기 (사용자)

### 요구사항

- Node.js 18.17 이상
- npm / yarn / pnpm / bun 중 하나

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/DennisJung/starter-kit.git
cd starter-kit

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열면 `/demo` 페이지로 자동 이동합니다.

### 사용 방법

1. 상단 드롭다운에서 종목을 선택합니다 (AAPL / SPY / SCHD)
2. 기간 버튼으로 차트 범위를 선택합니다 (1W / 2W / 1M / 3M)
3. 캔들스틱 차트와 주요 지표(현재가, 변동률, 52주 고/저가, 거래량)를 확인합니다
4. 우측 상단 토글로 다크/라이트 모드를 전환합니다

---

## 프로젝트 구조 (개발자)

```
.
├── app/
│   ├── api/stock/[ticker]/route.ts   # Yahoo Finance API 프록시 (캐싱 포함)
│   ├── demo/page.tsx                 # 데모 차트 페이지
│   ├── backtest/page.tsx             # 백테스트 페이지 (Phase 2)
│   ├── layout.tsx                    # 루트 레이아웃 (Provider 주입)
│   └── page.tsx                      # / → /demo 리다이렉트
│
├── components/
│   ├── layout/                       # Layer 1: AppShell, Header, Sidebar
│   ├── ui/                           # Layer 2: shadcn/ui 원자 컴포넌트
│   ├── composite/                    # Layer 3: MetricCard, StockSelector, EmptyState
│   └── features/
│       ├── chart/                    # Layer 4: CandlestickChart, ChartToolbar
│       └── stock/                    # Layer 4: StockDemoPanel, StockMetricsGrid
│
├── hooks/
│   ├── useStockData.ts               # React Query 기반 API 호출
│   ├── useTheme.ts                   # 다크/라이트 테마 상태
│   └── useMediaQuery.ts             # 반응형 브레이크포인트 감지
│
├── lib/
│   ├── types.ts                      # 공통 타입 (Ticker, OHLCVData 등)
│   ├── constants.ts                  # 종목 메타데이터, 기간 설정
│   ├── formatters.ts                 # 날짜/숫자 포맷터
│   └── utils.ts                      # cn() 등 유틸리티
│
└── providers/
    └── QueryProvider.tsx             # TanStack Query 설정
```

### 컴포넌트 5계층 구조

```
Layer 1 → Layout    : AppShell / Header / Sidebar
Layer 2 → UI        : shadcn/ui 원자 컴포넌트 (Button, Card, Sheet 등)
Layer 3 → Composite : StockSelector / MetricCard / EmptyState
Layer 4 → Features  : CandlestickChart / StockDemoPanel
Layer 5 → Pages     : app/demo/page.tsx / app/backtest/page.tsx
```

### 데이터 흐름

```
사용자 (ticker, period 선택)
  ↓
StockDemoPanel → useStockData() [React Query]
  ↓
GET /api/stock/[ticker]?from=&to=   [Next.js API Route, ISR 5분]
  ↓
Yahoo Finance v8 Chart API
  ↓
OHLCV 정규화 (null 필터링, 소수점 2자리)
  ↓
CandlestickChart (lightweight-charts v5)
StockMetricsGrid (MetricCard 목록)
```

### API 레퍼런스

#### `GET /api/stock/[ticker]`

| 파라미터 | 타입 | 예시 | 설명 |
|---------|------|------|------|
| `ticker` | path | `AAPL` | 종목 코드 |
| `from` | query | `2024-01-01` | 시작일 (YYYY-MM-DD) |
| `to` | query | `2024-03-31` | 종료일 (YYYY-MM-DD) |

**응답 예시:**
```json
[
  { "time": "2024-01-02", "open": 185.64, "high": 186.99, "low": 183.74, "close": 185.20, "volume": 70893280 }
]
```

### 주요 타입

```typescript
type Ticker = "AAPL" | "SPY" | "SCHD";

interface OHLCVData {
  time: string;      // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type ChartPeriod = "1W" | "2W" | "1M" | "3M";
```

### 새 종목 추가 방법

1. `lib/types.ts` — `Ticker` 유니온에 종목 코드 추가
2. `lib/constants.ts` — `TICKERS` 배열에 메타데이터 추가

```typescript
// lib/constants.ts 예시
{ value: "QQQ", label: "QQQ", description: "나스닥 100 ETF" }
```

### 스크립트

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 로드맵

| Phase | 상태 | 내용 |
|-------|------|------|
| Phase 1 | ✅ 완료 | Yahoo Finance 연동, 캔들스틱 차트, 반응형 레이아웃 |
| Phase 2 | 🚧 예정 | FastAPI 백엔드 + SMA 크로스 백테스팅 엔진 |
| Phase 3 | 📋 계획 | 수익률/샤프지수/MDD 리포트, 전략 파라미터 튜닝 UI |

---

## 라이선스

MIT
