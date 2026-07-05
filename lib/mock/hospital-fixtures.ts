import type {
  Admission,
  Appointment,
  AppointmentStatus,
  DiagnosticBooking,
  Doctor,
  FollowUp,
  FollowUpStatus,
  LabBooking,
  MedicalDocument,
  MedicalDocumentType,
  NoShowReason,
  Patient,
  PaymentStatus,
  PharmacyBill,
  Staff,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/data/hospital-types";

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260701 + 7);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

function isoDaysOffset(days: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Departments, Doctors, Staff
// ---------------------------------------------------------------------------

export const DEPARTMENTS = [
  "Cardiology",
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "ENT",
  "Dermatology",
  "Endocrinology",
  "Cardiac Surgery",
  "Neurology",
  "Gynecology",
];

const DOCTOR_NAMES = [
  "Dr. Karthik Iyer", "Dr. Meera Nair", "Dr. Arjun Sharma", "Dr. Sneha Reddy", "Dr. Vivek Menon",
  "Dr. Anjali Desai", "Dr. Rohan Kapoor", "Dr. Divya Pillai", "Dr. Sanjay Gupta", "Dr. Kavya Krishnan",
  "Dr. Nikhil Rao", "Dr. Pooja Bhat",
];

const STAFF_NAMES = ["Ritu Verma", "Suresh Nambiar", "Farah Khan", "Deepak Joshi", "Latha Subramaniam", "Manoj Tiwari"];

export const STAFF: Staff[] = STAFF_NAMES.map((name, i) => ({
  id: `staff_${i + 1}`,
  name,
  mobile: `9${randInt(100000000, 999999999)}`,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@apollocare.demo`,
  designation: pick(["Front Desk Coordinator", "Nursing Staff", "Ward Assistant", "Patient Coordinator"]),
  assignedDoctorIds: [],
  status: "active",
}));

export const DOCTORS: Doctor[] = DOCTOR_NAMES.map((name, i) => {
  const staff = STAFF[i % STAFF.length];
  staff.assignedDoctorIds.push(`doc_${i + 1}`);
  return {
    id: `doc_${i + 1}`,
    uhid: `DOC-${(2000 + i).toString()}`,
    name,
    photoUrl: "/mock-avatar.svg",
    mobile: `9${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@apollocare.demo`,
    specialization: DEPARTMENTS[i % DEPARTMENTS.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    experienceYears: randInt(3, 24),
    consultationFee: pick([500, 700, 800, 1000, 1200, 1500]),
    rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
    status: rand() < 0.9 ? "active" : "inactive",
    assignedStaffId: staff.id,
  };
});

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  "Aarav", "Vihaan", "Aditya", "Ishaan", "Kabir", "Ananya", "Diya", "Saanvi", "Myra", "Aadhya",
  "Reyansh", "Krishna", "Aryan", "Sai", "Rohan", "Priya", "Neha", "Pooja", "Kavya", "Meera",
  "Rahul", "Sanjay", "Vikram", "Arjun", "Nikhil", "Divya", "Shreya", "Anjali", "Riya", "Isha",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Nair", "Reddy", "Gupta", "Menon", "Rao", "Kapoor", "Singh",
  "Desai", "Pillai", "Krishnan", "Joshi", "Mehta", "Chatterjee", "Bose", "Kulkarni", "Patil", "Agarwal",
];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function buildPatient(index: number): Patient {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  return {
    uhid: `VITA-2${(10000 + index).toString()}`,
    name,
    mobile: `8${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${index}@example.com`,
    gender: pick(["Male", "Female", "Other"]),
    age: randInt(2, 82),
    bloodGroup: pick(BLOOD_GROUPS),
    photoUrl: "/mock-avatar.svg",
    createdAt: isoDaysOffset(-randInt(30, 700)),
  };
}

export const PATIENTS: Patient[] = Array.from({ length: 70 }, (_, i) => buildPatient(i + 1));

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

function buildAppointment(index: number): Appointment {
  // Spread across -60 days .. +14 days
  const dayOffset = Math.floor((index / 230) * 74) - 60;
  const patient = pick(PATIENTS);
  const doctor = pick(DOCTORS.filter((d) => d.status === "active"));
  const isPast = dayOffset < 0;
  const isToday = dayOffset === 0;

  let status: AppointmentStatus;
  if (dayOffset > 0) {
    status = "scheduled";
  } else if (isToday) {
    status = pick(["scheduled", "checked_in", "waiting", "consultation_started", "completed"]);
  } else {
    const roll = rand();
    status = roll < 0.72 ? "completed" : roll < 0.83 ? "cancelled" : roll < 0.93 ? "no_show" : "rescheduled";
  }

  const createdAt = isoDaysOffset(dayOffset - randInt(1, 5));

  return {
    id: `APT${(20000 + index).toString()}`,
    uhid: patient.uhid,
    patientName: patient.name,
    patientAge: patient.age,
    patientMobile: patient.mobile,
    patientEmail: patient.email,
    patientPhotoUrl: patient.photoUrl,
    doctorId: doctor.id,
    doctorName: doctor.name,
    department: doctor.department,
    date: isoDaysOffset(dayOffset, randInt(9, 17), pick([0, 15, 30, 45])),
    status,
    consultationFee: doctor.consultationFee,
    ...(status === "no_show"
      ? { noShowReason: pick<NoShowReason>(["Patient Did Not Arrive", "Patient Cancelled Offline", "Doctor Unavailable", "Hospital Closed", "Other"]) }
      : {}),
    notes: [],
    createdAt,
  };
}

export const APPOINTMENTS: Appointment[] = Array.from({ length: 230 }, (_, i) => buildAppointment(i + 1));

// ---------------------------------------------------------------------------
// Billing: Laboratory / Diagnostic / Pharmacy / Admission
// ---------------------------------------------------------------------------

const LAB_NAMES = ["Vita Diagnostics Lab", "Metro Path Labs", "SRL Diagnostics", "City Care Labs"];
const LAB_TESTS = ["Complete Blood Count", "Lipid Profile", "Thyroid Panel", "HbA1c", "Liver Function Test", "Kidney Function Test"];
const DIAGNOSTIC_CENTERS = ["Vita Imaging Center", "Metro Scan Center", "Apollo Radiology"];
const DIAGNOSTIC_TESTS = ["X-Ray Chest", "CT Scan Abdomen", "MRI Brain", "Ultrasound Abdomen", "ECG", "ECHO"];
const PHARMACY_NAMES = ["Vita Pharmacy — MG Road", "Apollo Pharmacy", "MedPlus"];
const PAYMENT_STATUSES: PaymentStatus[] = ["paid", "paid", "paid", "pending", "refunded", "failed"];

function completedAppointmentPatients() {
  return APPOINTMENTS.filter((a) => a.status === "completed");
}

export const LAB_BOOKINGS: LabBooking[] = completedAppointmentPatients()
  .filter(() => rand() < 0.4)
  .map((appt, i) => ({
    id: `LAB${(3000 + i).toString()}`,
    uhid: appt.uhid,
    patientName: appt.patientName,
    labName: pick(LAB_NAMES),
    testName: pick(LAB_TESTS),
    amount: randInt(300, 2500),
    paymentStatus: pick(PAYMENT_STATUSES),
    bookingDate: appt.date,
    reportStatus: rand() < 0.8 ? "Uploaded" : "Pending",
  }));

export const DIAGNOSTIC_BOOKINGS: DiagnosticBooking[] = completedAppointmentPatients()
  .filter(() => rand() < 0.3)
  .map((appt, i) => ({
    id: `DIAG${(4000 + i).toString()}`,
    uhid: appt.uhid,
    patientName: appt.patientName,
    diagnosticCenter: pick(DIAGNOSTIC_CENTERS),
    testName: pick(DIAGNOSTIC_TESTS),
    amount: randInt(800, 8000),
    paymentStatus: pick(PAYMENT_STATUSES),
    bookingDate: appt.date,
    reportStatus: rand() < 0.75 ? "Uploaded" : "Pending",
    doctorName: appt.doctorName,
  }));

export const PHARMACY_BILLS: PharmacyBill[] = completedAppointmentPatients()
  .filter(() => rand() < 0.35)
  .map((appt, i) => ({
    id: `PHB${(5000 + i).toString()}`,
    uhid: appt.uhid,
    patientName: appt.patientName,
    pharmacyName: pick(PHARMACY_NAMES),
    billNumber: `BILL-${(90000 + i).toString()}`,
    amount: randInt(100, 3000),
    paymentStatus: pick(PAYMENT_STATUSES),
    purchaseDate: appt.date,
  }));

export const ADMISSIONS: Admission[] = completedAppointmentPatients()
  .filter(() => rand() < 0.08)
  .map((appt, i) => {
    const admissionDate = appt.date;
    const discharged = rand() < 0.85;
    const dischargeDays = randInt(1, 6);
    const d = new Date(admissionDate);
    d.setDate(d.getDate() + dischargeDays);
    return {
      id: `ADM${(6000 + i).toString()}`,
      uhid: appt.uhid,
      patientName: appt.patientName,
      admissionDate,
      dischargeDate: discharged ? d.toISOString() : undefined,
      treatingDoctor: appt.doctorName,
      charges: randInt(15000, 180000),
      paymentStatus: pick(PAYMENT_STATUSES),
      status: discharged ? "Discharged" : "Admitted",
    };
  });

// ---------------------------------------------------------------------------
// Medical Documents
// ---------------------------------------------------------------------------

const DOC_TYPES_BY_CONTEXT: MedicalDocumentType[] = ["prescription", "lab_report", "diagnostic_report", "discharge_summary", "referral_letter", "other"];

export const MEDICAL_DOCUMENTS: MedicalDocument[] = completedAppointmentPatients()
  .filter(() => rand() < 0.5)
  .map((appt, i) => {
    const type = pick(DOC_TYPES_BY_CONTEXT);
    return {
      id: `DOC${(7000 + i).toString()}`,
      uhid: appt.uhid,
      patientName: appt.patientName,
      type,
      title: `${appt.patientName} — ${type.replace(/_/g, " ")}`,
      fileUrl: "/mock-prescription.svg",
      uploadedBy: "Dr. Karthik Iyer",
      uploadedAt: appt.date,
      version: 1,
      doctorName: appt.doctorName,
      department: appt.department,
      appointmentId: appt.id,
    };
  });

// ---------------------------------------------------------------------------
// Support Tickets
// ---------------------------------------------------------------------------

const TICKET_SUBJECTS: { category: SupportTicketCategory; subject: string }[] = [
  { category: "Technical Issue", subject: "Unable to load appointment calendar" },
  { category: "Appointment Issue", subject: "Duplicate appointment booked for patient" },
  { category: "Doctor Availability Issue", subject: "Doctor slots not updating for next week" },
  { category: "Patient Issue", subject: "Patient unable to view uploaded reports" },
  { category: "Payment Issue", subject: "Payment captured but appointment not confirmed" },
  { category: "Other", subject: "Request for additional staff login" },
];

const TICKET_STATUSES: SupportTicketStatus[] = ["open", "assigned", "in_progress", "waiting_response", "resolved", "closed"];

export const SUPPORT_TICKETS: SupportTicket[] = Array.from({ length: 14 }, (_, i) => {
  const seed = pick(TICKET_SUBJECTS);
  const createdAt = isoDaysOffset(-randInt(0, 45));
  return {
    id: `TCK${(8000 + i).toString()}`,
    subject: seed.subject,
    category: seed.category,
    priority: pick<SupportTicketPriority>(["Low", "Medium", "High", "Critical"]),
    description: `${seed.subject}. Reported by hospital admin staff for follow-up by the Vita support team.`,
    status: pick(TICKET_STATUSES),
    contactNumber: `9${randInt(100000000, 999999999)}`,
    email: "admin@apollocare.demo",
    raisedBy: "Dr. Karthik Iyer",
    createdAt,
    updatedAt: createdAt,
  };
});

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export const FOLLOW_UPS: FollowUp[] = completedAppointmentPatients()
  .filter(() => rand() < 0.25)
  .map((appt, i) => {
    const followUpDayOffset = randInt(-10, 20);
    let status: FollowUpStatus;
    if (followUpDayOffset > 0) status = "upcoming";
    else status = pick(["completed", "completed", "missed", "cancelled"]);
    return {
      id: `FU${(9000 + i).toString()}`,
      uhid: appt.uhid,
      patientName: appt.patientName,
      doctorId: appt.doctorId,
      doctorName: appt.doctorName,
      department: appt.department,
      followUpDate: isoDaysOffset(followUpDayOffset, randInt(9, 17)),
      type: pick(["Routine Follow-up", "Post-Surgery Review", "Lab Result Review", "Medication Review"]),
      remarks: rand() < 0.5 ? "Bring previous reports for comparison." : undefined,
      status,
      attachedDocumentIds: [],
      createdAt: appt.date,
    };
  });
