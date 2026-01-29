import { format } from "date-fns";
import type { Column } from "@/modules/shared";
import type { Supplier } from "@/modules/shared";

export const supplierColumns: Column<Supplier>[] = [
  { id: "code", header: "Code", accessor: "code" },
  { id: "company_name", header: "Company Name", accessor: "company_name" },
  { id: "country", header: "Country", accessor: "country" },
  {
    id: "representative",
    header: "Representative",
    accessor: (row) => row.representative_name || "-",
  },
  {
    id: "created_at",
    header: "Created At",
    accessor: (row) => format(new Date(row.created_at), "PP"),
  },
];
