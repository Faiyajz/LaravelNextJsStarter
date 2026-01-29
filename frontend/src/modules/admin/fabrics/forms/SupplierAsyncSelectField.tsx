import { useMemo, useState } from "react";
import { useFormikContext, getIn, type FormikValues } from "formik";
import { useQuery } from "@tanstack/react-query";

import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import { useDebouncedValue } from "@/modules/shared";

type SupplierOption = {
  id: string;
  company_name: string;
  code: string;
  country: string;
};

type SupplierAsyncSelectFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  containerClassName?: string;
  perPage?: number;
};

export function SupplierAsyncSelectField({
  name,
  label,
  required,
  containerClassName,
  perPage = 10,
}: SupplierAsyncSelectFieldProps) {
  const { setFieldValue, values, errors, touched } =
    useFormikContext<FormikValues>();
  const fieldValue = getIn(values, name);
  const error = getIn(touched, name) && getIn(errors, name);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["suppliers", "search", debouncedSearch, page, perPage],
    queryFn: () =>
      supplierService.getAll({
        page,
        per_page: perPage,
        search: debouncedSearch,
      }),
    placeholderData: (prev) => prev,
  });

  const selectedId = fieldValue ? String(fieldValue) : "";

  const { data: selectedSupplier } = useQuery({
    queryKey: ["supplier", selectedId],
    queryFn: () => supplierService.getById(selectedId),
    enabled: Boolean(selectedId),
  });

  const options = useMemo(() => {
    const list = (data?.data ?? []) as SupplierOption[];
    const selected = selectedSupplier as SupplierOption | undefined;
    if (selected) {
      const exists = list.some((s) => String(s.id) === String(selected.id));
      return exists ? list : [selected, ...list];
    }
    if (selectedId) {
      return [
        { id: selectedId, company_name: "Loading selection...", code: "", country: "" },
        ...list,
      ];
    }
    return list;
  }, [data?.data, selectedSupplier, selectedId]);

  const currentPage = data?.meta.current_page ?? 1;
  const lastPage = data?.meta.last_page ?? 1;
  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;

  return (
    <div className={containerClassName}>
      <label htmlFor={`${name}-search`} className="block text-sm font-medium text-gray-700">
        {label} {required ? "*" : null}
      </label>

      <input
        id={`${name}-search`}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search suppliers..."
        className="mt-1 block w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-primary focus:border-primary"
      />

      <select
        id={name}
        className={[
          "mt-2 block w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-primary focus:border-primary",
          error ? "border-red-500" : "border-gray-300",
        ].join(" ")}
        value={selectedId}
        onChange={(e) => setFieldValue(name, e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.code
              ? `${opt.company_name} (${opt.code})`
              : opt.company_name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isLoading || isFetching ? "Loading..." : `Page ${currentPage} of ${lastPage}`}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
