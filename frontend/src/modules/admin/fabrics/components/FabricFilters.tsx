import { PRODUCTION_TYPES, type ProductionType } from "@/modules/shared";

export type FabricFilters = {
  search: string;
  fabricNo: string;
  composition: string;
  productionType: ProductionType | "";
  supplier: string;
};

interface FabricFiltersProps {
  filters: FabricFilters;
  onUpdateFilters: (patch: Partial<FabricFilters>) => void;
}

export default function FabricFilters({
  filters,
  onUpdateFilters,
}: FabricFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 bg-white p-4 rounded-lg shadow">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => onUpdateFilters({ search: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Fabric No"
        value={filters.fabricNo}
        onChange={(e) => onUpdateFilters({ fabricNo: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Composition"
        value={filters.composition}
        onChange={(e) => onUpdateFilters({ composition: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Supplier"
        value={filters.supplier}
        onChange={(e) => onUpdateFilters({ supplier: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
      />

      <div className="relative">
        <select
          value={filters.productionType}
          onChange={(e) =>
            onUpdateFilters({
              productionType: e.target.value as ProductionType | "",
            })
          }
          className="w-full px-3 py-2 border rounded-md bg-white appearance-none pr-10"
        >
          <option value="">All Types</option>
          {PRODUCTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export type { FabricFilters };
