"""SMA 크로스 전략 백테스팅 라우터"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import numpy as np

router = APIRouter()

# SMA 파라미터 (고정)
SMA_SHORT = 20
SMA_LONG = 60
INITIAL_CAPITAL = 1_000_000  # 초기 자본 (원)


# ─── 요청/응답 스키마 ────────────────────────────────────────────────────────

class BacktestRequest(BaseModel):
    ticker: str
    from_date: str  # "YYYY-MM-DD"
    to_date: str    # "YYYY-MM-DD"


class Signal(BaseModel):
    date: str
    type: str   # "buy" | "sell"
    price: float


class EquityPoint(BaseModel):
    time: str   # "YYYY-MM-DD"
    value: float


class BacktestMetrics(BaseModel):
    total_return: float     # 소수 (예: 0.1234 = 12.34%)
    sharpe_ratio: float
    max_drawdown: float     # 음수 (예: -0.082 = -8.2%)
    win_rate: float         # 소수 (예: 0.6 = 60%)
    trade_count: int


class BacktestResponse(BaseModel):
    signals: list[Signal]
    equity_curve: list[EquityPoint]
    metrics: BacktestMetrics


# ─── 백테스트 엔드포인트 ─────────────────────────────────────────────────────

@router.post("/sma", response_model=BacktestResponse)
def run_sma_backtest(req: BacktestRequest):
    """SMA 골든크로스/데드크로스 전략 백테스팅"""

    # Yahoo Finance 데이터 조회
    try:
        df = yf.download(
            req.ticker,
            start=req.from_date,
            end=req.to_date,
            progress=False,
            auto_adjust=True,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"데이터 조회 실패: {e}")

    if df.empty or len(df) < SMA_LONG:
        raise HTTPException(
            status_code=400,
            detail=f"SMA-{SMA_LONG} 계산을 위해 최소 {SMA_LONG}개 거래일 데이터가 필요합니다."
        )

    # Close 컬럼 추출 (yfinance MultiIndex 대응)
    raw_close = df["Close"]
    if isinstance(raw_close, pd.DataFrame):
        raw_close = raw_close.iloc[:, 0]

    # 깔끔한 단일 DataFrame으로 재구성
    work = pd.DataFrame(index=raw_close.index)
    work["close"] = raw_close.values
    work["sma_short"] = work["close"].rolling(SMA_SHORT).mean()
    work["sma_long"] = work["close"].rolling(SMA_LONG).mean()

    # NaN 제거 (SMA 워밍업 기간)
    work = work.dropna(subset=["sma_short", "sma_long"])

    # 크로스 신호 감지
    work["position"] = (work["sma_short"] > work["sma_long"]).astype(int)
    work["signal"] = work["position"].diff()

    # 포지션 시뮬레이션
    capital = float(INITIAL_CAPITAL)
    holding = 0.0           # 보유 주수
    entry_price = 0.0       # 매수 단가

    signals: list[Signal] = []
    equity_curve: list[EquityPoint] = []
    trades: list[dict] = []  # 완료된 거래 (수익률 계산용)

    for date, row in work.iterrows():
        date_str = date.strftime("%Y-%m-%d")
        price = float(row["close"])
        sig = float(row["signal"])

        # 매수 신호 (골든크로스)
        if sig == 1.0 and holding == 0:
            holding = capital / price
            entry_price = price
            capital = 0.0
            signals.append(Signal(date=date_str, type="buy", price=round(price, 2)))

        # 매도 신호 (데드크로스)
        elif sig == -1.0 and holding > 0:
            capital = holding * price
            trade_return = (price - entry_price) / entry_price
            trades.append({"return": trade_return})
            signals.append(Signal(date=date_str, type="sell", price=round(price, 2)))
            holding = 0.0

        # 포트폴리오 가치 (초기 자본 대비 퍼센트로 정규화)
        portfolio_value = capital + holding * price
        equity_curve.append(EquityPoint(
            time=date_str,
            value=round(portfolio_value / INITIAL_CAPITAL * 100, 4)
        ))

    # 포지션 청산 (기간 말 보유 중이면 종가 기준 청산)
    if holding > 0:
        last_price = float(work.iloc[-1]["close"])
        capital = holding * last_price
        trade_return = (last_price - entry_price) / entry_price
        trades.append({"return": trade_return})

    # ─── 성과 지표 계산 ───────────────────────────────────────────────────────

    final_value = capital + holding * float(work.iloc[-1]["close"])
    total_return = (final_value - INITIAL_CAPITAL) / INITIAL_CAPITAL

    # 샤프지수 (일간 수익률 기준, 무위험 수익률 0 가정)
    portfolio_values = [p.value for p in equity_curve]
    daily_returns = pd.Series(portfolio_values).pct_change().dropna()
    sharpe = (
        float(daily_returns.mean() / daily_returns.std() * np.sqrt(252))
        if daily_returns.std() > 0 else 0.0
    )

    # MDD (최대낙폭)
    pv_series = pd.Series(portfolio_values)
    peak = pv_series.cummax()
    drawdown = (pv_series - peak) / peak
    max_drawdown = float(drawdown.min())

    # 승률
    winning = [t for t in trades if t["return"] > 0]
    win_rate = len(winning) / len(trades) if trades else 0.0

    metrics = BacktestMetrics(
        total_return=round(total_return, 4),
        sharpe_ratio=round(sharpe, 4),
        max_drawdown=round(max_drawdown, 4),
        win_rate=round(win_rate, 4),
        trade_count=len(trades),
    )

    return BacktestResponse(
        signals=signals,
        equity_curve=equity_curve,
        metrics=metrics,
    )
