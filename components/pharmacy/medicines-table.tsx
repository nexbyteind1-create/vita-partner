"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { getMedicineAnalyticsList } from "@/lib/data/pharmacy";

type Row = ReturnType<typeof getMedicineAnalyticsList>[number];

const columns: ColumnDef<Row>[] = [
  {
    id: "name",
    header: ({ column }) => <SortableHeader label="Medicine" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.medicine.name,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.medicine.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.medicine.category}</p>
      </div>
    ),
  },
  {
    id: "totalOrders",
    header: ({ column }) => <SortableHeader label="Total Orders" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.totalOrders,
  },
  {
    id: "totalQuantitySold",
    header: ({ column }) => <SortableHeader label="Qty Sold" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.totalQuantitySold,
  },
  {
    id: "revenueGenerated",
    header: ({ column }) => <SortableHeader label="Revenue" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.revenueGenerated,
    cell: ({ row }) => formatCurrency(row.original.revenueGenerated),
  },
  {
    id: "availableStock",
    header: ({ column }) => <SortableHeader label="Available Stock" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.availableStock,
  },
  {
    id: "flags",
    header: "Stock Status",
    cell: ({ row }) => {
      if (row.original.outOfStock) return <Badge variant="destructive">Out of Stock</Badge>;
      if (row.original.lowStock)
        return (
          <Badge variant="outline" className="border-0 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Low Stock
          </Badge>
        );
      return <span className="text-xs text-muted-foreground">In Stock</span>;
    },
  },
];

export function MedicinesTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSize={15}
      emptyMessage="No medicines found."
      onRowClick={(row) => router.push(`/pharmacy/medicines/${row.medicine.id}`)}
    />
  );
}
