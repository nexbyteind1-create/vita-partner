import { PageHeader } from "@/components/shared/page-header";
import { ReportsPanel, type ReportDefinition } from "@/components/shared/reports-panel";
import {
  PATIENTS,
  getBookings,
  getPatientAnalytics,
  getRevenueAnalytics,
  getTatAnalytics,
  getTechnicianPerformance,
  getTestAnalyticsList,
} from "@/lib/data/lab";
import { BOOKING_STATUS_LABEL } from "@/lib/data/lab-types";

export default function LabReportsPage() {
  const bookings = getBookings();
  const testAnalytics = getTestAnalyticsList();
  const revenue = getRevenueAnalytics();
  const technicians = getTechnicianPerformance();
  const tat = getTatAnalytics();

  const patientReport = PATIENTS.map((p) => {
    const a = getPatientAnalytics(p.uhid)!;
    return {
      uhid: p.uhid,
      name: p.name,
      mobile: p.mobile,
      totalTestsTaken: a.totalTestsTaken,
      lifetimeRevenue: a.lifetimeRevenue,
      lastVisitDate: a.lastVisitDate ? new Date(a.lastVisitDate).toLocaleDateString("en-IN") : "—",
    };
  });

  const bookingReport = bookings.map((b) => ({
    bookingId: b.id,
    uhid: b.uhid,
    patientName: b.patientName,
    testName: b.testName,
    amount: b.amount,
    paymentStatus: b.paymentStatus,
    status: BOOKING_STATUS_LABEL[b.status],
    bookingDate: new Date(b.bookingDate).toLocaleString("en-IN"),
  }));

  const testWiseReport = testAnalytics.map((t) => ({
    name: t.test.name,
    category: t.test.category,
    totalBookings: t.totalBookings,
    totalPatients: t.totalPatients,
    revenue: t.revenueGenerated,
    pendingReports: t.pendingReports,
    uploadedReports: t.uploadedReports,
  }));

  const revenueReport = revenue.byCategory.map((c) => ({ category: c.category, revenue: c.revenue }));

  const technicianReport = technicians.map((t) => ({
    name: t.technician.name,
    testsProcessed: t.totalTestsProcessed,
    reportsUploaded: t.reportsUploaded,
    avgProcessingHours: t.averageProcessingHours,
    pendingReports: t.pendingReports,
    delayedReports: t.delayedReports,
  }));

  const tatReport = tat.byTest.map((t) => ({ test: t.name, sampleCount: t.sampleCount, averageHours: t.averageHours, delayed: t.delayed ? "Yes" : "No" }));

  const noShowReport = bookings.filter((b) => b.status === "no_show").map((b) => ({
    bookingId: b.id,
    uhid: b.uhid,
    patientName: b.patientName,
    testName: b.testName,
    bookingDate: new Date(b.bookingDate).toLocaleDateString("en-IN"),
  }));

  const pendingReportSummary = bookings
    .filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled")
    .map((b) => ({ bookingId: b.id, uhid: b.uhid, patientName: b.patientName, testName: b.testName, status: BOOKING_STATUS_LABEL[b.status] }));

  const reports: ReportDefinition[] = [
    {
      id: "patient-report",
      title: "Patient Report",
      description: `${patientReport.length} patients`,
      columns: [
        { key: "uhid", label: "UHID" },
        { key: "name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "totalTestsTaken", label: "Total Tests Taken" },
        { key: "lifetimeRevenue", label: "Lifetime Revenue" },
        { key: "lastVisitDate", label: "Last Visit" },
      ],
      data: patientReport,
    },
    {
      id: "booking-report",
      title: "Booking Report",
      description: `${bookingReport.length} bookings`,
      columns: [
        { key: "bookingId", label: "Booking ID" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "testName", label: "Test / Package" },
        { key: "amount", label: "Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "status", label: "Status" },
        { key: "bookingDate", label: "Booking Date" },
      ],
      data: bookingReport,
    },
    {
      id: "test-wise-report",
      title: "Test-wise Report",
      description: `${testWiseReport.length} tests`,
      columns: [
        { key: "name", label: "Test" },
        { key: "category", label: "Category" },
        { key: "totalBookings", label: "Total Bookings" },
        { key: "totalPatients", label: "Total Patients" },
        { key: "revenue", label: "Revenue" },
        { key: "pendingReports", label: "Pending Reports" },
        { key: "uploadedReports", label: "Uploaded Reports" },
      ],
      data: testWiseReport,
    },
    {
      id: "revenue-report",
      title: "Revenue Report",
      description: "Revenue by category",
      columns: [
        { key: "category", label: "Category" },
        { key: "revenue", label: "Revenue" },
      ],
      data: revenueReport,
    },
    {
      id: "technician-performance-report",
      title: "Technician Performance Report",
      description: `${technicianReport.length} technicians`,
      columns: [
        { key: "name", label: "Technician" },
        { key: "testsProcessed", label: "Tests Processed" },
        { key: "reportsUploaded", label: "Reports Uploaded" },
        { key: "avgProcessingHours", label: "Avg. Processing (hrs)" },
        { key: "pendingReports", label: "Pending Reports" },
        { key: "delayedReports", label: "Delayed Reports" },
      ],
      data: technicianReport,
    },
    {
      id: "tat-report",
      title: "TAT Report",
      description: `${tatReport.length} tests tracked`,
      columns: [
        { key: "test", label: "Test" },
        { key: "sampleCount", label: "Samples" },
        { key: "averageHours", label: "Avg. TAT (hrs)" },
        { key: "delayed", label: "Delayed" },
      ],
      data: tatReport,
    },
    {
      id: "no-show-report",
      title: "No Show Report",
      description: `${noShowReport.length} no-shows`,
      columns: [
        { key: "bookingId", label: "Booking ID" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "testName", label: "Test" },
        { key: "bookingDate", label: "Booking Date" },
      ],
      data: noShowReport,
    },
    {
      id: "pending-report-summary",
      title: "Pending Report Summary",
      description: `${pendingReportSummary.length} pending`,
      columns: [
        { key: "bookingId", label: "Booking ID" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "testName", label: "Test" },
        { key: "status", label: "Status" },
      ],
      data: pendingReportSummary,
    },
  ];

  return (
    <div>
      <PageHeader title="Reports" description="Export lab & diagnostics reports as CSV, Excel or PDF." />
      <ReportsPanel reports={reports} />
    </div>
  );
}
