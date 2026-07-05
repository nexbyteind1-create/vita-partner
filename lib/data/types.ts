export type OrderStatus =
  | "order_received"
  | "prescription_verified"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "order_received",
  "prescription_verified",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "delivered",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  order_received: "Order Received",
  prescription_verified: "Prescription Verified",
  preparing: "Preparing Order",
  ready_for_pickup: "Ready for Pickup",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type PrescriptionStatus = "pending" | "verified" | "rejected" | "new_requested";

export const PRESCRIPTION_STATUS_LABEL: Record<PrescriptionStatus, string> = {
  pending: "Pending Verification",
  verified: "Verified",
  rejected: "Rejected",
  new_requested: "New Prescription Requested",
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type DeliveryType = "home_delivery" | "store_pickup";
export type OrderChannel = "online" | "walk_in";
export type Membership = "None" | "Silver" | "Gold" | "Platinum";

export interface Hospital {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  hospitalName: string;
  specialization: string;
}

export interface Customer {
  uhid: string;
  name: string;
  mobile: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  membership: Membership;
  walletCredits: number;
  createdAt: string;
}

export interface MedicineBatch {
  batchNo: string;
  expiryDate: string;
  quantity: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  mrp: number;
  price: number;
  stock: number;
  reorderLevel: number;
  requiresPrescription: boolean;
  batches: MedicineBatch[];
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  uhid: string;
  customerName: string;
  mobile: string;
  items: OrderItem[];
  amount: number;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  prescriptionId?: string;
  prescriptionStatus?: PrescriptionStatus;
  doctorId?: string;
  doctorName?: string;
  hospitalId?: string;
  hospitalName?: string;
  channel: OrderChannel;
  createdAt: string;
}

export interface Prescription {
  id: string;
  uhid: string;
  customerName: string;
  orderId?: string;
  fileUrl: string;
  uploadedAt: string;
  status: PrescriptionStatus;
  doctorName?: string;
  hospitalName?: string;
  remarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}
