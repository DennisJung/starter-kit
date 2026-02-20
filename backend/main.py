"""Quant Backtest API - FastAPI 메인 앱"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backtest import router as backtest_router

app = FastAPI(
    title="Quant Backtest API",
    description="SMA 크로스 전략 기반 백테스팅 API",
    version="1.0.0",
)

# CORS 설정 (Next.js 개발 서버 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(backtest_router, prefix="/backtest", tags=["backtest"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
