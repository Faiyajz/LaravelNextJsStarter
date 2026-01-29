import type { ReactNode } from "react";

import { Panel } from "@/modules/shared/components/layout/Panel";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon: ReactNode;
  action?: ReactNode;
  tone?: "amber" | "sky" | "emerald";
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  amber: "bg-amber-100 text-amber-600",
  sky: "bg-sky-100 text-sky-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

export function StatCard({
  label,
  value,
  delta,
  icon,
  action,
  tone = "amber",
}: StatCardProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900 mt-2">{value}</h3>
          {delta ? <p className="text-sm text-slate-500 mt-2">{delta}</p> : null}
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${toneStyles[tone]}`}
        >
          {icon}
        </div>
      </div>
      {action ? <div className="mt-6">{action}</div> : null}
    </Panel>
  );
}
