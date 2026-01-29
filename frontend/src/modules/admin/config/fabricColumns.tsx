import type { Column } from "@/modules/shared";
import type { Fabric } from "@/modules/shared";

export const fabricColumns: Column<Fabric>[] = [
  { id: "fabric_no", header: "Fabric No", accessor: "fabric_no" },
  {
    id: "supplier",
    header: "Supplier",
    accessor: (row) => row.supplier?.company_name || "-",
  },
  { id: "composition", header: "Composition", accessor: "composition" },
  { id: "gsm", header: "GSM", accessor: "gsm" },
  {
    id: "qty",
    header: "Quantity",
    accessor: (row) => row.current_qty ?? row.qty,
  },
  { id: "cuttable_width", header: "Width", accessor: "cuttable_width" },
  { id: "production_type", header: "Type", accessor: "production_type" },
  {
    id: "available_balance",
    header: "Available Balance",
    accessor: (row) => row.available_balance,
  },
];
