import { PageHeader } from "@/components/shared/page-header";
import { ReportsPanel, type ReportDefinition } from "@/components/shared/reports-panel";
import {
  getAppointments,
  getConsolidatedBilling,
  getDiagnosticBillings,
  getDoctorAnalytics,
  getHospitalRevenueAnalytics,
  getLabBillings,
  getPharmacyBillings,
  searchPatients,
} from "@/lib/data/hospital";
import { APPOINTMENT_STATUS_LABEL } from "@/lib/data/hospital-types";
import { getPatientJourney } from "@/lib/data/hospital";

export default function HospitalReportsPage() {
  const appointments = getAppointments();
  const patients = searchPatients("");
  const doctors = getDoctorAnalytics();
  const lab = getLabBillings();
  const diagnostic = getDiagnosticBillings();
  const pharmacy = getPharmacyBillings();
  const revenue = getHospitalRevenueAnalytics();
  const consolidated = getConsolidatedBilling();

  const appointmentReport = appointments.map((a) => ({
    appointmentId: a.id,
    uhid: a.uhid,
    patientName: a.patientName,
    doctorName: a.doctorName,
    department: a.department,
    date: new Date(a.date).toLocaleString("en-IN"),
    status: APPOINTMENT_STATUS_LABEL[a.status],
    consultationFee: a.consultationFee,
  }));

  const patientVisitReport = patients.map((p) => {
    const journey = getPatientJourney(p.uhid)!;
    return {
      uhid: p.uhid,
      name: p.name,
      mobile: p.mobile,
      totalAppointments: journey.appointments.length,
      totalSpent: journey.billing.overallBill,
      lastVisit: journey.appointments[0] ? new Date(journey.appointments[0].date).toLocaleDateString("en-IN") : "—",
    };
  });

  const doctorPerformanceReport = doctors.map((d) => ({
    name: d.doctor.name,
    department: d.doctor.department,
    totalAppointments: d.totalAppointments,
    completed: d.completedAppointments,
    cancelled: d.cancelledAppointments,
    revenue: d.revenueGenerated,
    rating: d.patientRating,
  }));

  const laboratoryReport = lab.map((b) => ({
    labName: b.labName,
    testName: b.testName,
    uhid: b.uhid,
    patientName: b.patientName,
    amount: b.amount,
    paymentStatus: b.paymentStatus,
    bookingDate: new Date(b.bookingDate).toLocaleDateString("en-IN"),
  }));

  const diagnosticReport = diagnostic.map((b) => ({
    diagnosticCenter: b.diagnosticCenter,
    testName: b.testName,
    uhid: b.uhid,
    patientName: b.patientName,
    amount: b.amount,
    paymentStatus: b.paymentStatus,
    bookingDate: new Date(b.bookingDate).toLocaleDateString("en-IN"),
  }));

  const pharmacyBillingReport = pharmacy.map((b) => ({
    pharmacyName: b.pharmacyName,
    billNumber: b.billNumber,
    uhid: b.uhid,
    patientName: b.patientName,
    amount: b.amount,
    paymentStatus: b.paymentStatus,
    purchaseDate: new Date(b.purchaseDate).toLocaleDateString("en-IN"),
  }));

  const revenueReport = [
    { type: "Consultation", amount: revenue.breakdown.consultation },
    { type: "Laboratory", amount: revenue.breakdown.laboratory },
    { type: "Diagnostic", amount: revenue.breakdown.diagnostic },
    { type: "Pharmacy", amount: revenue.breakdown.pharmacy },
    { type: "Admission", amount: revenue.breakdown.admission },
  ];

  const patientBillingReport = consolidated.map((row) => ({
    uhid: row.patient.uhid,
    name: row.patient.name,
    overallBill: row.billing.overallBill,
    paidAmount: row.billing.paidAmount,
    pendingAmount: row.billing.pendingAmount,
  }));

  const reports: ReportDefinition[] = [
    {
      id: "appointment-report",
      title: "Appointment Report",
      description: `${appointmentReport.length} appointments`,
      columns: [
        { key: "appointmentId", label: "Appointment ID" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "doctorName", label: "Doctor" },
        { key: "department", label: "Department" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
        { key: "consultationFee", label: "Consultation Fee" },
      ],
      data: appointmentReport,
    },
    {
      id: "patient-visit-report",
      title: "Patient Visit Report",
      description: `${patientVisitReport.length} patients`,
      columns: [
        { key: "uhid", label: "UHID" },
        { key: "name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "totalAppointments", label: "Total Appointments" },
        { key: "totalSpent", label: "Total Spent" },
        { key: "lastVisit", label: "Last Visit" },
      ],
      data: patientVisitReport,
    },
    {
      id: "doctor-performance-report",
      title: "Doctor Performance Report",
      description: `${doctorPerformanceReport.length} doctors`,
      columns: [
        { key: "name", label: "Doctor" },
        { key: "department", label: "Department" },
        { key: "totalAppointments", label: "Total Appointments" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
        { key: "revenue", label: "Revenue" },
        { key: "rating", label: "Rating" },
      ],
      data: doctorPerformanceReport,
    },
    {
      id: "laboratory-report",
      title: "Laboratory Report",
      description: `${laboratoryReport.length} bookings`,
      columns: [
        { key: "labName", label: "Laboratory Name" },
        { key: "testName", label: "Test Name" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "amount", label: "Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "bookingDate", label: "Booking Date" },
      ],
      data: laboratoryReport,
    },
    {
      id: "diagnostic-report",
      title: "Diagnostic Report",
      description: `${diagnosticReport.length} bookings`,
      columns: [
        { key: "diagnosticCenter", label: "Diagnostic Center" },
        { key: "testName", label: "Scan/Test Name" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "amount", label: "Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "bookingDate", label: "Booking Date" },
      ],
      data: diagnosticReport,
    },
    {
      id: "pharmacy-billing-report",
      title: "Pharmacy Billing Report",
      description: `${pharmacyBillingReport.length} bills`,
      columns: [
        { key: "pharmacyName", label: "Pharmacy Name" },
        { key: "billNumber", label: "Bill Number" },
        { key: "uhid", label: "UHID" },
        { key: "patientName", label: "Patient Name" },
        { key: "amount", label: "Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "purchaseDate", label: "Purchase Date" },
      ],
      data: pharmacyBillingReport,
    },
    {
      id: "revenue-report",
      title: "Revenue Report",
      description: "Revenue by service type",
      columns: [
        { key: "type", label: "Revenue Type" },
        { key: "amount", label: "Amount" },
      ],
      data: revenueReport,
    },
    {
      id: "patient-billing-report",
      title: "Patient Billing Report",
      description: `${patientBillingReport.length} patients`,
      columns: [
        { key: "uhid", label: "UHID" },
        { key: "name", label: "Name" },
        { key: "overallBill", label: "Overall Bill" },
        { key: "paidAmount", label: "Paid Amount" },
        { key: "pendingAmount", label: "Pending Amount" },
      ],
      data: patientBillingReport,
    },
  ];

  return (
    <div>
      <PageHeader title="Reports" description="Export hospital reports as CSV, Excel or PDF." />
      <ReportsPanel reports={reports} />
    </div>
  );
}
