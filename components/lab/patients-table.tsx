"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { formatDate } from "@/lib/format";
import type { Patient } from "@/lib/data/lab-types";

const columns: ColumnDef<Patient>[] = [
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "name", header: "Patient Name" },
  { accessorKey: "mobile", header: "Mobile Number" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "createdAt", header: "Registered Since", cell: ({ row }) => formatDate(row.original.createdAt) },
];

export function PatientsTable({ patients }: { patients: Patient[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={patients}
      pageSize={12}
      emptyMessage="No patients match this search."
      onRowClick={(p) => router.push(`/lab/patients/${p.uhid}`)}
    />
  );
}
