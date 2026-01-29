import type { Supplier } from "@/modules/shared";

interface TrashSupplierActionsConfig {
  onRestoreRequest: (id: string) => void;
  isRestoring: boolean;
}

export function createTrashSupplierActions({
  onRestoreRequest,
  isRestoring,
}: TrashSupplierActionsConfig) {
  return (supplier: Supplier) => (
    <button
      type="button"
      onClick={() => onRestoreRequest(String(supplier.id))}
      disabled={isRestoring}
      className="text-green-600 hover:text-green-900 disabled:opacity-50"
    >
      {isRestoring ? "Restoring..." : "Restore"}
    </button>
  );
}
