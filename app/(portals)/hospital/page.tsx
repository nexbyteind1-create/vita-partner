import {
  Users,
  CalendarClock,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Stethoscope,
  UserCog,
  FlaskConical,
  ScanLine,
  Pill,
  Wallet,
  TrendingUp,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getHospitalDashboardStats, getHospitalGraphData, type DashboardRange } from "@/lib/data/hospital";
import { formatCurrency } from "@/lib/format";
import {
  AppointmentTrendChart,
  DepartmentWisePatientsChart,
  DoctorWiseAppointmentsChart,
  HospitalRevenueTrendChart,
  MonthlyGrowthChart,
  ServiceRevenueChart,
} from "@/components/hospital/dashboard-charts";
import { DashboardRangeFilter } from "@/components/hospital/dashboard-range-filter";

export default async function HospitalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const stats = getHospitalDashboardStats((params.range as DashboardRange) ?? "all");
  const graph = getHospitalGraphData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of patients, appointments, doctors and revenue."
        actions={<DashboardRangeFilter />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={Users} />
        <StatCard label="Total Appointments" value={stats.totalAppointments} icon={CalendarClock} />
        <StatCard label="Today's Appointments" value={stats.todaysAppointments} icon={CalendarDays} />
        <StatCard label="Completed Appointments" value={stats.completedAppointments} icon={CheckCircle2} tone="success" />
        <StatCard label="Cancelled Appointments" value={stats.cancelledAppointments} icon={XCircle} tone="danger" />
        <StatCard label="Upcoming Appointments" value={stats.upcomingAppointments} icon={CalendarPlus} />
        <StatCard label="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} />
        <StatCard label="Total Staff" value={stats.totalStaff} icon={UserCog} />
        <StatCard label="Laboratory Bookings" value={stats.laboratoryBookings} icon={FlaskConical} />
        <StatCard label="Diagnostic Bookings" value={stats.diagnosticBookings} icon={ScanLine} />
        <StatCard label="Pharmacy Bills" value={stats.pharmacyBills} icon={Pill} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} />
        <StatCard label="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} icon={TrendingUp} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={CalendarCheck2} />
        <StatCard label="Pending Payments" value={stats.pendingPayments} icon={AlertCircle} tone="warning" />
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Graphical Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AppointmentTrendChart data={graph.appointmentTrend} />
        <HospitalRevenueTrendChart data={graph.revenueTrend} />
        <DoctorWiseAppointmentsChart data={graph.doctorWise} />
        <DepartmentWisePatientsChart data={graph.departmentWise} />
        <ServiceRevenueChart data={graph} />
        <MonthlyGrowthChart data={graph.monthlyGrowth} />
      </div>
    </div>
  );
}
