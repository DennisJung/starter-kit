import { NextRequest, NextResponse } from "next/server";
import { FASTAPI_BASE_URL } from "@/lib/constants";

// FastAPI 백엔드로 백테스트 요청 프록시
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/backtest/sma`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail ?? "백테스트 실패" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "FastAPI 서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요." },
      { status: 503 }
    );
  }
}
