import { ContentArea } from "@/components/layout/ContentArea";
import { PageHeader } from "@/components/layout/PageHeader";
import { StockDemoPanel } from "@/components/features/stock/StockDemoPanel";

export default function DemoPage() {
  return (
    <ContentArea>
      <PageHeader
        title="데모 차트"
        description="AAPL, SPY, SCHD 종목의 캔들스틱 차트를 확인하세요."
      />
      <StockDemoPanel />
    </ContentArea>
  );
}
