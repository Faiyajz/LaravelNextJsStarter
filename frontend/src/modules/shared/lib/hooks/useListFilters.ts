import { useState } from "react";
import { useDebouncedValue } from "@/modules/shared/lib/hooks/useDebouncedValue";

export function useListFilters<T extends Record<string, unknown>>(
  defaults: T,
  debounceMs = 400,
) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<T>(defaults);

  const debouncedFilters = useDebouncedValue(filters, debounceMs);

  const updateFilters = (patch: Partial<T>) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters(defaults);
  };

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    filters,
    setFilters,
    debouncedFilters,
    updateFilters,
    clearFilters,
  };
}
