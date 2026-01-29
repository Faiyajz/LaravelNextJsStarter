import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import { Button } from "@/modules/shared";
import { notify } from "@/modules/shared";
import { PageShell, Panel } from "@/modules/shared";
import { useListFilters } from "@/modules/shared";
import { DataTable } from "@/modules/shared";
import { ConfirmDialog } from "@/modules/shared";
import FabricFilters, {
  type FabricFilters as FabricFiltersType,
} from "@/modules/admin/fabrics/components/FabricFilters";
import { fabricColumns } from "@/modules/admin/config/fabricColumns";
import { createFabricActions } from "@/modules/admin/config/tableActions/fabricActions";

const DEFAULT_FILTERS: FabricFiltersType = {
  search: "",
  fabricNo: "",
  composition: "",
  productionType: "",
  supplier: "",
};

export default function FabricsListPage() {
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
  } = useListFilters<FabricFiltersType>(DEFAULT_FILTERS);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryKey = ["fabrics", page, perPage, debouncedFilters] as const;

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      fabricService.getAll({
        page,
        per_page: perPage,
        search: debouncedFilters.search,
        fabric_no: debouncedFilters.fabricNo,
        composition: debouncedFilters.composition,
        production_type: debouncedFilters.productionType,
        supplier: debouncedFilters.supplier,
      }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fabricService.delete(id),
    onSuccess: async () => {
      notify.success("Fabric deleted successfully");
      setConfirmOpen(false);
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["fabrics"] });
    },
    onError: () => notify.error("Failed to delete fabric"),
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
      createFabricActions({
        onDeleteRequest: requestDelete,
        isDeleting: deleteMutation.isPending,
      }),
    [deleteMutation.isPending],
  );

  return (
    <PageShell
      title="Fabrics"
      description="Track fabric specifications, rolls, and sourcing metadata."
      actions={
        <>
          <Button variant="outline" type="button" onClick={clearFilters}>
            Clear Filters
          </Button>

          <Link to="/admin/fabrics/create">
            <Button>Add Fabric</Button>
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
          <FabricFilters filters={filters} onUpdateFilters={updateFilters} />
        </div>
      </Panel>

      <DataTable
        data={data?.data ?? []}
        columns={fabricColumns}
        isLoading={isLoading}
        emptyMessage="No fabrics found"
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
        title="Delete fabric?"
        description="This action cannot be undone."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        confirmDisabled={deleteMutation.isPending}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
}
