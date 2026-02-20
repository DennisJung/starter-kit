import { ContentArea } from "@/components/layout/ContentArea";
import { PageHeader } from "@/components/layout/PageHeader";
import { BacktestPanel } from "@/components/features/backtest/BacktestPanel";

export default function BacktestPage() {
  return (
    <ContentArea>
      <PageHeader
        title="백테스트"
        description="SMA 크로스 전략을 기반으로 백테스팅을 실행합니다."
      />
      <BacktestPanel />
    </ContentArea>
  );
}
