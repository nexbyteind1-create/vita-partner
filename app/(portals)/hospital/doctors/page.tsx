import { PageHeader } from "@/components/shared/page-header";
import { DoctorsTable } from "@/components/hospital/doctors-table";
import { getDoctorAnalytics } from "@/lib/data/hospital";

export default function DoctorsPage() {
  const rows = getDoctorAnalytics().sort((a, b) => b.totalAppointments - a.totalAppointments);
  return (
    <div>
      <PageHeader title="Doctor-wise Analytics" description="Appointment volume, revenue and patient satisfaction per doctor." />
      <DoctorsTable rows={rows} />
    </div>
  );
}
