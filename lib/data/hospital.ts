import {
  ADMISSIONS,
  DEPARTMENTS,
  DIAGNOSTIC_BOOKINGS,
  DOCTORS,
  LAB_BOOKINGS,
  PATIENTS,
  PHARMACY_BILLS,
  STAFF,
} from "@/lib/mock/hospital-fixtures";
import { hospitalStore } from "./hospital-store";
import type {
  Appointment,
  AppointmentStatus,
  FollowUpStatus,
  MedicalDocumentType,
  Patient,
  SupportTicketStatus,
} from "./hospital-types";

const DAY_MS = 1000 * 60 * 60 * 24;

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}
function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(d: Date) {
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

function billingRevenueForRange(from: Date, to?: Date) {
  const inRange = (d: string) => new Date(d) >= from && (!to || new Date(d) < to);
  const consult = hospitalStore.appointments
    .filter((a) => a.status === "completed" && inRange(a.date))
    .reduce((s, a) => s + a.consultationFee, 0);
  const lab = LAB_BOOKINGS.filter((b) => inRange(b.bookingDate) && b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);
  const diag = DIAGNOSTIC_BOOKINGS.filter((b) => inRange(b.bookingDate) && b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);
  const pharm = PHARMACY_BILLS.filter((b) => inRange(b.purchaseDate) && b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);
  const admission = ADMISSIONS.filter((a) => inRange(a.admissionDate) && a.paymentStatus === "paid").reduce((s, a) => s + a.charges, 0);
  return { consult, lab, diag, pharm, admission, total: consult + lab + diag + pharm + admission };
}

export type DashboardRange = "today" | "yesterday" | "this_week" | "this_month" | "this_quarter" | "this_year" | "all";

export function getRangeBounds(range: DashboardRange, now = new Date()): { from: Date; to?: Date } {
  const today = startOfDay(now);
  switch (range) {
    case "today":
      return { from: today };
    case "yesterday": {
      const y = new Date(today.getTime() - DAY_MS);
      return { from: y, to: today };
    }
    case "this_week": {
      const day = now.getDay();
      const from = new Date(today.getTime() - day * DAY_MS);
      return { from };
    }
    case "this_month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1) };
    case "this_quarter":
      return { from: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1) };
    case "this_year":
      return { from: new Date(now.getFullYear(), 0, 1) };
    case "all":
    default:
      return { from: new Date(0) };
  }
}

// ---------------------------------------------------------------------------
// 8.1 Dashboard
// ---------------------------------------------------------------------------

export function getHospitalDashboardStats(range: DashboardRange = "all") {
  const now = new Date();
  const bounds = getRangeBounds(range, now);
  const inRange = (d: string) => new Date(d) >= bounds.from && (!bounds.to || new Date(d) < bounds.to);

  const allAppts = hospitalStore.appointments;
  const appts = allAppts.filter((a) => inRange(a.date));
  const today = allAppts.filter((a) => isSameDay(new Date(a.date), now));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const pendingPayments =
    LAB_BOOKINGS.filter((b) => b.paymentStatus === "pending").length +
    DIAGNOSTIC_BOOKINGS.filter((b) => b.paymentStatus === "pending").length +
    PHARMACY_BILLS.filter((b) => b.paymentStatus === "pending").length +
    ADMISSIONS.filter((a) => a.paymentStatus === "pending").length;

  return {
    totalPatients: new Set(appts.map((a) => a.uhid)).size || PATIENTS.length,
    totalAppointments: appts.length,
    todaysAppointments: today.length,
    completedAppointments: appts.filter((a) => a.status === "completed").length,
    cancelledAppointments: appts.filter((a) => a.status === "cancelled").length,
    upcomingAppointments: allAppts.filter((a) => new Date(a.date) > now && a.status === "scheduled").length,
    totalDoctors: DOCTORS.length,
    totalStaff: STAFF.length,
    laboratoryBookings: LAB_BOOKINGS.length,
    diagnosticBookings: DIAGNOSTIC_BOOKINGS.length,
    pharmacyBills: PHARMACY_BILLS.length,
    totalRevenue: billingRevenueForRange(bounds.from, bounds.to).total,
    todaysRevenue: billingRevenueForRange(startOfDay(now)).total,
    monthlyRevenue: billingRevenueForRange(monthStart).total,
    pendingPayments,
  };
}

