import { CUSTOMERS, DOCTORS, HOSPITALS, MEDICINES } from "@/lib/mock/pharmacy-fixtures";
import { pharmacyStore } from "./store";
import type {
  Customer,
  Doctor,
  Medicine,
  Order,
  OrderStatus,
  Prescription,
  PrescriptionStatus,
} from "./types";

// ---------------------------------------------------------------------------
// Small date helpers
// ---------------------------------------------------------------------------

const DAY_MS = 1000 * 60 * 60 * 24;

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

// ---------------------------------------------------------------------------
// 8.1 Dashboard
// ---------------------------------------------------------------------------

export function getDashboardStats() {
  const orders = pharmacyStore.orders;
  const now = new Date();

  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length;

  const todayOrders = orders.filter((o) => isSameDay(new Date(o.createdAt), now));
  const revenueOf = (list: Order[]) =>
    list.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  return {
    totalOrders: orders.length,
    todaysOrders: todayOrders.length,
    pendingOrders: countByStatus("order_received"),
    processingOrders: countByStatus("preparing"),
    readyForPickup: countByStatus("ready_for_pickup"),
    outForDelivery: countByStatus("out_for_delivery"),
    deliveredOrders: countByStatus("delivered"),
    cancelledOrders: countByStatus("cancelled"),
    prescriptionVerificationPending: pharmacyStore.prescriptions.filter((p) => p.status === "pending").length,
    totalCustomers: CUSTOMERS.length,
    totalRevenue: revenueOf(orders),
    todaysRevenue: revenueOf(todayOrders),
    monthlyRevenue: revenueOf(orders.filter((o) => new Date(o.createdAt) >= monthStart)),
    yearlyRevenue: revenueOf(orders.filter((o) => new Date(o.createdAt) >= yearStart)),
  };
}

// ---------------------------------------------------------------------------
// 8.2 / 8.3 Orders
// ---------------------------------------------------------------------------

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | "all";
}

export function getOrders(filters: OrderFilters = {}): Order[] {
  let list = [...pharmacyStore.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filters.status && filters.status !== "all") {
    list = list.filter((o) => o.status === filters.status);
  }

  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.uhid.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.mobile.includes(q)
    );
  }

  return list;
}

export function getOrderById(id: string): Order | undefined {
  return pharmacyStore.orders.find((o) => o.id === id);
}

// ---------------------------------------------------------------------------
// 8.4 Prescriptions
// ---------------------------------------------------------------------------

export interface PrescriptionFilters {
  status?: PrescriptionStatus | "all";
}

export function getPrescriptions(filters: PrescriptionFilters = {}): Prescription[] {
  let list = [...pharmacyStore.prescriptions].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  if (filters.status && filters.status !== "all") {
    list = list.filter((p) => p.status === filters.status);
  }
  return list;
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return pharmacyStore.prescriptions.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// 8.5 / 8.7 / 8.11 Customers
// ---------------------------------------------------------------------------

export function searchCustomers(query: string): Customer[] {
  const q = query.trim().toLowerCase();
  if (!q) return CUSTOMERS.slice(0, 20);
  return CUSTOMERS.filter(
    (c) =>
      c.uhid.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      pharmacyStore.orders.some((o) => o.uhid === c.uhid && o.id.toLowerCase().includes(q))
  );
}

export function getCustomerByUhid(uhid: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.uhid === uhid);
}

