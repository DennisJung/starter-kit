import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Quant Starter Kit" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 gap-3">
      {/* 모바일: Sheet 사이드바 트리거 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 로고 + 타이틀 */}
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
      </div>

      <Separator orientation="vertical" className="h-5 hidden md:block" />

      {/* 우측 액션 영역 */}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
