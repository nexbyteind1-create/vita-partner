import { CATEGORIES, DOCTORS, HOSPITALS, PACKAGES, PATIENTS, TECHNICIANS, TESTS } from "@/lib/mock/lab-fixtures";
import { labStore } from "./lab-store";
import type { Booking, BookingStatus, Patient, Test } from "./lab-types";

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

// ---------------------------------------------------------------------------
// 6.11 Dashboard
// ---------------------------------------------------------------------------

export function getDashboardStats() {
  const now = new Date();
  const bookings = labStore.bookings;
  const today = bookings.filter((b) => isSameDay(new Date(b.bookingDate), now));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthAgo = new Date(now.getTime() - 30 * DAY_MS);

  const revenueOf = (list: Booking[]) => list.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);

  const byPatient = new Map<string, number>();
  for (const b of bookings) byPatient.set(b.uhid, (byPatient.get(b.uhid) ?? 0) + 1);
  const returningPatients = Array.from(byPatient.values()).filter((c) => c > 1).length;
  const newPatients = PATIENTS.filter((p) => new Date(p.createdAt) >= monthAgo).length;

  return {
    totalPatients: PATIENTS.length,
    newPatients,
    returningPatients,
    todaysBookings: today.length,
    completedTests: bookings.filter((b) => b.status === "completed").length,
    pendingTests: bookings.filter((b) => ["booked", "sample_collected", "processing"].includes(b.status)).length,
    reportsPendingUpload: bookings.filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled").length,
    reportsUploaded: bookings.filter((b) => b.reportStatus === "Uploaded").length,
    cancelledBookings: bookings.filter((b) => b.status === "cancelled").length,
    noShowPatients: bookings.filter((b) => b.status === "no_show").length,
    homeCollectionBookings: bookings.filter((b) => b.channel === "home_collection").length,
    walkInPatients: bookings.filter((b) => b.channel === "walk_in").length,
    totalRevenue: revenueOf(bookings),
    todaysRevenue: revenueOf(today),
    monthlyRevenue: revenueOf(bookings.filter((b) => new Date(b.bookingDate) >= monthStart)),
    yearlyRevenue: revenueOf(bookings.filter((b) => new Date(b.bookingDate) >= yearStart)),
  };
}

// ---------------------------------------------------------------------------
// 4.x / 5.x Tests & Packages
// ---------------------------------------------------------------------------

export interface TestFilters {
  search?: string;
  category?: string;
  status?: Test["status"] | "all";
}

export function getTests(filters: TestFilters = {}): Test[] {
  let list = [...labStore.tests];
  if (filters.category && filters.category !== "all") list = list.filter((t) => t.category === filters.category);
  if (filters.status && filters.status !== "all") list = list.filter((t) => t.status === filters.status);
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function getTestById(id: string) {
  return labStore.tests.find((t) => t.id === id);
}

export function getPackages() {
  return labStore.packages;
}

export { CATEGORIES, DOCTORS, HOSPITALS, TECHNICIANS, PATIENTS };

// ---------------------------------------------------------------------------
// 6.12 Test-wise analytics
// ---------------------------------------------------------------------------

export function getTestAnalyticsList() {
  return labStore.tests.map((test) => {
    const bookings = labStore.bookings.filter((b) => b.testId === test.id);
    const validBookings = bookings.filter((b) => b.status !== "cancelled");
    const uniquePatients = new Set(validBookings.map((b) => b.uhid)).size;
    return {
      test,
      totalBookings: bookings.length,
      totalPatients: uniquePatients,
      revenueGenerated: validBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
      averageDailyBookings: Math.round((bookings.length / 90) * 10) / 10,
      pendingReports: bookings.filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled").length,
      uploadedReports: bookings.filter((b) => b.reportStatus === "Uploaded").length,
      cancellationCount: bookings.filter((b) => b.status === "cancelled").length,
      noShowCount: bookings.filter((b) => b.status === "no_show").length,
    };
  });
}

export function getTestDetail(testId: string) {
  const test = getTestById(testId);
  if (!test) return undefined;
  const bookings = labStore.bookings
    .filter((b) => b.testId === testId)
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  return { test, bookings };
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | "all";
}

export function getBookings(filters: BookingFilters = {}): Booking[] {
  let list = [...labStore.bookings].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  if (filters.status && filters.status !== "all") list = list.filter((b) => b.status === filters.status);
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (b) => b.id.toLowerCase().includes(q) || b.uhid.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q) || b.mobile.includes(q)
    );
  }
  return list;
}