// ---------------------------------------------------------------------------
// 8.5 / 11.x Appointments & Attendance
// ---------------------------------------------------------------------------

export interface AppointmentFilters {
  search?: string;
  status?: AppointmentStatus | "all";
  doctorId?: string;
  department?: string;
}

export function getAppointments(filters: AppointmentFilters = {}): Appointment[] {
  let list = [...hospitalStore.appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (filters.status && filters.status !== "all") list = list.filter((a) => a.status === filters.status);
  if (filters.doctorId) list = list.filter((a) => a.doctorId === filters.doctorId);
  if (filters.department) list = list.filter((a) => a.department === filters.department);
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.uhid.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.patientMobile.includes(q) ||
        a.doctorName.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getAppointmentById(id: string): Appointment | undefined {
  return hospitalStore.appointments.find((a) => a.id === id);
}

export function getNoShowAnalytics() {
  const noShows = hospitalStore.appointments.filter((a) => a.status === "no_show");
  const byDoctor = new Map<string, number>();
  const byDepartment = new Map<string, number>();
  const byPatient = new Map<string, number>();
  for (const a of noShows) {
    byDoctor.set(a.doctorName, (byDoctor.get(a.doctorName) ?? 0) + 1);
    byDepartment.set(a.department, (byDepartment.get(a.department) ?? 0) + 1);
    byPatient.set(a.uhid, (byPatient.get(a.uhid) ?? 0) + 1);
  }
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    total: noShows.length,
    byDoctor: Array.from(byDoctor.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    byDepartment: Array.from(byDepartment.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    today: noShows.filter((a) => isSameDay(new Date(a.date), now)).length,
    thisMonth: noShows.filter((a) => new Date(a.date) >= monthStart).length,
    repeatPatients: Array.from(byPatient.entries())
      .filter(([, count]) => count > 1)
      .map(([uhid, count]) => ({ uhid, patientName: getPatientByUhid(uhid)?.name ?? uhid, count }))
      .sort((a, b) => b.count - a.count),
  };
}

// ---------------------------------------------------------------------------
// 8.6 Doctor-wise analytics
// ---------------------------------------------------------------------------

export function getDoctorAnalytics() {
  return DOCTORS.map((doctor) => {
    const appts = hospitalStore.appointments.filter((a) => a.doctorId === doctor.id);
    const completed = appts.filter((a) => a.status === "completed");
    const cancelled = appts.filter((a) => a.status === "cancelled");
    const revenue = completed.reduce((s, a) => s + a.consultationFee, 0);
    const now = new Date();
    const upcoming = appts.filter((a) => new Date(a.date) > now && a.status === "scheduled").length;
    const followUpRate = completed.length
      ? Math.round((hospitalStore.followUps.filter((f) => f.doctorId === doctor.id).length / completed.length) * 100)
      : 0;
    return {
      doctor,
      totalAppointments: appts.length,
      completedAppointments: completed.length,
      cancelledAppointments: cancelled.length,
      revenueGenerated: revenue,
      averageConsultationMinutes: randomish(doctor.id, 12, 28),
      followUpRate,
      patientRating: doctor.rating,
      upcomingAppointments: upcoming,
    };
  });
}

function randomish(seed: string, min: number, max: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
}

export function getDoctorAppointments(doctorId: string) {
  return getAppointments({ doctorId });
}

// ---------------------------------------------------------------------------
// 8.3 / 8.4 Patients & Journey
// ---------------------------------------------------------------------------

export function searchPatients(query: string): Patient[] {
  const q = query.trim().toLowerCase();
  if (!q) return PATIENTS.slice(0, 20);
  return PATIENTS.filter(
    (p) =>
      p.uhid.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      hospitalStore.appointments.some((a) => a.uhid === p.uhid && a.id.toLowerCase().includes(q))
  );
}

export function getPatientByUhid(uhid: string): Patient | undefined {
  return PATIENTS.find((p) => p.uhid === uhid);
}

export function getPatientJourney(uhid: string) {
  const patient = getPatientByUhid(uhid);
  if (!patient) return undefined;

  const appointments = hospitalStore.appointments
    .filter((a) => a.uhid === uhid)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const labBookings = LAB_BOOKINGS.filter((b) => b.uhid === uhid);
  const diagnosticBookings = DIAGNOSTIC_BOOKINGS.filter((b) => b.uhid === uhid);
  const pharmacyBills = PHARMACY_BILLS.filter((b) => b.uhid === uhid);
  const admissions = ADMISSIONS.filter((a) => a.uhid === uhid);
  const documents = hospitalStore.documents
    .filter((d) => d.uhid === uhid)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  const followUps = hospitalStore.followUps.filter((f) => f.uhid === uhid);

  type TimelineEvent = { date: string; label: string; kind: string };
  const timeline: TimelineEvent[] = [
    ...appointments.map((a) => ({ date: a.date, label: `Appointment ${a.status === "completed" ? "Completed" : "Booked"} with ${a.doctorName}`, kind: "appointment" })),
    ...labBookings.map((b) => ({ date: b.bookingDate, label: `Laboratory Test — ${b.testName}`, kind: "lab" })),
    ...diagnosticBookings.map((b) => ({ date: b.bookingDate, label: `Diagnostic Scan — ${b.testName}`, kind: "diagnostic" })),
    ...pharmacyBills.map((b) => ({ date: b.purchaseDate, label: `Medicine Purchase — ${b.pharmacyName}`, kind: "pharmacy" })),
    ...admissions.map((a) => ({ date: a.admissionDate, label: "Admission", kind: "admission" })),
    ...admissions.filter((a) => a.dischargeDate).map((a) => ({ date: a.dischargeDate!, label: "Discharge Summary", kind: "discharge" })),
    ...documents.map((d) => ({ date: d.uploadedAt, label: `${d.title}`, kind: "document" })),
    ...followUps.map((f) => ({ date: f.followUpDate, label: `Follow-up — ${f.type}`, kind: "followup" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const consultationCharges = appointments.filter((a) => a.status === "completed").reduce((s, a) => s + a.consultationFee, 0);
  const labCharges = labBookings.reduce((s, b) => s + b.amount, 0);
  const diagnosticCharges = diagnosticBookings.reduce((s, b) => s + b.amount, 0);
  const pharmacyCharges = pharmacyBills.reduce((s, b) => s + b.amount, 0);
  const admissionCharges = admissions.reduce((s, a) => s + a.charges, 0);
  const overallBill = consultationCharges + labCharges + diagnosticCharges + pharmacyCharges + admissionCharges;

  // Consultation fees are treated as settled at completion; other charge types carry their own payment status.
  const paidAmount =
    consultationCharges +
    labBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0) +
    diagnosticBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0) +
    pharmacyBills.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0) +
    admissions.filter((a) => a.paymentStatus === "paid").reduce((s, a) => s + a.charges, 0);

  return {
    patient,
    appointments,
    labBookings,
    diagnosticBookings,
    pharmacyBills,
    admissions,
    documents,
    followUps,
    timeline,
    billing: {
      consultationCharges,
      labCharges,
      diagnosticCharges,
      pharmacyCharges,
      admissionCharges,
      overallBill,
      paidAmount: Math.min(paidAmount, overallBill),
      pendingAmount: Math.max(overallBill - Math.min(paidAmount, overallBill), 0),
    },
  };
}

// ---------------------------------------------------------------------------
// 8.7 - 8.11 Billing
// ---------------------------------------------------------------------------

export function getLabBillings() {
  return LAB_BOOKINGS;
}
export function getDiagnosticBillings() {
  return DIAGNOSTIC_BOOKINGS;
}
export function getPharmacyBillings() {
  return PHARMACY_BILLS;
}
export function getAdmissionBillings() {
  return ADMISSIONS;
}
export function getConsultationBillings() {
  return hospitalStore.appointments
    .filter((a) => a.status === "completed")
    .map((a) => ({
      id: a.id,
      uhid: a.uhid,
      patientName: a.patientName,
      doctorName: a.doctorName,
      amount: a.consultationFee,
      date: a.date,
    }));
}

export function getConsolidatedBilling() {
  return PATIENTS.map((patient) => {
    const journey = getPatientJourney(patient.uhid)!;
    return { patient, billing: journey.billing };
  }).filter((row) => row.billing.overallBill > 0);
}

// ---------------------------------------------------------------------------
// 8.12 Revenue analytics
// ---------------------------------------------------------------------------

export function getHospitalRevenueAnalytics() {
  const now = new Date();
  const day = billingRevenueForRange(startOfDay(now));
  const week = billingRevenueForRange(new Date(now.getTime() - 7 * DAY_MS));
  const month = billingRevenueForRange(new Date(now.getFullYear(), now.getMonth(), 1));
  const year = billingRevenueForRange(new Date(now.getFullYear(), 0, 1));
  const all = billingRevenueForRange(new Date(0));

  return {
    daily: day.total,
    weekly: week.total,
    monthly: month.total,
    yearly: year.total,
    breakdown: {
      consultation: all.consult,
      laboratory: all.lab,
      diagnostic: all.diag,
      pharmacy: all.pharm,
      admission: all.admission,
    },
  };
}

// ---------------------------------------------------------------------------
// 8.14 Graphical dashboard
// ---------------------------------------------------------------------------

export function getHospitalGraphData() {
  const now = new Date();

  const appointmentTrend = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * DAY_MS);
    const dayAppts = hospitalStore.appointments.filter((a) => isSameDay(new Date(a.date), day));
    return {
      date: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      appointments: dayAppts.length,
    };
  });

  const revenueTrend = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * DAY_MS);
    const r = billingRevenueForRange(startOfDay(day));
    const rNext = billingRevenueForRange(new Date(startOfDay(day).getTime() + DAY_MS));
    return { date: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), revenue: r.total - rNext.total };
  });

  const doctorWise = getDoctorAnalytics()
    .sort((a, b) => b.totalAppointments - a.totalAppointments)
    .slice(0, 8)
    .map((d) => ({ name: d.doctor.name, appointments: d.totalAppointments }));

  const departmentWise = DEPARTMENTS.map((dept) => ({
    department: dept,
    patients: new Set(hospitalStore.appointments.filter((a) => a.department === dept).map((a) => a.uhid)).size,
  })).sort((a, b) => b.patients - a.patients);

  const monthlyBuckets = new Map<string, { label: string; appointments: number }>();
  for (const a of hospitalStore.appointments) {
    const d = new Date(a.date);
    const key = monthKey(d);
    const existing = monthlyBuckets.get(key) ?? { label: monthLabel(d), appointments: 0 };
    existing.appointments += 1;
    monthlyBuckets.set(key, existing);
  }
  const monthlyGrowth = Array.from(monthlyBuckets.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .slice(-6)
    .map(([, v]) => v);

  return {
    appointmentTrend,
    revenueTrend,
    doctorWise,
    departmentWise,
    monthlyGrowth,
    labRevenue: LAB_BOOKINGS.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    diagnosticRevenue: DIAGNOSTIC_BOOKINGS.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    pharmacyRevenue: PHARMACY_BILLS.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
  };
}

