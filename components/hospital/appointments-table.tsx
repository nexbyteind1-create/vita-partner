"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { AppointmentStatusBadge } from "@/components/hospital/status-badges";
import { AppointmentStatusDialog } from "@/components/hospital/appointment-status-dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Appointment } from "@/lib/data/hospital-types";

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader label="Appointment ID" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.id}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(row.original.date)}</p>
      </div>
    ),
  },
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "patientName", header: "Patient Name" },
  { accessorKey: "doctorName", header: "Doctor" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "consultationFee",
    header: ({ column }) => <SortableHeader label="Consultation Fee" onClick={() => column.toggleSorting()} />,
    cell: ({ row }) => formatCurrency(row.original.consultationFee),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="space-y-1">
        <AppointmentStatusBadge status={row.original.status} />
        {row.original.noShowReason && <p className="text-xs text-muted-foreground">{row.original.noShowReason}</p>}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <AppointmentStatusDialog appointment={row.original} />
      </div>
    ),
  },
];

export function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={appointments}
      pageSize={15}
      emptyMessage="No appointments match this filter."
      onRowClick={(a) => router.push(`/hospital/patients/${a.uhid}`)}
    />
  );
}
