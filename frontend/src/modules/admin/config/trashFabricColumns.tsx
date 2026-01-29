import { format } from "date-fns";
import type { Column } from "@/modules/shared";
import type { Fabric } from "@/modules/shared";

export const trashFabricColumns: Column<Fabric>[] = [
  { id: "fabric_no", header: "Fabric No", accessor: "fabric_no" },
  {
    id: "supplier",
    header: "Supplier",
    accessor: (row) => row.supplier?.company_name || "-",
  },
  { id: "composition", header: "Composition", accessor: "composition" },
  { id: "production_type", header: "Type", accessor: "production_type" },
  {
    id: "deleted_at",
    header: "Deleted At",
    accessor: (row) =>
      row.deleted_at ? format(new Date(row.deleted_at), "PP") : "-",
  },
];
