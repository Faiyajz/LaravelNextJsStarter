import type { Fabric } from "@/modules/shared";
import { createCrudActions } from "./createCrudActions";

export const createFabricActions = ({
  onDeleteRequest,
  isDeleting,
}: {
  onDeleteRequest: (id: string) => void;
  isDeleting?: boolean;
}) =>
  createCrudActions<Fabric>({
    getViewPath: (f) => `/admin/fabrics/${f.id}`,
    getEditPath: (f) => `/admin/fabrics/${f.id}/edit`,
    onDeleteRequest,
    isDeleting,
  });