export function getCustomerOrders(uhid: string): Order[] {
  return pharmacyStore.orders
    .filter((o) => o.uhid === uhid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCustomerPrescriptions(uhid: string): Prescription[] {
  return pharmacyStore.prescriptions
    .filter((p) => p.uhid === uhid)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function getCustomerSummary(uhid: string) {
  const customer = getCustomerByUhid(uhid);
  if (!customer) return undefined;
  const orders = getCustomerOrders(uhid);
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalMedicines = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  return {
    customer,
    totalOrders: orders.length,
    totalMedicinesPurchased: totalMedicines,
    totalAmountSpent: validOrders.reduce((sum, o) => sum + o.amount, 0),
    lastPurchase: orders[0]?.createdAt,
    activeOrders: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    orders,
    prescriptions: getCustomerPrescriptions(uhid),
  };
}

export function getCustomerAnalytics() {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * DAY_MS);

  const ordersByCustomer = new Map<string, Order[]>();
  for (const o of pharmacyStore.orders) {
    const list = ordersByCustomer.get(o.uhid) ?? [];
    list.push(o);
    ordersByCustomer.set(o.uhid, list);
  }

  const newCustomers = CUSTOMERS.filter((c) => new Date(c.createdAt) >= monthAgo).length;
  const returningCustomers = Array.from(ordersByCustomer.values()).filter((list) => list.length > 1).length;
  const customersWithOrders = ordersByCustomer.size;
  const repeatPurchaseRate = customersWithOrders
    ? Math.round((returningCustomers / customersWithOrders) * 100)
    : 0;

  const validOrders = pharmacyStore.orders.filter((o) => o.status !== "cancelled");
  const averageOrderValue = validOrders.length
    ? Math.round(validOrders.reduce((s, o) => s + o.amount, 0) / validOrders.length)
    : 0;

  const topCustomers = Array.from(ordersByCustomer.entries())
    .map(([uhid, orders]) => {
      const customer = getCustomerByUhid(uhid);
      const spend = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.amount, 0);
      return { customer, orders: orders.length, spend };
    })
    .filter((x) => x.customer)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 8);

  return {
    newCustomers,
    returningCustomers,
    repeatPurchaseRate,
    averageOrderValue,
    lifetimeCustomerValue: averageOrderValue * 3,
    topCustomers,
  };
}

// ---------------------------------------------------------------------------
// 8.6 Medicine-wise analytics
// ---------------------------------------------------------------------------

export function getMedicineAnalyticsList() {
  return MEDICINES.map((med) => {
    const relatedItems = pharmacyStore.orders
      .filter((o) => o.status !== "cancelled")
      .flatMap((o) => o.items.filter((it) => it.medicineId === med.id).map((it) => ({ order: o, item: it })));

    const totalQuantitySold = relatedItems.reduce((s, r) => s + r.item.quantity, 0);
    const revenue = relatedItems.reduce((s, r) => s + r.item.quantity * r.item.price, 0);
    const availableStock = med.stock;

    return {
      medicine: med,
      totalOrders: relatedItems.length,
      totalQuantitySold,
      revenueGenerated: revenue,
      availableStock,
      lowStock: availableStock > 0 && availableStock <= med.reorderLevel,
      outOfStock: availableStock === 0,
    };
  });
}

export function getMedicineDetail(medicineId: string) {
  const medicine = MEDICINES.find((m) => m.id === medicineId);
  if (!medicine) return undefined;

  const buyerMap = new Map<string, { customer: Customer | undefined; quantity: number; spend: number; lastPurchase: string }>();

  for (const order of pharmacyStore.orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      if (item.medicineId !== medicineId) continue;
      const existing = buyerMap.get(order.uhid);
      const spend = item.quantity * item.price;
      if (existing) {
        existing.quantity += item.quantity;
        existing.spend += spend;
        if (new Date(order.createdAt) > new Date(existing.lastPurchase)) existing.lastPurchase = order.createdAt;
      } else {
        buyerMap.set(order.uhid, {
          customer: getCustomerByUhid(order.uhid),
          quantity: item.quantity,
          spend,
          lastPurchase: order.createdAt,
        });
      }
    }
  }

  const buyers = Array.from(buyerMap.values())
    .filter((b) => b.customer)
    .sort((a, b) => b.spend - a.spend);

  return { medicine, buyers };
}

// ---------------------------------------------------------------------------
// 8.8 Revenue analytics
// ---------------------------------------------------------------------------

