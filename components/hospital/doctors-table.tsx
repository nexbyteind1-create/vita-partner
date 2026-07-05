"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { DataTable, SortableHeader } from "@/components/shared/data-table";
import { formatCurrency } from "@/lib/format";
import type { getDoctorAnalytics } from "@/lib/data/hospital";

type Row = ReturnType<typeof getDoctorAnalytics>[number];

const columns: ColumnDef<Row>[] = [
  {
    id: "name",
    header: ({ column }) => <SortableHeader label="Doctor" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.doctor.name,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.doctor.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.doctor.department}</p>
      </div>
    ),
  },
  { id: "totalAppointments", header: ({ column }) => <SortableHeader label="Total Appointments" onClick={() => column.toggleSorting()} />, accessorFn: (row) => row.totalAppointments },
  { id: "completedAppointments", header: "Completed", accessorFn: (row) => row.completedAppointments },
  { id: "cancelledAppointments", header: "Cancelled", accessorFn: (row) => row.cancelledAppointments },
  {
    id: "revenueGenerated",
    header: ({ column }) => <SortableHeader label="Revenue" onClick={() => column.toggleSorting()} />,
    accessorFn: (row) => row.revenueGenerated,
    cell: ({ row }) => formatCurrency(row.original.revenueGenerated),
  },
  { id: "averageConsultationMinutes", header: "Avg. Consult (min)", accessorFn: (row) => row.averageConsultationMinutes },
  { id: "followUpRate", header: "Follow-up Rate", accessorFn: (row) => `${row.followUpRate}%` },
  {
    id: "patientRating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {row.original.patientRating}
      </span>
    ),
  },
  { id: "upcomingAppointments", header: "Upcoming", accessorFn: (row) => row.upcomingAppointments },
];

export function DoctorsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSize={15}
      emptyMessage="No doctors found."
      onRowClick={(row) => router.push(`/hospital/doctors/${row.doctor.id}`)}
    />
  );
}
