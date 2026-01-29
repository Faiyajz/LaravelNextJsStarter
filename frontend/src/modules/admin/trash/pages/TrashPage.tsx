import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import { notify } from "@/modules/shared";
import { PageShell, Panel } from "@/modules/shared";
import { DataTable } from "@/modules/shared";
import { ConfirmDialog } from "@/modules/shared";
import { trashSupplierColumns } from "@/modules/admin/config/trashSupplierColumns";
import { trashFabricColumns } from "@/modules/admin/config/trashFabricColumns";
import { createTrashSupplierActions } from "@/modules/admin/config/tableActions/trashSupplierActions";
import { createTrashFabricActions } from "@/modules/admin/config/tableActions/trashFabricActions";

type TrashType = "suppliers" | "fabrics";

export default function TrashPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TrashType>("suppliers");
  const [supplierPage, setSupplierPage] = useState(1);
  const [fabricPage, setFabricPage] = useState(1);
  const [supplierPerPage, setSupplierPerPage] = useState(10);
  const [fabricPerPage, setFabricPerPage] = useState(10);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TrashType>("suppliers");

  // Fetch trashed suppliers
  const { data: suppliersData, isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers", "trash", supplierPage, supplierPerPage],
    queryFn: () =>
      supplierService.getTrash({
        page: supplierPage,
        per_page: supplierPerPage,
      }),
    enabled: activeTab === "suppliers",
    placeholderData: (prev) => prev,
  });

  // Fetch trashed fabrics
  const { data: fabricsData, isLoading: fabricsLoading } = useQuery({
    queryKey: ["fabrics", "trash", fabricPage, fabricPerPage],
    queryFn: () =>
      fabricService.getTrash({ page: fabricPage, per_page: fabricPerPage }),
    enabled: activeTab === "fabrics",
    placeholderData: (prev) => prev,
  });

  // Restore supplier mutation
  const restoreSupplierMutation = useMutation({
    mutationFn: (id: string) => supplierService.restore(id),
    onSuccess: async () => {
      notify.success("Supplier restored successfully");
      setConfirmOpen(false);
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["suppliers", "trash"] });
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => notify.error("Failed to restore supplier"),
  });

  // Restore fabric mutation
  const restoreFabricMutation = useMutation({
    mutationFn: (id: string) => fabricService.restore(id),
    onSuccess: async () => {
      notify.success("Fabric restored successfully");
      setConfirmOpen(false);
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["fabrics", "trash"] });
      await queryClient.invalidateQueries({ queryKey: ["fabrics"] });
    },
    onError: () => notify.error("Failed to restore fabric"),
  });

  const requestRestore = (id: string, type: TrashType) => {
    setSelectedId(id);
    setSelectedType(type);
    setConfirmOpen(true);
  };

  const confirmRestore = () => {
    if (!selectedId) return;

    if (selectedType === "suppliers") {
      restoreSupplierMutation.mutate(selectedId);
    } else {
      restoreFabricMutation.mutate(selectedId);
    }
  };

  const supplierActions = useMemo(
    () =>
      createTrashSupplierActions({
        onRestoreRequest: (id) => requestRestore(id, "suppliers"),
        isRestoring: restoreSupplierMutation.isPending,
      }),
    [restoreSupplierMutation.isPending],
  );

  const fabricActions = useMemo(
    () =>
      createTrashFabricActions({
        onRestoreRequest: (id) => requestRestore(id, "fabrics"),
        isRestoring: restoreFabricMutation.isPending,
      }),
    [restoreFabricMutation.isPending],
  );

  return (
    <PageShell
      title="Trash"
      description="Recover archived suppliers and fabrics."
    >
      <Panel className="p-0">
        <div className="border-b border-slate-200 px-6">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab("suppliers")}
              className={[
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "suppliers"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Suppliers{suppliersData ? ` (${suppliersData.meta.total})` : ""}
            </button>
            <button
              onClick={() => setActiveTab("fabrics")}
              className={[
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "fabrics"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Fabrics{fabricsData ? ` (${fabricsData.meta.total})` : ""}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "suppliers" && (
            <DataTable
              data={suppliersData?.data ?? []}
              columns={trashSupplierColumns}
              isLoading={suppliersLoading}
              emptyMessage="No deleted suppliers"
              currentPage={suppliersData?.meta.current_page}
              lastPage={suppliersData?.meta.last_page}
              total={suppliersData?.meta.total}
              perPage={suppliersData?.meta.per_page}
              onPageChange={setSupplierPage}
              onPerPageChange={(newPerPage) => {
                setSupplierPerPage(newPerPage);
                setSupplierPage(1);
              }}
              actions={supplierActions}
            />
          )}

          {activeTab === "fabrics" && (
            <DataTable
              data={fabricsData?.data ?? []}
              columns={trashFabricColumns}
              isLoading={fabricsLoading}
              emptyMessage="No deleted fabrics"
              currentPage={fabricsData?.meta.current_page}
              lastPage={fabricsData?.meta.last_page}
              total={fabricsData?.meta.total}
              perPage={fabricsData?.meta.per_page}
              onPageChange={setFabricPage}
              onPerPageChange={(newPerPage) => {
                setFabricPerPage(newPerPage);
                setFabricPage(1);
              }}
              actions={fabricActions}
            />
          )}
        </div>
      </Panel>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSelectedId(null);
        }}
        title={`Restore ${selectedType === "suppliers" ? "supplier" : "fabric"}?`}
        description="This will restore the item from trash."
        confirmText={
          restoreSupplierMutation.isPending || restoreFabricMutation.isPending
            ? "Restoring..."
            : "Restore"
        }
        confirmDisabled={
          restoreSupplierMutation.isPending || restoreFabricMutation.isPending
        }
        variant="default"
        onConfirm={confirmRestore}
      />
    </PageShell>
  );
}
