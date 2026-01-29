import type { ReactNode } from "react";

type PageShellProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <section className={className ?? "space-y-6"}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
}
