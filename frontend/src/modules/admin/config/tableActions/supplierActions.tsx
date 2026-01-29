import type { Supplier } from "@/modules/shared";
import { createCrudActions } from "./createCrudActions";

export const createSupplierActions = ({
  onDeleteRequest,
  isDeleting,
}: {
  onDeleteRequest: (id: string) => void;
  isDeleting?: boolean;
}) =>
  createCrudActions<Supplier>({
    getViewPath: (s) => `/admin/suppliers/${s.id}`,
    getEditPath: (s) => `/admin/suppliers/${s.id}/edit`,
    onDeleteRequest,
    isDeleting,
  });
