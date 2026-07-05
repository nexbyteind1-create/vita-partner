"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { OrderStatusBadge, PaymentStatusBadge, PrescriptionStatusBadge } from "@/components/pharmacy/status-badges";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Order } from "@/lib/data/types";

const DELIVERY_LABEL: Record<Order["deliveryType"], string> = {
  home_delivery: "Home Delivery",
  store_pickup: "Store Pickup",
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader label="Order ID" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.id}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</p>
      </div>
    ),
  },
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "customerName", header: "Customer Name" },
  { accessorKey: "mobile", header: "Mobile Number" },
  {
    id: "prescriptionStatus",
    header: "Prescription Status",
    cell: ({ row }) =>
      row.original.prescriptionStatus ? (
        <PrescriptionStatusBadge status={row.original.prescriptionStatus} />
      ) : (
        <span className="text-xs text-muted-foreground">Not required</span>
      ),
  },
  {
    accessorKey: "doctorName",
    header: "Doctor Name",
    cell: ({ row }) => row.original.doctorName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "hospitalName",
    header: "Hospital Name",
    cell: ({ row }) => row.original.hospitalName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <SortableHeader label="Order Amount" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    id: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
  },
  {
    accessorKey: "deliveryType",
    header: "Delivery Type",
    cell: ({ row }) => DELIVERY_LABEL[row.original.deliveryType],
  },
  {
    id: "status",
    header: "Order Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={orders}
      pageSize={15}
      emptyMessage="No orders match this filter."
      onRowClick={(order) => router.push(`/pharmacy/orders/${order.id}`)}
    />
  );
}
