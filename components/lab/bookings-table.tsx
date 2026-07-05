"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/lab/status-badges";
import { BookingStatusDialog } from "@/components/lab/booking-status-dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Booking } from "@/lib/data/lab-types";

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader label="Booking ID" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.id}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(row.original.bookingDate)}</p>
      </div>
    ),
  },
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "patientName", header: "Patient Name" },
  { accessorKey: "testName", header: "Test / Package" },
  { accessorKey: "channel", header: "Channel", cell: ({ row }) => (row.original.channel === "home_collection" ? "Home Collection" : "Walk-in") },
  {
    accessorKey: "amount",
    header: ({ column }) => <SortableHeader label="Amount" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  { id: "paymentStatus", header: "Payment Status", cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} /> },
  { id: "status", header: "Status", cell: ({ row }) => <BookingStatusBadge status={row.original.status} /> },
  { accessorKey: "reportStatus", header: "Report Status" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <BookingStatusDialog booking={row.original} />
      </div>
    ),
  },
];

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={bookings}
      pageSize={15}
      emptyMessage="No bookings match this filter."
      onRowClick={(b) => router.push(`/lab/patients/${b.uhid}`)}
    />
  );
}