export function getBookingById(id: string) {
  return labStore.bookings.find((b) => b.id === id);
}

// ---------------------------------------------------------------------------
// 6.13 Patient analytics
// ---------------------------------------------------------------------------

export function searchPatients(query: string): Patient[] {
  const q = query.trim().toLowerCase();
  if (!q) return PATIENTS.slice(0, 20);
  return PATIENTS.filter((p) => p.uhid.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.mobile.includes(q));
}

export function getPatientByUhid(uhid: string) {
  return PATIENTS.find((p) => p.uhid === uhid);
}

export function getPatientAnalytics(uhid: string) {
  const patient = getPatientByUhid(uhid);
  if (!patient) return undefined;
  const bookings = labStore.bookings
    .filter((b) => b.uhid === uhid)
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  const validBookings = bookings.filter((b) => b.status !== "cancelled");
  return {
    patient,
    totalTestsTaken: validBookings.length,
    activeBookings: bookings.filter((b) => ["booked", "sample_collected", "processing"].includes(b.status)).length,
    completedTests: bookings.filter((b) => b.status === "completed").length,
    pendingReports: bookings.filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled").length,
    totalAmountPaid: validBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    lastVisitDate: bookings[0]?.bookingDate,
    lifetimeRevenue: validBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    bookings,
  };
}

// ---------------------------------------------------------------------------
// 6.14 Revenue analytics
// ---------------------------------------------------------------------------

export function getRevenueAnalytics() {
  const now = new Date();
  const validBookings = labStore.bookings.filter((b) => b.paymentStatus === "paid");

  const byTest = new Map<string, number>();
  const byCategory = new Map<string, number>();
  for (const b of validBookings) {
    byTest.set(b.testName, (byTest.get(b.testName) ?? 0) + b.amount);
    const test = b.testId ? getTestById(b.testId) : undefined;
    const category = test?.category ?? "Packages";
    byCategory.set(category, (byCategory.get(category) ?? 0) + b.amount);
  }

  const dayRev = validBookings.filter((b) => isSameDay(new Date(b.bookingDate), now)).reduce((s, b) => s + b.amount, 0);
  const weekRev = validBookings.filter((b) => new Date(b.bookingDate) >= new Date(now.getTime() - 7 * DAY_MS)).reduce((s, b) => s + b.amount, 0);
  const monthRev = validBookings.filter((b) => new Date(b.bookingDate) >= new Date(now.getFullYear(), now.getMonth(), 1)).reduce((s, b) => s + b.amount, 0);
  const yearRev = validBookings.filter((b) => new Date(b.bookingDate) >= new Date(now.getFullYear(), 0, 1)).reduce((s, b) => s + b.amount, 0);
  const homeRev = validBookings.filter((b) => b.channel === "home_collection").reduce((s, b) => s + b.amount, 0);
  const walkInRev = validBookings.filter((b) => b.channel === "walk_in").reduce((s, b) => s + b.amount, 0);

  const testEntries = Array.from(byTest.entries()).sort((a, b) => b[1] - a[1]);
  const averageRevenuePerPatient = new Set(validBookings.map((b) => b.uhid)).size
    ? Math.round(validBookings.reduce((s, b) => s + b.amount, 0) / new Set(validBookings.map((b) => b.uhid)).size)
    : 0;

  return {
    byTest: testEntries.map(([name, revenue]) => ({ name, revenue })),
    byCategory: Array.from(byCategory.entries()).map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue),
    day: dayRev,
    week: weekRev,
    month: monthRev,
    year: yearRev,
    homeCollection: homeRev,
    walkIn: walkInRev,
    averageRevenuePerPatient,
    highestRevenueTest: testEntries[0]?.[0],
    lowestRevenueTest: testEntries[testEntries.length - 1]?.[0],
  };
}

// ---------------------------------------------------------------------------
// 6.15 Turnaround Time
// ---------------------------------------------------------------------------