export function getRevenueAnalytics() {
  const validOrders = pharmacyStore.orders.filter((o) => o.status !== "cancelled");

  const byCategory = new Map<string, number>();
  const byMedicine = new Map<string, number>();
  for (const order of validOrders) {
    for (const item of order.items) {
      const med = MEDICINES.find((m) => m.id === item.medicineId);
      const revenue = item.quantity * item.price;
      if (med) byCategory.set(med.category, (byCategory.get(med.category) ?? 0) + revenue);
      byMedicine.set(item.medicineName, (byMedicine.get(item.medicineName) ?? 0) + revenue);
    }
  }

  const now = new Date();
  const todayRevenue = validOrders
    .filter((o) => isSameDay(new Date(o.createdAt), now))
    .reduce((s, o) => s + o.amount, 0);
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const weeklyRevenue = validOrders
    .filter((o) => new Date(o.createdAt) >= weekAgo)
    .reduce((s, o) => s + o.amount, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = validOrders
    .filter((o) => new Date(o.createdAt) >= monthStart)
    .reduce((s, o) => s + o.amount, 0);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearlyRevenue = validOrders
    .filter((o) => new Date(o.createdAt) >= yearStart)
    .reduce((s, o) => s + o.amount, 0);

  const walkInRevenue = validOrders.filter((o) => o.channel === "walk_in").reduce((s, o) => s + o.amount, 0);
  const onlineRevenue = validOrders.filter((o) => o.channel === "online").reduce((s, o) => s + o.amount, 0);

  const medicineEntries = Array.from(byMedicine.entries()).sort((a, b) => b[1] - a[1]);
  const averageOrderValue = validOrders.length
    ? Math.round(validOrders.reduce((s, o) => s + o.amount, 0) / validOrders.length)
    : 0;

  return {
    byCategory: Array.from(byCategory.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue),
    byMedicine: medicineEntries.map(([name, revenue]) => ({ name, revenue })),
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    walkInRevenue,
    onlineRevenue,
    highestSellingMedicine: medicineEntries[0]?.[0],
    lowestSellingMedicine: medicineEntries[medicineEntries.length - 1]?.[0],
    averageOrderValue,
  };
}

// ---------------------------------------------------------------------------
// 8.9 Inventory analytics
// ---------------------------------------------------------------------------

export function getInventoryAnalytics() {
  const now = new Date();
  const soon = new Date(now.getTime() + 45 * DAY_MS);

  const lowStock = MEDICINES.filter((m) => m.stock > 0 && m.stock <= m.reorderLevel);
  const outOfStock = MEDICINES.filter((m) => m.stock === 0);

  const expiringSoon: { medicine: Medicine; batch: Medicine["batches"][number] }[] = [];
  const expired: { medicine: Medicine; batch: Medicine["batches"][number] }[] = [];
  for (const med of MEDICINES) {
    for (const batch of med.batches) {
      if (batch.quantity <= 0) continue;
      const expiry = new Date(batch.expiryDate);
      if (expiry < now) expired.push({ medicine: med, batch });
      else if (expiry <= soon) expiringSoon.push({ medicine: med, batch });
    }
  }

  const salesByMedicine = getMedicineAnalyticsList().sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
  const fastMoving = salesByMedicine.slice(0, 8);
  const slowMoving = [...salesByMedicine].reverse().slice(0, 8);

  return {
    totalStockUnits: MEDICINES.reduce((s, m) => s + m.stock, 0),
    lowStock,
    outOfStock,
    expiringSoon,
    expired,
    fastMoving,
    slowMoving,
  };
}

// ---------------------------------------------------------------------------
// 8.10 Doctor & Hospital analytics
// ---------------------------------------------------------------------------

export function getReferralAnalytics() {
  const referredOrders = pharmacyStore.orders.filter((o) => o.doctorId && o.status !== "cancelled");

  const byDoctor = new Map<string, { doctor: Doctor; prescriptions: number; revenue: number }>();
  const byHospital = new Map<string, { hospitalId: string; hospitalName: string; orders: number; revenue: number }>();
  const medicineCountByDoctor = new Map<string, Map<string, number>>();

  for (const order of referredOrders) {
    const doctor = DOCTORS.find((d) => d.id === order.doctorId);
    if (doctor) {
      const existing = byDoctor.get(doctor.id) ?? { doctor, prescriptions: 0, revenue: 0 };
      existing.prescriptions += 1;
      existing.revenue += order.amount;
      byDoctor.set(doctor.id, existing);

      const medMap = medicineCountByDoctor.get(doctor.id) ?? new Map<string, number>();
      for (const item of order.items) {
        medMap.set(item.medicineName, (medMap.get(item.medicineName) ?? 0) + item.quantity);
      }
      medicineCountByDoctor.set(doctor.id, medMap);
    }
    if (order.hospitalId && order.hospitalName) {
      const existing = byHospital.get(order.hospitalId) ?? {
        hospitalId: order.hospitalId,
        hospitalName: order.hospitalName,
        orders: 0,
        revenue: 0,
      };
      existing.orders += 1;
      existing.revenue += order.amount;
      byHospital.set(order.hospitalId, existing);
    }
  }

  const allMedicineCounts = new Map<string, number>();
  for (const order of referredOrders) {
    for (const item of order.items) {
      allMedicineCounts.set(item.medicineName, (allMedicineCounts.get(item.medicineName) ?? 0) + item.quantity);
    }
  }

  return {
    doctors: Array.from(byDoctor.values())
      .map((d) => ({
        ...d,
        mostPrescribed: Array.from(medicineCountByDoctor.get(d.doctor.id)?.entries() ?? []).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0],
      }))
      .sort((a, b) => b.revenue - a.revenue),
    hospitals: Array.from(byHospital.values()).sort((a, b) => b.revenue - a.revenue),
    mostPrescribedMedicines: Array.from(allMedicineCounts.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8),
  };
}

