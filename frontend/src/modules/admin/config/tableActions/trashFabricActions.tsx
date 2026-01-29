import type { Fabric } from "@/modules/shared";

interface TrashFabricActionsConfig {
  onRestoreRequest: (id: string) => void;
  isRestoring: boolean;
}

export function createTrashFabricActions({
  onRestoreRequest,
  isRestoring,
}: TrashFabricActionsConfig) {
  return (fabric: Fabric) => (
    <button
      type="button"
      onClick={() => onRestoreRequest(String(fabric.id))}
      disabled={isRestoring}
      className="text-green-600 hover:text-green-900 disabled:opacity-50"
    >
      {isRestoring ? "Restoring..." : "Restore"}
    </button>
  );
}