function diffHours(a?: string, b?: string) {
  if (!a || !b) return undefined;
  return Math.max((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60), 0);
}

export function getTatAnalytics() {
  const perTest = new Map<string, { name: string; durations: number[] }>();
  for (const b of labStore.bookings) {
    const collectionToReport = diffHours(b.tat.sampleCollectedAt, b.tat.reportUploadedAt);
    if (collectionToReport === undefined) continue;
    const key = b.testId ?? b.testName;
    const existing = perTest.get(key) ?? { name: b.testName, durations: [] };
    existing.durations.push(collectionToReport);
    perTest.set(key, existing);
  }

  const rows = Array.from(perTest.entries()).map(([key, v]) => {
    const avg = v.durations.reduce((s, d) => s + d, 0) / v.durations.length;
    return { key, name: v.name, averageHours: Math.round(avg * 10) / 10, delayed: avg > 24, sampleCount: v.durations.length };
  });

  const overallAvg = rows.length ? rows.reduce((s, r) => s + r.averageHours, 0) / rows.length : 0;

  return {
    overallAverageHours: Math.round(overallAvg * 10) / 10,
    byTest: rows.sort((a, b) => b.averageHours - a.averageHours),
  };
}

// ---------------------------------------------------------------------------
// 6.16 Technician performance
// ---------------------------------------------------------------------------

export function getTechnicianPerformance() {
  return TECHNICIANS.map((tech) => {
    const bookings = labStore.bookings.filter((b) => b.technicianId === tech.id);
    const processed = bookings.filter((b) => b.status !== "cancelled" && b.status !== "booked");
    const uploaded = bookings.filter((b) => b.reportStatus === "Uploaded");
    const pending = bookings.filter((b) => b.reportStatus === "Pending" && b.status !== "cancelled");
    const delayed = bookings.filter((b) => {
      const hrs = diffHours(b.tat.sampleCollectedAt, b.tat.reportUploadedAt);
      return hrs !== undefined && hrs > 24;
    });
    const avgProcessing = (() => {
      const durations = bookings
        .map((b) => diffHours(b.tat.sampleCollectedAt, b.tat.reportUploadedAt))
        .filter((d): d is number => d !== undefined);
      return durations.length ? Math.round((durations.reduce((s, d) => s + d, 0) / durations.length) * 10) / 10 : 0;
    })();

    return {
      technician: tech,
      totalTestsProcessed: processed.length,
      reportsUploaded: uploaded.length,
      averageProcessingHours: avgProcessing,
      pendingReports: pending.length,
      delayedReports: delayed.length,
    };
  });
}

// ---------------------------------------------------------------------------
// 6.17 / 6.18 Referring doctor & hospital analytics
// ---------------------------------------------------------------------------

