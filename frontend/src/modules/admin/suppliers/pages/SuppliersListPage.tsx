import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import { Button } from "@/modules/shared";
import { notify } from "@/modules/shared";
import { PageShell, Panel } from "@/modules/shared";
import { useListFilters } from "@/modules/shared";
import { DataTable } from "@/modules/shared";
import { ConfirmDialog } from "@/modules/shared";
import SupplierFilters, {
  type SupplierFilters as SupplierFiltersType,
} from "@/modules/admin/suppliers/components/SupplierFilters";
import { supplierColumns } from "@/modules/admin/config/supplierColumns";
import { createSupplierActions } from "@/modules/admin/config/tableActions/supplierActions";

const DEFAULT_FILTERS: SupplierFiltersType = {
  search: "",
  companyName: "",
  representativeName: "",
  country: "",
  dateFrom: "",
  dateTo: "",
};

export default function SuppliersListPage() {
  const queryClient = useQueryClient();

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    filters,
    debouncedFilters,
    updateFilters,
    clearFilters,
  } = useListFilters<SupplierFiltersType>(DEFAULT_FILTERS);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryKey = ["suppliers", page, perPage, debouncedFilters] as const;

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      supplierService.getAll({
        page,
        per_page: perPage,
        search: debouncedFilters.search,
        company_name: debouncedFilters.companyName,
        representative_name: debouncedFilters.representativeName,
        country: debouncedFilters.country,
        date_from: debouncedFilters.dateFrom,
        date_to: debouncedFilters.dateTo,
      }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: async () => {
      notify.success("Supplier deleted successfully");
      setConfirmOpen(false);
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => notify.error("Failed to delete supplier"),
  });

  const requestDelete = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId);
  };

  const actions = useMemo(
    () =>
      createSupplierActions({
        onDeleteRequest: requestDelete,
        isDeleting: deleteMutation.isPending,
      }),
    [deleteMutation.isPending],
  );

  return (
    <PageShell
      title="Suppliers"
      description="Manage supplier profiles, contacts, and sourcing relationships."
      actions={
        <>
          <Button variant="outline" type="button" onClick={clearFilters}>
            Clear Filters
          </Button>

          <Link to="/admin/suppliers/create">
            <Button>Add Supplier</Button>
          </Link>
        </>
      }
    >
      <Panel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {isFetching && !isLoading ? "Updating results…" : "Filters"}
          </p>
        </div>
        <div className="mt-4">
          <SupplierFilters filters={filters} onUpdateFilters={updateFilters} />
        </div>
      </Panel>

      <DataTable
        data={data?.data ?? []}
        columns={supplierColumns}
        isLoading={isLoading}
        emptyMessage="No suppliers found"
        currentPage={data?.meta.current_page}
        lastPage={data?.meta.last_page}
        total={data?.meta.total}
        perPage={data?.meta.per_page}
        onPageChange={setPage}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
        actions={actions}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSelectedId(null);
        }}
        title="Delete supplier?"
        description="This action cannot be undone."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        confirmDisabled={deleteMutation.isPending}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
}
