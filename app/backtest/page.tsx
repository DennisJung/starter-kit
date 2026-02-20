import { ContentArea } from "@/components/layout/ContentArea";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/composite/EmptyState";
import { TrendingUp } from "lucide-react";

export default function BacktestPage() {
  return (
    <ContentArea>
      <PageHeader
        title="백테스트"
        description="SMA 크로스 전략을 기반으로 백테스팅을 실행합니다."
      />
      <EmptyState
        title="백테스트 기능 준비 중"
        description="Phase 2에서 FastAPI 백엔드와 연동하여 SMA 골든크로스 전략 백테스팅을 지원할 예정입니다."
        icon={TrendingUp}
        className="h-64"
      />
    </ContentArea>
  );
}
