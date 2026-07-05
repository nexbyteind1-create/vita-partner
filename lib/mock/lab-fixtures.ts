import type {
  Booking,
  BookingChannel,
  BookingStatus,
  Hospital,
  Patient,
  PaymentStatus,
  ReferringDoctor,
  Technician,
  Test,
  TestPackage,
} from "@/lib/data/lab-types";

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

const rand = mulberry32(20260701 + 42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

function isoDaysAgo(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const TEST_SEED: { name: string; code: string; category: string; type: Test["type"]; sample: string; mrp: number; home: boolean }[] = [
  { name: "Complete Blood Count (CBC)", code: "LAB001", category: "Hematology", type: "Laboratory", sample: "Blood", mrp: 350, home: true },
  { name: "Lipid Profile", code: "LAB002", category: "Biochemistry", type: "Laboratory", sample: "Blood", mrp: 600, home: true },
  { name: "Thyroid Panel (T3 T4 TSH)", code: "LAB003", category: "Endocrinology", type: "Laboratory", sample: "Blood", mrp: 750, home: true },
  { name: "HbA1c", code: "LAB004", category: "Diabetes", type: "Laboratory", sample: "Blood", mrp: 450, home: true },
  { name: "Liver Function Test (LFT)", code: "LAB005", category: "Biochemistry", type: "Laboratory", sample: "Blood", mrp: 700, home: true },
  { name: "Kidney Function Test (KFT)", code: "LAB006", category: "Biochemistry", type: "Laboratory", sample: "Blood", mrp: 650, home: true },
  { name: "Urine Routine Examination", code: "LAB007", category: "Pathology", type: "Laboratory", sample: "Urine", mrp: 200, home: true },
  { name: "Vitamin D Test", code: "LAB008", category: "Vitamins", type: "Laboratory", sample: "Blood", mrp: 1200, home: true },
  { name: "Vitamin B12 Test", code: "LAB009", category: "Vitamins", type: "Laboratory", sample: "Blood", mrp: 900, home: true },
  { name: "Widal Test", code: "LAB010", category: "Microbiology", type: "Laboratory", sample: "Blood", mrp: 300, home: true },
  { name: "Stool Routine Examination", code: "LAB011", category: "Pathology", type: "Laboratory", sample: "Stool", mrp: 250, home: false },
  { name: "COVID-19 RT-PCR", code: "LAB012", category: "Microbiology", type: "Laboratory", sample: "Saliva", mrp: 800, home: true },
  { name: "X-Ray Chest", code: "DIAG001", category: "Radiology", type: "Diagnostic", sample: "N/A", mrp: 500, home: false },
  { name: "CT Scan Abdomen", code: "DIAG002", category: "Radiology", type: "Scan", sample: "N/A", mrp: 4500, home: false },
  { name: "MRI Brain", code: "DIAG003", category: "Radiology", type: "Scan", sample: "N/A", mrp: 6500, home: false },
  { name: "Ultrasound Abdomen", code: "DIAG004", category: "Radiology", type: "Diagnostic", sample: "N/A", mrp: 1200, home: false },
  { name: "ECG", code: "DIAG005", category: "Cardiology", type: "Diagnostic", sample: "N/A", mrp: 350, home: false },
  { name: "ECHO", code: "DIAG006", category: "Cardiology", type: "Diagnostic", sample: "N/A", mrp: 2200, home: false },
  { name: "Mammography", code: "DIAG007", category: "Radiology", type: "Imaging", sample: "N/A", mrp: 1800, home: false },
  { name: "PET Scan", code: "DIAG008", category: "Radiology", type: "Imaging", sample: "N/A", mrp: 18000, home: false },
];

export const CATEGORIES = Array.from(new Set(TEST_SEED.map((t) => t.category)));

export const TESTS: Test[] = TEST_SEED.map((seed, idx) => ({
  id: `test_${idx + 1}`,
  name: seed.name,
  code: seed.code,
  category: seed.category,
  type: seed.type,
  department: seed.category,
  description: `${seed.name} — standard ${seed.type.toLowerCase()} test.`,
  sampleType: seed.sample,
  fastingRequired: seed.category === "Biochemistry" || seed.category === "Diabetes",
  fastingDuration: seed.category === "Biochemistry" || seed.category === "Diabetes" ? "8-10 hours" : undefined,
  testDuration: seed.type === "Laboratory" ? "10 minutes" : "30-45 minutes",
  reportDeliveryTime: seed.type === "Laboratory" ? "Same day, 6 PM" : "24-48 hours",
  mrp: seed.mrp,
  offerPrice: rand() < 0.4 ? Math.round(seed.mrp * 0.85) : seed.mrp,
  gst: 5,
  homeCollectionAvailable: seed.home,
  safeForPregnant: rand() < 0.85,
  genderRestriction: "None",
  preparationInstructions: seed.category === "Biochemistry" || seed.category === "Diabetes" ? "Fast for 8-10 hours before the test." : "No special preparation required.",
  status: rand() < 0.9 ? "active" : "inactive",
  createdBy: "Priya Menon",
  createdAt: isoDaysAgo(randInt(60, 400)),
}));

export const PACKAGES: TestPackage[] = [
  {
    id: "pkg_1",
    name: "Full Body Checkup",
    description: "Comprehensive health screening covering blood, liver, kidney and thyroid function.",
    testIds: ["test_1", "test_2", "test_5", "test_6", "test_3"],
    price: 2200,
    offerPrice: 1699,
    homeCollectionAvailable: true,
    reportDeliveryTime: "Same day, 8 PM",
    status: "active",
  },
  {
    id: "pkg_2",
    name: "Diabetes Package",
    description: "Diabetes screening and monitoring panel.",
    testIds: ["test_4", "test_2"],
    price: 900,
    offerPrice: 749,
    homeCollectionAvailable: true,
    reportDeliveryTime: "Same day, 6 PM",
    status: "active",
  },
  {
    id: "pkg_3",
    name: "Heart Health Package",
    description: "Cardiac risk assessment panel.",
    testIds: ["test_2", "test_17", "test_18"],
    price: 3000,
    offerPrice: 2499,
    homeCollectionAvailable: false,
    reportDeliveryTime: "24 hours",
    status: "active",
  },
  {
    id: "pkg_4",
    name: "Women's Health Package",
    description: "Screening panel tailored for women's health.",
    testIds: ["test_1", "test_3", "test_8", "test_19"],
    price: 3200,
    offerPrice: 2799,
    homeCollectionAvailable: false,
    reportDeliveryTime: "24-48 hours",
    status: "active",
  },
];

// ---------------------------------------------------------------------------
// Referring doctors & hospitals
// ---------------------------------------------------------------------------

export const HOSPITALS: Hospital[] = [
  { id: "hosp_1", name: "Apollo Care Hospital" },
  { id: "hosp_2", name: "Sunrise Multispecialty Hospital" },
  { id: "hosp_3", name: "Metro Heart Institute" },
  { id: "hosp_4", name: "Green Valley General Hospital" },
];

export const DOCTORS: ReferringDoctor[] = [
  { id: "doc_1", name: "Dr. Karthik Iyer", hospitalId: "hosp_1", hospitalName: "Apollo Care Hospital", specialization: "Cardiology" },
  { id: "doc_2", name: "Dr. Meera Nair", hospitalId: "hosp_1", hospitalName: "Apollo Care Hospital", specialization: "General Medicine" },
  { id: "doc_3", name: "Dr. Arjun Sharma", hospitalId: "hosp_2", hospitalName: "Sunrise Multispecialty Hospital", specialization: "Endocrinology" },
  { id: "doc_4", name: "Dr. Rohan Kapoor", hospitalId: "hosp_3", hospitalName: "Metro Heart Institute", specialization: "Cardiology" },
  { id: "doc_5", name: "Dr. Sanjay Gupta", hospitalId: "hosp_4", hospitalName: "Green Valley General Hospital", specialization: "Orthopedics" },
];

export const TECHNICIANS: Technician[] = [
  { id: "tech_1", name: "Ravi Kumar" },
  { id: "tech_2", name: "Sunita Rao" },
  { id: "tech_3", name: "Ajay Menon" },
  { id: "tech_4", name: "Deepa Nair" },
];

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  "Aarav", "Vihaan", "Aditya", "Ishaan", "Kabir", "Ananya", "Diya", "Saanvi", "Myra", "Aadhya",
  "Reyansh", "Krishna", "Aryan", "Sai", "Rohan", "Priya", "Neha", "Pooja", "Kavya", "Meera",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Nair", "Reddy", "Gupta", "Menon", "Rao", "Kapoor", "Singh",
  "Desai", "Pillai", "Krishnan", "Joshi", "Mehta", "Kulkarni", "Patil", "Agarwal",
];

function buildPatient(index: number): Patient {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  return {
    uhid: `VITA-3${(10000 + index).toString()}`,
    name,
    mobile: `7${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${index}@example.com`,
    gender: pick(["Male", "Female", "Other"]),
    age: randInt(5, 80),
    createdAt: isoDaysAgo(randInt(30, 600)),
  };
}

export const PATIENTS: Patient[] = Array.from({ length: 55 }, (_, i) => buildPatient(i + 1));

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

const PAYMENT_STATUSES: PaymentStatus[] = ["paid", "paid", "paid", "pending", "refunded", "failed"];
const CHANNELS: BookingChannel[] = ["home_collection", "walk_in", "walk_in"];

function buildBooking(index: number): Booking {
  const daysAgo = Math.floor((index / 260) * 90);
  const patient = pick(PATIENTS);
  const usePackage = rand() < 0.2;
  const pkg = usePackage ? pick(PACKAGES) : undefined;
  const test = !usePackage ? pick(TESTS) : undefined;
  const amount = pkg ? pkg.offerPrice : test!.offerPrice;

  const isRecent = daysAgo < 2;
  let status: BookingStatus;
  if (isRecent) {
    status = pick(["booked", "sample_collected", "processing", "report_uploaded"]);
  } else {
    const roll = rand();
    status = roll < 0.75 ? "completed" : roll < 0.85 ? "cancelled" : roll < 0.95 ? "no_show" : "processing";
  }

  const bookingDate = isoDaysAgo(daysAgo, randInt(8, 18));
  const hasReferral = rand() < 0.45;
  const doctor = hasReferral ? pick(DOCTORS) : undefined;
  const technician = pick(TECHNICIANS);

  const arrivedAt = status !== "booked" && status !== "cancelled" ? isoDaysAgo(daysAgo, randInt(8, 18)) : undefined;
  const sampleCollectedAt = ["sample_collected", "processing", "report_uploaded", "completed"].includes(status)
    ? isoDaysAgo(daysAgo, randInt(9, 19))
    : undefined;
  const reportUploadedAt = ["report_uploaded", "completed"].includes(status) ? isoDaysAgo(Math.max(daysAgo - 1, 0), randInt(10, 20)) : undefined;
  const reportDownloadedAt = status === "completed" ? isoDaysAgo(Math.max(daysAgo - 1, 0), randInt(11, 21)) : undefined;

  return {
    id: `BKG${(40000 + index).toString()}`,
    uhid: patient.uhid,
    patientName: patient.name,
    mobile: patient.mobile,
    testId: test?.id,
    testName: pkg ? pkg.name : test!.name,
    packageId: pkg?.id,
    amount,
    paymentStatus: status === "cancelled" ? pick(["refunded", "failed"]) : pick(PAYMENT_STATUSES),
    channel: pick(CHANNELS),
    status,
    reportStatus: ["report_uploaded", "completed"].includes(status) ? "Uploaded" : "Pending",
    bookingDate,
    ...(doctor ? { doctorId: doctor.id, doctorName: doctor.name, hospitalId: doctor.hospitalId, hospitalName: doctor.hospitalName } : {}),
    technicianId: technician.id,
    technicianName: technician.name,
    tat: { bookedAt: bookingDate, arrivedAt, sampleCollectedAt, reportUploadedAt, reportDownloadedAt },
  };
}

export const BOOKINGS: Booking[] = Array.from({ length: 260 }, (_, i) => buildBooking(i + 1));