// ---------------------------------------------------------------------------
// 9.x Medical Documents
// ---------------------------------------------------------------------------

export interface DocumentFilters {
  uhid?: string;
  doctorName?: string;
  department?: string;
  type?: MedicalDocumentType | "all";
  search?: string;
}

export function getMedicalDocuments(filters: DocumentFilters = {}) {
  let list = [...hospitalStore.documents].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  if (filters.uhid) list = list.filter((d) => d.uhid === filters.uhid);
  if (filters.doctorName) list = list.filter((d) => d.doctorName === filters.doctorName);
  if (filters.department) list = list.filter((d) => d.department === filters.department);
  if (filters.type && filters.type !== "all") list = list.filter((d) => d.type === filters.type);
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((d) => d.title.toLowerCase().includes(q) || d.uhid.toLowerCase().includes(q) || d.patientName.toLowerCase().includes(q));
  }
  return list;
}

// ---------------------------------------------------------------------------
// 10.x Support tickets
// ---------------------------------------------------------------------------

export function getSupportTickets(status?: SupportTicketStatus | "all") {
  let list = [...hospitalStore.tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (status && status !== "all") list = list.filter((t) => t.status === status);
  return list;
}

export function getSupportTicketById(id: string) {
  return hospitalStore.tickets.find((t) => t.id === id);
}

// ---------------------------------------------------------------------------
// 12.x Follow-ups
// ---------------------------------------------------------------------------

export function getFollowUps(status?: FollowUpStatus | "all") {
  let list = [...hospitalStore.followUps].sort((a, b) => new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime());
  if (status && status !== "all") list = list.filter((f) => f.status === status);
  return list;
}

export function getAuditLog() {
  return hospitalStore.auditLog;
}

export { DEPARTMENTS, DOCTORS, STAFF, PATIENTS };
