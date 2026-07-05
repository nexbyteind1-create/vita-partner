import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/lab/status-badges";
import { getPatientAnalytics } from "@/lib/data/lab";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default async function PatientDetailPage({ params }: { params: Promise<{ uhid: string }> }) {
  const { uhid } = await params;
  const analytics = getPatientAnalytics(uhid);
  if (!analytics) notFound();

  const { patient, bookings } = analytics;

  return (
    <div>
      <Link href="/lab/patients" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>
      <PageHeader title={patient.name} description={`${patient.uhid} · ${patient.gender}, ${patient.age} yrs · ${patient.mobile}`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Tests Taken" value={analytics.totalTestsTaken} />
        <StatCard label="Active Bookings" value={analytics.activeBookings} />
        <StatCard label="Completed Tests" value={analytics.completedTests} tone="success" />
        <StatCard label="Pending Reports" value={analytics.pendingReports} tone="warning" />
        <StatCard label="Total Amount Paid" value={formatCurrency(analytics.totalAmountPaid)} />
        <StatCard label="Last Visit" value={analytics.lastVisitDate ? formatDate(analytics.lastVisitDate) : "—"} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Test History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
              <div>
                <p className="font-medium">{b.testName}</p>
                <p className="text-xs text-muted-foreground">{b.id} · {formatDateTime(b.bookingDate)}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-medium">{formatCurrency(b.amount)} <PaymentStatusBadge status={b.paymentStatus} /></p>
                <BookingStatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
