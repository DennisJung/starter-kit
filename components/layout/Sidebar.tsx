import Link from "next/link";
import { BarChart3, TrendingUp, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

const NAV_ITEMS: NavItem[] = [
  { label: "데모 차트", href: "/demo", icon: BarChart3 },
  { label: "백테스트", href: "/backtest", icon: TrendingUp },
];

/** 사이드바 내부 콘텐츠 (Sheet 모바일 버전에서도 재사용) */
export function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 p-3 pt-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* 하단 유틸리티 */}
      <div className="border-t p-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </div>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
      </div>
      {item.badge && (
        <span className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/** 데스크탑 사이드바 */
export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 flex-col border-r bg-background">
      <SidebarContent />
    </aside>
  );
}
