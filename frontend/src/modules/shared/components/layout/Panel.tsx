import type { ReactNode } from "react";

import { cn } from "@/modules/shared/lib/utils";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
