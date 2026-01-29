import type { Buyer } from "@/modules/shared";
import { createCrudActions } from "./createCrudActions";

export const createBuyerActions = ({
  onDeleteRequest,
  isDeleting,
}: {
  onDeleteRequest: (id: string) => void;
  isDeleting?: boolean;
}) =>
  createCrudActions<Buyer>({
    getViewPath: (buyer) => `/admin/buyers/${buyer.id}`,
    getEditPath: (buyer) => `/admin/buyers/${buyer.id}/edit`,
    onDeleteRequest,
    isDeleting,
  });
