import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { buyerService } from "@/modules/admin/buyers/services/buyer.service";
import { Button, ConfirmDialog, DataTable, notify, PageShell, Panel, useListFilters } from "@/modules/shared";
import BuyerFilters, { type BuyerFilters as BuyerFiltersType } from "@/modules/admin/buyers/components/BuyerFilters";
import { buyerColumns } from "@/modules/admin/config/buyerColumns";
import { createBuyerActions } from "@/modules/admin/config/tableActions/buyerActions";

const DEFAULT_FILTERS: BuyerFiltersType = {
  search: "",
  companyName: "",
  country: "",
};

export default function BuyersListPage() {
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
  } = useListFilters<BuyerFiltersType>(DEFAULT_FILTERS);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryKey = ["buyers", page, perPage, debouncedFilters] as const;

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      buyerService.getAll({
        page,
        per_page: perPage,
        search: debouncedFilters.search,
        company_name: debouncedFilters.companyName,
        country: debouncedFilters.country,
      }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => buyerService.delete(id),
    onSuccess: async () => {
      notify.success("Buyer deleted successfully");
      setConfirmOpen(false);
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["buyers"] });
    },
    onError: () => notify.error("Failed to delete buyer"),
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
      createBuyerActions({
        onDeleteRequest: requestDelete,
        isDeleting: deleteMutation.isPending,
      }),
    [deleteMutation.isPending],
  );

  return (
    <PageShell
      title="Buyers"
      description="Manage buyer accounts and profile details."
      actions={
        <Button variant="outline" type="button" onClick={clearFilters}>
          Clear Filters
        </Button>
      }
    >
      <Panel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {isFetching && !isLoading ? "Updating results…" : "Filters"}
          </p>
          <Link to="/admin">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
        <div className="mt-4">
          <BuyerFilters filters={filters} onUpdateFilters={updateFilters} />
        </div>
      </Panel>

      <DataTable
        data={data?.data ?? []}
        columns={buyerColumns}
        isLoading={isLoading}
        emptyMessage="No buyers found"
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
        title="Delete buyer?"
        description="This action will remove the buyer account."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        confirmDisabled={deleteMutation.isPending}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
}
