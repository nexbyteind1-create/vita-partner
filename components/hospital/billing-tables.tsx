"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { PaymentStatusBadge } from "@/components/hospital/status-badges";
import { formatCurrency, formatDate } from "@/lib/format";
import type {
  Admission,
  DiagnosticBooking,
  LabBooking,
  PharmacyBill,
} from "@/lib/data/hospital-types";
import type { getConsolidatedBilling, getConsultationBillings } from "@/lib/data/hospital";

function usePatientNav() {
  const router = useRouter();
  return (uhid: string) => router.push(`/hospital/patients/${uhid}`);
}

type ConsultationRow = ReturnType<typeof getConsultationBillings>[number];

export function ConsultationBillingTable({ rows }: { rows: ConsultationRow[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<ConsultationRow>[] = [
    { accessorKey: "id", header: "Appointment ID" },
    { accessorKey: "uhid", header: "UHID" },
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "doctorName", header: "Doctor" },
    { accessorKey: "date", header: "Date", cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount) },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.uhid)} />;
}

export function LabBillingTable({ rows }: { rows: LabBooking[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<LabBooking>[] = [
    { accessorKey: "labName", header: "Laboratory Name" },
    { accessorKey: "testName", header: "Test Name" },
    { accessorKey: "uhid", header: "UHID" },
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount) },
    { id: "paymentStatus", header: "Payment Status", cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} /> },
    { accessorKey: "bookingDate", header: "Booking Date", cell: ({ row }) => formatDate(row.original.bookingDate) },
    { accessorKey: "reportStatus", header: "Report Status" },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.uhid)} />;
}

export function DiagnosticBillingTable({ rows }: { rows: DiagnosticBooking[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<DiagnosticBooking>[] = [
    { accessorKey: "diagnosticCenter", header: "Diagnostic Center" },
    { accessorKey: "testName", header: "Scan/Test Name" },
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "uhid", header: "UHID" },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount) },
    { id: "paymentStatus", header: "Payment Status", cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} /> },
    { accessorKey: "bookingDate", header: "Booking Date", cell: ({ row }) => formatDate(row.original.bookingDate) },
    { accessorKey: "reportStatus", header: "Report Status" },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.uhid)} />;
}

export function PharmacyBillingTable({ rows }: { rows: PharmacyBill[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<PharmacyBill>[] = [
    { accessorKey: "pharmacyName", header: "Pharmacy Name" },
    { accessorKey: "billNumber", header: "Bill Number" },
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "uhid", header: "UHID" },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount) },
    { id: "paymentStatus", header: "Payment Status", cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} /> },
    { accessorKey: "purchaseDate", header: "Purchase Date", cell: ({ row }) => formatDate(row.original.purchaseDate) },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.uhid)} />;
}

export function AdmissionBillingTable({ rows }: { rows: Admission[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<Admission>[] = [
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "uhid", header: "UHID" },
    { accessorKey: "treatingDoctor", header: "Treating Doctor" },
    { accessorKey: "admissionDate", header: "Admission Date", cell: ({ row }) => formatDate(row.original.admissionDate) },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "charges", header: "Charges", cell: ({ row }) => formatCurrency(row.original.charges) },
    { id: "paymentStatus", header: "Payment Status", cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} /> },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.uhid)} />;
}

type ConsolidatedRow = ReturnType<typeof getConsolidatedBilling>[number];

export function ConsolidatedBillingTable({ rows }: { rows: ConsolidatedRow[] }) {
  const goToPatient = usePatientNav();
  const columns: ColumnDef<ConsolidatedRow>[] = [
    { id: "uhid", header: "UHID", accessorFn: (r) => r.patient.uhid },
    { id: "name", header: "Patient Name", accessorFn: (r) => r.patient.name },
    { id: "overall", header: "Overall Bill", accessorFn: (r) => r.billing.overallBill, cell: ({ row }) => formatCurrency(row.original.billing.overallBill) },
    { id: "paid", header: "Paid Amount", accessorFn: (r) => r.billing.paidAmount, cell: ({ row }) => formatCurrency(row.original.billing.paidAmount) },
    {
      id: "pending",
      header: "Pending Amount",
      accessorFn: (r) => r.billing.pendingAmount,
      cell: ({ row }) => formatCurrency(row.original.billing.pendingAmount),
    },
  ];
  return <DataTable columns={columns} data={rows} pageSize={12} onRowClick={(r) => goToPatient(r.patient.uhid)} />;
}
