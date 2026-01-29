export type SupplierFilters = {
  search: string;
  companyName: string;
  representativeName: string;
  country: string;
  dateFrom: string;
  dateTo: string;
};

interface SupplierFiltersProps {
  filters: SupplierFilters;
  onUpdateFilters: (patch: Partial<SupplierFilters>) => void;
}

export default function SupplierFilters({
  filters,
  onUpdateFilters,
}: SupplierFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 bg-white p-4 rounded-lg border">
      <input
        type="text"
        placeholder="Search (code, email, etc.)"
        value={filters.search}
        onChange={(e) => onUpdateFilters({ search: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Company Name"
        value={filters.companyName}
        onChange={(e) => onUpdateFilters({ companyName: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Representative Name"
        value={filters.representativeName}
        onChange={(e) =>
          onUpdateFilters({ representativeName: e.target.value })
        }
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Country"
        value={filters.country}
        onChange={(e) => onUpdateFilters({ country: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onUpdateFilters({ dateFrom: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onUpdateFilters({ dateTo: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  );
}

export type { SupplierFilters };
