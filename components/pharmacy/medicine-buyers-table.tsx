"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { getMedicineDetail } from "@/lib/data/pharmacy";

type Buyer = NonNullable<ReturnType<typeof getMedicineDetail>>["buyers"][number];

const columns: ColumnDef<Buyer>[] = [
  { id: "uhid", header: "UHID", accessorFn: (row) => row.customer!.uhid },
  { id: "name", header: "Customer Name", accessorFn: (row) => row.customer!.name },
  { id: "mobile", header: "Mobile Number", accessorFn: (row) => row.customer!.mobile },
  { id: "quantity", header: "Quantity Purchased", accessorFn: (row) => row.quantity },
  {
    id: "spend",
    header: "Amount Spent",
    accessorFn: (row) => row.spend,
    cell: ({ row }) => formatCurrency(row.original.spend),
  },
  {
    id: "lastPurchase",
    header: "Last Purchase",
    accessorFn: (row) => row.lastPurchase,
    cell: ({ row }) => formatDate(row.original.lastPurchase),
  },
];

export function MedicineBuyersTable({ buyers }: { buyers: Buyer[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={buyers}
      pageSize={12}
      emptyMessage="No purchases recorded for this medicine yet."
      onRowClick={(row) => router.push(`/pharmacy/customers/${row.customer!.uhid}`)}
    />
  );
}
