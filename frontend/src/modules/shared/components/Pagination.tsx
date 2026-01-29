import * as React from "react";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/modules/shared/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;

  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;

  perPageOptions?: number[];
  siblingCount?: number;
}

type PageItem = number | "ellipsis";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPageItems(
  currentPage: number,
  lastPage: number,
  siblingCount: number,
): PageItem[] {
  const maxVisible = siblingCount * 2 + 5;
  if (lastPage <= maxVisible) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblingCount, 2);
  const right = Math.min(currentPage + siblingCount, lastPage - 1);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < lastPage - 1;

  const items: PageItem[] = [1];

  if (showLeftEllipsis) items.push("ellipsis");
  for (let p = left; p <= right; p++) items.push(p);
  if (showRightEllipsis) items.push("ellipsis");

  items.push(lastPage);
  return items;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50, 100],
  siblingCount = 1,
}: PaginationProps) {
  const safeLast = Math.max(1, lastPage);
  const safeCurrent = clamp(currentPage, 1, safeLast);

  const startItem = total === 0 ? 0 : (safeCurrent - 1) * perPage + 1;
  const endItem = total === 0 ? 0 : Math.min(safeCurrent * perPage, total);

  const items = React.useMemo(
    () => getPageItems(safeCurrent, safeLast, siblingCount),
    [safeCurrent, safeLast, siblingCount],
  );

  const canPrev = safeCurrent > 1;
  const canNext = safeCurrent < safeLast;

  const goTo = (p: number) => onPageChange(clamp(p, 1, safeLast));

  const handlePerPageChange = (value: string) => {
    const next = Number(value);
    onPerPageChange(next);
    onPageChange(1);
  };

  return (
    <div className="w-full border-t px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: range text */}
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> results
        </p>

        {/* Right: rows-per-page + pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
              <SelectTrigger className="h-9 w-27.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination controls */}
          <ShadPagination className="w-full sm:w-auto">
            <PaginationContent className="w-full justify-between sm:justify-end">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (canPrev) goTo(safeCurrent - 1);
                  }}
                  className={
                    !canPrev ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>

              <div className="hidden sm:flex items-center">
                {items.map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  const active = item === safeCurrent;

                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={active}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!active) goTo(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </div>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (canNext) goTo(safeCurrent + 1);
                  }}
                  className={
                    !canNext ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </ShadPagination>
        </div>
      </div>
    </div>
  );
}
