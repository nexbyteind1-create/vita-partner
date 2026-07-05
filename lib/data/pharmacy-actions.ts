"use server";

import { revalidatePath } from "next/cache";
import { pharmacyStore } from "./store";
import { ORDER_STATUS_LABEL, type OrderStatus, type PrescriptionStatus } from "./types";

export interface ActionResult {
  success: boolean;
  message: string;
}

// Mock "notify customer" side-effect. Replace with real SMS/Email/Push once a
// backend + notification provider (Twilio/SendGrid/FCM) is wired in.
function notifyCustomer(mobile: string, message: string) {
  console.log(`[notify -> ${mobile}] ${message}`);
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<ActionResult> {
  const order = pharmacyStore.orders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Order not found." };

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date().toISOString(), note });

  notifyCustomer(order.mobile, `Your order ${order.id} is now "${ORDER_STATUS_LABEL[status]}".`);

  revalidatePath("/pharmacy/orders");
  revalidatePath(`/pharmacy/orders/${orderId}`);
  revalidatePath("/pharmacy");

  return { success: true, message: `Order marked as ${ORDER_STATUS_LABEL[status]}. Customer notified.` };
}

export async function updatePrescriptionStatusAction(
  prescriptionId: string,
  status: PrescriptionStatus,
  remarks?: string,
  verifiedBy = "Ananya Rao"
): Promise<ActionResult> {
  const prescription = pharmacyStore.prescriptions.find((p) => p.id === prescriptionId);
  if (!prescription) return { success: false, message: "Prescription not found." };

  prescription.status = status;
  prescription.remarks = remarks;
  if (status === "verified" || status === "rejected") {
    prescription.verifiedBy = verifiedBy;
    prescription.verifiedAt = new Date().toISOString();
  }

  if (prescription.orderId) {
    const order = pharmacyStore.orders.find((o) => o.id === prescription.orderId);
    if (order) {
      order.prescriptionStatus = status;
      if (status === "verified" && order.status === "order_received") {
        order.status = "prescription_verified";
        order.statusHistory.push({ status: "prescription_verified", timestamp: new Date().toISOString() });
      }
    }
  }

  const messages: Record<PrescriptionStatus, string> = {
    pending: "Your prescription is pending verification.",
    verified: "Your prescription has been verified.",
    rejected: `Your prescription was rejected.${remarks ? ` Reason: ${remarks}` : ""}`,
    new_requested: "Please upload a new, clearer prescription.",
  };
  console.log(`[notify -> ${prescription.uhid}] ${messages[status]}`);

  revalidatePath("/pharmacy/prescriptions");
  revalidatePath("/pharmacy");

  return { success: true, message: `Prescription ${prescriptionId} updated. Customer notified.` };
}
