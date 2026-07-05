import {
  Users,
  UserPlus,
  Repeat,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileClock,
  FileCheck2,
  XCircle,
  UserX,
  Home,
  Building2,
  Wallet,
  TrendingUp,
  CalendarCheck2,
  CalendarRange,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getDashboardStats, getGraphData } from "@/lib/data/lab";
import { formatCurrency } from "@/lib/format";
import {
  DailyBookingsChart,
  HomeCollectionTrendChart,
  MonthlyRevenueChart,
  NoShowTrendChart,
  PatientGrowthChart,
  RepeatPatientTrendChart,
  ReportUploadTrendChart,
  TestWiseRevenueChart,
} from "@/components/lab/dashboard-charts";

export default function LabDashboardPage() {
  const stats = getDashboardStats();
  const graph = getGraphData();

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of patients, bookings, reports and revenue." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={Users} />
        <StatCard label="New Patients" value={stats.newPatients} icon={UserPlus} />
        <StatCard label="Returning Patients" value={stats.returningPatients} icon={Repeat} />
        <StatCard label="Today's Bookings" value={stats.todaysBookings} icon={CalendarDays} />
        <StatCard label="Completed Tests" value={stats.completedTests} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending Tests" value={stats.pendingTests} icon={Clock} tone="warning" />
        <StatCard label="Reports Pending Upload" value={stats.reportsPendingUpload} icon={FileClock} tone="warning" />
        <StatCard label="Reports Uploaded" value={stats.reportsUploaded} icon={FileCheck2} />
        <StatCard label="Cancelled Bookings" value={stats.cancelledBookings} icon={XCircle} tone="danger" />
        <StatCard label="No Show Patients" value={stats.noShowPatients} icon={UserX} tone="danger" />
        <StatCard label="Home Collection Bookings" value={stats.homeCollectionBookings} icon={Home} />
        <StatCard label="Walk-in Patients" value={stats.walkInPatients} icon={Building2} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} />
        <StatCard label="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} icon={TrendingUp} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={CalendarCheck2} />
        <StatCard label="Yearly Revenue" value={formatCurrency(stats.yearlyRevenue)} icon={CalendarRange} />
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Graphical Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyBookingsChart data={graph.dailyBookings} />
        <MonthlyRevenueChart data={graph.monthlyRevenue} />
        <TestWiseRevenueChart data={graph.testWiseRevenue} />
        <PatientGrowthChart data={graph.patientGrowth} />
        <ReportUploadTrendChart data={graph.reportUploadTrend} />
        <NoShowTrendChart data={graph.noShowTrend} />
        <HomeCollectionTrendChart data={graph.homeCollectionTrend} />
        <RepeatPatientTrendChart data={graph.repeatPatientTrend} />
      </div>
    </div>
  );
}
