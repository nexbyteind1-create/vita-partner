import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/lab/status-badges";
import { getTestDetail } from "@/lib/data/lab";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const detail = getTestDetail(testId);
  if (!detail) notFound();

  const { test, bookings } = detail;
  const validBookings = bookings.filter((b) => b.status !== "cancelled");
  const revenue = validBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <Link href="/lab/tests" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Tests
      </Link>
      <PageHeader title={test.name} description={`${test.code} · ${test.category} · ${test.reportDeliveryTime}`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Total Patients" value={new Set(validBookings.map((b) => b.uhid)).size} />
        <StatCard label="Revenue Generated" value={formatCurrency(revenue)} />
        <StatCard label="Pending Reports" value={bookings.filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled").length} tone="warning" />
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Patients</h2>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UHID</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Visit Status</TableHead>
              <TableHead>Report Status</TableHead>
              <TableHead>Amount Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  {b.patientName}
                  <p className="text-xs text-muted-foreground">{b.uhid}</p>
                </TableCell>
                <TableCell>{formatDate(b.bookingDate)}</TableCell>
                <TableCell><BookingStatusBadge status={b.status} /></TableCell>
                <TableCell>{b.reportStatus}</TableCell>
                <TableCell>
                  {formatCurrency(b.amount)} <PaymentStatusBadge status={b.paymentStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
