import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AppointmentsTable } from "@/components/hospital/appointments-table";
import { Badge } from "@/components/ui/badge";
import { getDoctorAnalytics, getDoctorAppointments } from "@/lib/data/hospital";
import { formatCurrency } from "@/lib/format";

export default async function DoctorDetailPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params;
  const analytics = getDoctorAnalytics().find((d) => d.doctor.id === doctorId);
  if (!analytics) notFound();

  const appointments = getDoctorAppointments(doctorId);

  return (
    <div>
      <Link href="/hospital/doctors" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Doctors
      </Link>
      <PageHeader
        title={analytics.doctor.name}
        description={`${analytics.doctor.department} · ${analytics.doctor.experienceYears} yrs experience · Consultation Fee ${formatCurrency(analytics.doctor.consultationFee)}`}
        actions={
          <Badge variant="secondary" className="gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {analytics.doctor.rating}
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Appointments" value={analytics.totalAppointments} />
        <StatCard label="Completed" value={analytics.completedAppointments} tone="success" />
        <StatCard label="Cancelled" value={analytics.cancelledAppointments} tone="danger" />
        <StatCard label="Revenue Generated" value={formatCurrency(analytics.revenueGenerated)} />
        <StatCard label="Avg. Consultation Time" value={`${analytics.averageConsultationMinutes} min`} />
        <StatCard label="Follow-up Rate" value={`${analytics.followUpRate}%`} />
        <StatCard label="Upcoming Appointments" value={analytics.upcomingAppointments} />
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">All Appointments</h2>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