export function getReferralAnalytics() {
  const referred = labStore.bookings.filter((b) => b.doctorId && b.status !== "cancelled");

  const byDoctor = new Map<string, { doctor: (typeof DOCTORS)[number]; patients: Set<string>; testsBooked: number; revenue: number; tests: Map<string, number> }>();
  const byHospital = new Map<string, { hospitalId: string; hospitalName: string; patients: Set<string>; tests: number; revenue: number; pendingReports: number; testCounts: Map<string, number> }>();

  for (const b of referred) {
    const doctor = DOCTORS.find((d) => d.id === b.doctorId);
    if (doctor) {
      const existing = byDoctor.get(doctor.id) ?? { doctor, patients: new Set<string>(), testsBooked: 0, revenue: 0, tests: new Map() };
      existing.patients.add(b.uhid);
      existing.testsBooked += 1;
      if (b.paymentStatus === "paid") existing.revenue += b.amount;
      existing.tests.set(b.testName, (existing.tests.get(b.testName) ?? 0) + 1);
      byDoctor.set(doctor.id, existing);
    }
    if (b.hospitalId && b.hospitalName) {
      const existing = byHospital.get(b.hospitalId) ?? {
        hospitalId: b.hospitalId,
        hospitalName: b.hospitalName,
        patients: new Set<string>(),
        tests: 0,
        revenue: 0,
        pendingReports: 0,
        testCounts: new Map(),
      };
      existing.patients.add(b.uhid);
      existing.tests += 1;
      if (b.paymentStatus === "paid") existing.revenue += b.amount;
      if (b.reportStatus === "Pending") existing.pendingReports += 1;
      existing.testCounts.set(b.testName, (existing.testCounts.get(b.testName) ?? 0) + 1);
      byHospital.set(b.hospitalId, existing);
    }
  }

  return {
    doctors: Array.from(byDoctor.values())
      .map((d) => ({
        doctor: d.doctor,
        totalPatientsReferred: d.patients.size,
        testsBooked: d.testsBooked,
        revenueGenerated: d.revenue,
        mostRecommendedTest: Array.from(d.tests.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
      }))
      .sort((a, b) => b.revenueGenerated - a.revenueGenerated),
    hospitals: Array.from(byHospital.values())
      .map((h) => ({
        hospitalId: h.hospitalId,
        hospitalName: h.hospitalName,
        totalPatients: h.patients.size,
        totalTests: h.tests,
        revenue: h.revenue,
        pendingReports: h.pendingReports,
        mostRequestedTest: Array.from(h.testCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
      }))
      .sort((a, b) => b.revenue - a.revenue),
  };
}

// ---------------------------------------------------------------------------
// 6.22 Graphical dashboard
// ---------------------------------------------------------------------------

export function getGraphData() {
  const now = new Date();

  const dailyBookings = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * DAY_MS);
    const dayBookings = labStore.bookings.filter((b) => isSameDay(new Date(b.bookingDate), day));
    return { date: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), bookings: dayBookings.length };
  });

  const monthlyBuckets = new Map<string, { label: string; revenue: number }>();
  for (const b of labStore.bookings) {
    if (b.paymentStatus !== "paid") continue;
    const d = new Date(b.bookingDate);
    const key = monthKey(d);
    const existing = monthlyBuckets.get(key) ?? { label: monthLabel(d), revenue: 0 };
    existing.revenue += b.amount;
    monthlyBuckets.set(key, existing);
  }
  const monthlyRevenue = Array.from(monthlyBuckets.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1)).slice(-6).map(([, v]) => v);

  const testWiseRevenue = getRevenueAnalytics().byTest.slice(0, 8);

  const patientGrowth = (() => {
    const buckets = new Map<string, number>();
    for (const p of PATIENTS) {
      const key = monthKey(new Date(p.createdAt));
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const sorted = Array.from(buckets.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1));
    let cumulative = 0;
    return sorted.slice(-6).map(([key, count]) => {
      cumulative += count;
      const [y, m] = key.split("-").map(Number);
      return { label: monthLabel(new Date(y, m - 1, 1)), totalPatients: cumulative };
    });
  })();

  const reportUploadTrend = dailyBookings.map((d, i) => ({
    date: d.date,
    uploaded: labStore.bookings.filter((b) => b.tat.reportUploadedAt && isSameDay(new Date(b.tat.reportUploadedAt), new Date(now.getTime() - (13 - i) * DAY_MS))).length,
  }));

  const noShowTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = labStore.bookings.filter((b) => b.status === "no_show" && monthKey(new Date(b.bookingDate)) === monthKey(monthDate)).length;
    return { label: monthLabel(monthDate), noShows: count };
  });

  const homeCollectionTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = labStore.bookings.filter((b) => b.channel === "home_collection" && monthKey(new Date(b.bookingDate)) === monthKey(monthDate)).length;
    return { label: monthLabel(monthDate), bookings: count };
  });

  const byPatient = new Map<string, number>();
  for (const b of labStore.bookings) byPatient.set(b.uhid, (byPatient.get(b.uhid) ?? 0) + 1);
  const repeatPatientTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthBookings = labStore.bookings.filter((b) => monthKey(new Date(b.bookingDate)) === monthKey(monthDate));
    const repeat = monthBookings.filter((b) => (byPatient.get(b.uhid) ?? 0) > 1).length;
    return { label: monthLabel(monthDate), repeatRate: monthBookings.length ? Math.round((repeat / monthBookings.length) * 100) : 0 };
  });

  return { dailyBookings, monthlyRevenue, testWiseRevenue, patientGrowth, reportUploadTrend, noShowTrend, homeCollectionTrend, repeatPatientTrend };
}
