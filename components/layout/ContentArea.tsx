import { cn } from "@/lib/utils";

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main className={cn("flex-1 overflow-auto", className)}>
      <div className="container mx-auto max-w-7xl p-6">
        {children}
      </div>
    </main>
  );
}
