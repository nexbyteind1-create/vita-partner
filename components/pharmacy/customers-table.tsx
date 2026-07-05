"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/lib/data/types";

const columns: ColumnDef<Customer>[] = [
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "name", header: "Customer Name" },
  { accessorKey: "mobile", header: "Mobile Number" },
  {
    accessorKey: "membership",
    header: "Membership",
    cell: ({ row }) =>
      row.original.membership === "None" ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <Badge variant="secondary">{row.original.membership}</Badge>
      ),
  },
  { accessorKey: "walletCredits", header: "Wallet Credits" },
  {
    accessorKey: "createdAt",
    header: "Customer Since",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={customers}
      pageSize={12}
      emptyMessage="No customers match this search."
      onRowClick={(c) => router.push(`/pharmacy/customers/${c.uhid}`)}
    />
  );
}
