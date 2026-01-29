import { format } from "date-fns";
import type { Column } from "@/modules/shared";
import type { Supplier } from "@/modules/shared";

export const trashSupplierColumns: Column<Supplier>[] = [
  { id: "company_name", header: "Company Name", accessor: "company_name" },
  { id: "code", header: "Code", accessor: "code" },
  { id: "country", header: "Country", accessor: "country" },
  {
    id: "deleted_at",
    header: "Deleted At",
    accessor: (row) =>
      row.deleted_at ? format(new Date(row.deleted_at), "PP") : "-",
  },
];
