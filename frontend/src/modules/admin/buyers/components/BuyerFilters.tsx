import type { ChangeEvent } from "react";
import { Button } from "@/modules/shared";

export type BuyerFilters = {
  search: string;
  companyName: string;
  country: string;
};

interface BuyerFiltersProps {
  filters: BuyerFilters;
  onUpdateFilters: (next: Partial<BuyerFilters>) => void;
}

export default function BuyerFilters({
  filters,
  onUpdateFilters,
}: BuyerFiltersProps) {
  const handleChange =
    (key: keyof BuyerFilters) => (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateFilters({ [key]: event.target.value });
    };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <input
        value={filters.search}
        onChange={handleChange("search")}
        placeholder="Search name, email, company..."
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
      <input
        value={filters.companyName}
        onChange={handleChange("companyName")}
        placeholder="Company name"
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
      <input
        value={filters.country}
        onChange={handleChange("country")}
        placeholder="Country"
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
      />
      <div className="md:col-span-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onUpdateFilters({ search: "", companyName: "", country: "" })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
