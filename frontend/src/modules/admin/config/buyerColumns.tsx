import type { Buyer } from "@/modules/shared";

export const buyerColumns = [
  {
    id: "name",
    header: "Name",
    accessor: (buyer: Buyer) => buyer.user?.name ?? "-",
  },
  {
    id: "email",
    header: "Email",
    accessor: (buyer: Buyer) => buyer.user?.email ?? "-",
  },
  {
    id: "company",
    header: "Company",
    accessor: (buyer: Buyer) => buyer.company_name,
  },
  {
    id: "country",
    header: "Country",
    accessor: (buyer: Buyer) => buyer.country,
  },
  {
    id: "phone",
    header: "Phone",
    accessor: (buyer: Buyer) => buyer.phone ?? "-",
  },
] as const;