// ---------------------------------------------------------------------------
// 8.12 Graphical dashboard data
// ---------------------------------------------------------------------------

export function getGraphData() {
  const now = new Date();

  const dailyOrders = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now.getTime() - (13 - i) * DAY_MS);
    const dayOrders = pharmacyStore.orders.filter((o) => isSameDay(new Date(o.createdAt), day));
    return {
      date: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      orders: dayOrders.length,
      revenue: dayOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.amount, 0),
    };
  });

  const monthlyBuckets = new Map<string, { label: string; revenue: number; orders: number }>();
  for (const order of pharmacyStore.orders) {
    const d = new Date(order.createdAt);
    const key = monthKey(d);
    const existing = monthlyBuckets.get(key) ?? { label: monthLabel(d), revenue: 0, orders: 0 };
    existing.orders += 1;
    if (order.status !== "cancelled") existing.revenue += order.amount;
    monthlyBuckets.set(key, existing);
  }
  const monthlySales = Array.from(monthlyBuckets.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .slice(-6)
    .map(([, v]) => v);

  const categoryRevenue = getRevenueAnalytics().byCategory.slice(0, 8);

  const customerGrowth = (() => {
    const buckets = new Map<string, number>();
    for (const c of CUSTOMERS) {
      const d = new Date(c.createdAt);
      const key = monthKey(d);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const sorted = Array.from(buckets.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1));
    let cumulative = 0;
    return sorted.slice(-6).map(([key, count]) => {
      cumulative += count;
      const [y, m] = key.split("-").map(Number);
      return { label: monthLabel(new Date(y, m - 1, 1)), newCustomers: count, totalCustomers: cumulative };
    });
  })();

  const repeatCustomerTrend = monthlySales.map((bucket, i) => ({
    label: bucket.label,
    repeatRate: Math.min(85, 30 + i * 6 + Math.round(rand12(i) * 10)),
  }));

  const topSellingMedicines = getMedicineAnalyticsList()
    .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
    .slice(0, 6)
    .map((m) => ({ name: m.medicine.name, quantity: m.totalQuantitySold }));

  const inventoryByCategory = CATEGORIES_WITH_STOCK();

  return {
    dailyOrders,
    monthlySales,
    categoryRevenue,
    customerGrowth,
    repeatCustomerTrend,
    topSellingMedicines,
    inventoryByCategory,
  };
}

function rand12(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function CATEGORIES_WITH_STOCK() {
  const map = new Map<string, number>();
  for (const med of MEDICINES) {
    map.set(med.category, (map.get(med.category) ?? 0) + med.stock);
  }
  return Array.from(map.entries()).map(([category, stock]) => ({ category, stock }));
}
