import type {
  Customer,
  Doctor,
  DeliveryType,
  Hospital,
  Medicine,
  MedicineBatch,
  Order,
  OrderChannel,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Prescription,
  PrescriptionStatus,
  StatusHistoryEntry,
} from "@/lib/data/types";
import { ORDER_STATUS_FLOW } from "@/lib/data/types";

// Deterministic PRNG (mulberry32) so mock data is stable across server restarts.
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

const rand = mulberry32(20260701);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

function isoDaysAgo(days: number, hourOffset = 0): string {
  const d = new Date();
  d.setHours(9 + hourOffset, randInt(0, 59), 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Hospitals & Doctors
// ---------------------------------------------------------------------------

export const HOSPITALS: Hospital[] = [
  { id: "hosp_1", name: "Apollo Care Hospital" },
  { id: "hosp_2", name: "Sunrise Multispecialty Hospital" },
  { id: "hosp_3", name: "Lakeview Children's Hospital" },
  { id: "hosp_4", name: "Metro Heart Institute" },
  { id: "hosp_5", name: "Green Valley General Hospital" },
];

export const DOCTORS: Doctor[] = [
  { id: "doc_1", name: "Dr. Karthik Iyer", hospitalId: "hosp_1", hospitalName: "Apollo Care Hospital", specialization: "Cardiology" },
  { id: "doc_2", name: "Dr. Meera Nair", hospitalId: "hosp_1", hospitalName: "Apollo Care Hospital", specialization: "General Medicine" },
  { id: "doc_3", name: "Dr. Arjun Sharma", hospitalId: "hosp_2", hospitalName: "Sunrise Multispecialty Hospital", specialization: "Endocrinology" },
  { id: "doc_4", name: "Dr. Sneha Reddy", hospitalId: "hosp_2", hospitalName: "Sunrise Multispecialty Hospital", specialization: "Dermatology" },
  { id: "doc_5", name: "Dr. Vivek Menon", hospitalId: "hosp_3", hospitalName: "Lakeview Children's Hospital", specialization: "Pediatrics" },
  { id: "doc_6", name: "Dr. Anjali Desai", hospitalId: "hosp_3", hospitalName: "Lakeview Children's Hospital", specialization: "Pediatrics" },
  { id: "doc_7", name: "Dr. Rohan Kapoor", hospitalId: "hosp_4", hospitalName: "Metro Heart Institute", specialization: "Cardiology" },
  { id: "doc_8", name: "Dr. Divya Pillai", hospitalId: "hosp_4", hospitalName: "Metro Heart Institute", specialization: "Cardiac Surgery" },
  { id: "doc_9", name: "Dr. Sanjay Gupta", hospitalId: "hosp_5", hospitalName: "Green Valley General Hospital", specialization: "Orthopedics" },
  { id: "doc_10", name: "Dr. Kavya Krishnan", hospitalId: "hosp_5", hospitalName: "Green Valley General Hospital", specialization: "ENT" },
];

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------

const MEDICINE_SEED: { name: string; category: string; mrp: number; rx: boolean }[] = [
  { name: "Paracetamol 650mg", category: "Pain Relief", mrp: 30, rx: false },
  { name: "Ibuprofen 400mg", category: "Pain Relief", mrp: 45, rx: false },
  { name: "Diclofenac Gel", category: "Pain Relief", mrp: 120, rx: false },
  { name: "Aspirin 75mg", category: "Cardiac Care", mrp: 25, rx: true },
  { name: "Amoxicillin 500mg", category: "Antibiotics", mrp: 85, rx: true },
  { name: "Azithromycin 500mg", category: "Antibiotics", mrp: 110, rx: true },
  { name: "Ciprofloxacin 500mg", category: "Antibiotics", mrp: 95, rx: true },
  { name: "Vitamin D3 60K", category: "Vitamins & Supplements", mrp: 32, rx: false },
  { name: "Multivitamin Tablets", category: "Vitamins & Supplements", mrp: 180, rx: false },
  { name: "Calcium + Vitamin D3", category: "Vitamins & Supplements", mrp: 210, rx: false },
  { name: "Vitamin C Chewable", category: "Vitamins & Supplements", mrp: 150, rx: false },
  { name: "Metformin 500mg", category: "Diabetes Care", mrp: 55, rx: true },
  { name: "Glimepiride 2mg", category: "Diabetes Care", mrp: 78, rx: true },
  { name: "Insulin Glargine Pen", category: "Diabetes Care", mrp: 650, rx: true },
  { name: "Atorvastatin 10mg", category: "Cardiac Care", mrp: 88, rx: true },
  { name: "Telmisartan 40mg", category: "Cardiac Care", mrp: 95, rx: true },
  { name: "Clopidogrel 75mg", category: "Cardiac Care", mrp: 130, rx: true },
  { name: "Cetirizine 10mg", category: "Respiratory", mrp: 20, rx: false },
  { name: "Montelukast 10mg", category: "Respiratory", mrp: 145, rx: true },
  { name: "Salbutamol Inhaler", category: "Respiratory", mrp: 210, rx: true },
  { name: "Cough Syrup", category: "Respiratory", mrp: 95, rx: false },
  { name: "Pantoprazole 40mg", category: "Digestive Health", mrp: 68, rx: false },
  { name: "Ondansetron 4mg", category: "Digestive Health", mrp: 40, rx: true },
  { name: "ORS Sachets", category: "Digestive Health", mrp: 20, rx: false },
  { name: "Antacid Suspension", category: "Digestive Health", mrp: 85, rx: false },
  { name: "Moisturizing Lotion", category: "Skin Care", mrp: 175, rx: false },
  { name: "Sunscreen SPF 50", category: "Skin Care", mrp: 320, rx: false },
  { name: "Clotrimazole Cream", category: "Skin Care", mrp: 60, rx: false },
  { name: "Lubricant Eye Drops", category: "Eye Care", mrp: 110, rx: false },
  { name: "Antibiotic Eye Drops", category: "Eye Care", mrp: 95, rx: true },
  { name: "Baby Diaper Rash Cream", category: "Baby Care", mrp: 140, rx: false },
  { name: "Infant Gripe Water", category: "Baby Care", mrp: 65, rx: false },
  { name: "Baby Multivitamin Drops", category: "Baby Care", mrp: 165, rx: true },
];

export const CATEGORIES = Array.from(new Set(MEDICINE_SEED.map((m) => m.category)));

function generateBatches(medIndex: number, stock: number): MedicineBatch[] {
  const batchCount = randInt(1, 3);
  const batches: MedicineBatch[] = [];
  let remaining = stock;
  for (let i = 0; i < batchCount; i++) {
    const isLast = i === batchCount - 1;
    const qty = isLast ? remaining : Math.max(0, Math.floor(remaining * rand()));
    remaining -= qty;
    // Spread expiries: some already expired, some expiring soon, most safely in future.
    const expiryRoll = rand();
    let expiryDays: number;
    if (expiryRoll < 0.08) expiryDays = -randInt(1, 40); // expired
    else if (expiryRoll < 0.22) expiryDays = randInt(1, 45); // expiring soon
    else expiryDays = randInt(120, 720);
    batches.push({
      batchNo: `B${medIndex}${i}${randInt(100, 999)}`,
      expiryDate: isoDaysFromNow(expiryDays),
      quantity: qty,
    });
  }
  return batches;
}

export const MEDICINES: Medicine[] = MEDICINE_SEED.map((seed, idx) => {
  const stock = randInt(0, 400);
  const offerFactor = rand() < 0.4 ? 0.9 : 1;
  return {
    id: `med_${idx + 1}`,
    name: seed.name,
    category: seed.category,
    mrp: seed.mrp,
    price: Math.round(seed.mrp * offerFactor),
    stock,
    reorderLevel: 40,
    requiresPrescription: seed.rx,
    batches: generateBatches(idx + 1, stock),
  };
});

// ---------------------------------------------------------------------------
// Customers
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

function generateCustomer(index: number): Customer {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const memberships: Customer["membership"][] = ["None", "None", "None", "Silver", "Silver", "Gold", "Platinum"];
  return {
    uhid: `VITA-${(100000 + index).toString()}`,
    name,
    mobile: `9${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${index}@example.com`,
    gender: pick(["Male", "Female", "Other"]),
    age: randInt(4, 78),
    membership: pick(memberships),
    walletCredits: pick([0, 0, 0, 50, 100, 150, 250]),
    createdAt: isoDaysAgo(randInt(30, 720)),
  };
}

export const CUSTOMERS: Customer[] = Array.from({ length: 60 }, (_, i) => generateCustomer(i + 1));

// ---------------------------------------------------------------------------
// Orders & Prescriptions
// ---------------------------------------------------------------------------

const PAYMENT_STATUSES: PaymentStatus[] = ["paid", "paid", "paid", "paid", "pending", "failed", "refunded"];
const DELIVERY_TYPES: DeliveryType[] = ["home_delivery", "store_pickup"];
const CHANNELS: OrderChannel[] = ["online", "online", "online", "walk_in"];

function buildStatusHistory(finalStatus: OrderStatus, createdAt: string): StatusHistoryEntry[] {
  const history: StatusHistoryEntry[] = [];
  const created = new Date(createdAt).getTime();
  const flowIndex = finalStatus === "cancelled" ? randInt(0, 3) : ORDER_STATUS_FLOW.indexOf(finalStatus);
  const steps = finalStatus === "cancelled"
    ? [...ORDER_STATUS_FLOW.slice(0, flowIndex + 1), "cancelled" as OrderStatus]
    : ORDER_STATUS_FLOW.slice(0, flowIndex + 1);

  steps.forEach((status, i) => {
    history.push({
      status,
      timestamp: new Date(created + i * 1000 * 60 * 45).toISOString(),
    });
  });
  return history;
}

function buildOrder(index: number): Order {
  const daysAgo = Math.floor((index / 190) * 185);
  const createdAt = isoDaysAgo(daysAgo, randInt(0, 10));
  const customer = pick(CUSTOMERS);
  const itemCount = randInt(1, 4);
  const chosenMeds = new Set<string>();
  const items: OrderItem[] = [];
  while (chosenMeds.size < itemCount) {
    const med = pick(MEDICINES);
    if (chosenMeds.has(med.id)) continue;
    chosenMeds.add(med.id);
    const quantity = randInt(1, 3);
    items.push({ medicineId: med.id, medicineName: med.name, quantity, price: med.price });
  }
  const amount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const isRecent = daysAgo < 3;
  let status: OrderStatus;
  if (isRecent) {
    status = pick(["order_received", "prescription_verified", "preparing", "ready_for_pickup", "out_for_delivery"]);
  } else {
    const roll = rand();
    status = roll < 0.82 ? "delivered" : roll < 0.94 ? "cancelled" : "out_for_delivery";
  }

  const needsPrescription = items.some((it) => MEDICINES.find((m) => m.id === it.medicineId)?.requiresPrescription);
  const hasReferral = needsPrescription && rand() < 0.7;
  const doctor = hasReferral ? pick(DOCTORS) : undefined;

  const order: Order = {
    id: `ORD${(10000 + index).toString()}`,
    uhid: customer.uhid,
    customerName: customer.name,
    mobile: customer.mobile,
    items,
    amount,
    paymentStatus: status === "cancelled" ? pick(["refunded", "failed"]) : pick(PAYMENT_STATUSES),
    deliveryType: pick(DELIVERY_TYPES),
    status,
    statusHistory: buildStatusHistory(status, createdAt),
    channel: pick(CHANNELS),
    createdAt,
    ...(needsPrescription
      ? {
          prescriptionId: `RX${(10000 + index).toString()}`,
          prescriptionStatus: status === "order_received" ? pick(["pending", "verified"]) : "verified",
        }
      : {}),
    ...(doctor
      ? { doctorId: doctor.id, doctorName: doctor.name, hospitalId: doctor.hospitalId, hospitalName: doctor.hospitalName }
      : {}),
  };

  return order;
}

export const ORDERS: Order[] = Array.from({ length: 190 }, (_, i) => buildOrder(i + 1));

function buildPrescriptionsFromOrders(): Prescription[] {
  const list: Prescription[] = [];
  for (const order of ORDERS) {
    if (!order.prescriptionId) continue;
    list.push({
      id: order.prescriptionId,
      uhid: order.uhid,
      customerName: order.customerName,
      orderId: order.id,
      fileUrl: "/mock-prescription.svg",
      uploadedAt: order.createdAt,
      status: (order.prescriptionStatus ?? "pending") as PrescriptionStatus,
      doctorName: order.doctorName,
      hospitalName: order.hospitalName,
      ...(order.prescriptionStatus === "verified"
        ? { verifiedBy: "Ananya Rao", verifiedAt: order.createdAt }
        : {}),
    });
  }

  // A handful of standalone prescriptions awaiting verification (not yet turned into a confirmed order).
  for (let i = 0; i < 9; i++) {
    const customer = pick(CUSTOMERS);
    const doctor = rand() < 0.6 ? pick(DOCTORS) : undefined;
    list.push({
      id: `RXQ${(500 + i).toString()}`,
      uhid: customer.uhid,
      customerName: customer.name,
      fileUrl: "/mock-prescription.svg",
      uploadedAt: isoDaysAgo(randInt(0, 4)),
      status: "pending",
      doctorName: doctor?.name,
      hospitalName: doctor?.hospitalName,
    });
  }

  return list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export const PRESCRIPTIONS: Prescription[] = buildPrescriptionsFromOrders();
