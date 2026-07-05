import { ORDERS, PRESCRIPTIONS } from "@/lib/mock/pharmacy-fixtures";
import type { Order, Prescription } from "./types";

// In-memory mutable store, seeded from the deterministic fixtures. Kept on
// `globalThis` so Next.js dev-server hot reloads don't reset in-flight demo
// edits (order status changes, prescription verification, etc.). This whole
// file is the seam to swap for real Supabase queries later.
interface PharmacyStore {
  orders: Order[];
  prescriptions: Prescription[];
}

const globalForStore = globalThis as unknown as { __pharmacyStore?: PharmacyStore };

export const pharmacyStore: PharmacyStore =
  globalForStore.__pharmacyStore ??
  (globalForStore.__pharmacyStore = {
    orders: structuredClone(ORDERS),
    prescriptions: structuredClone(PRESCRIPTIONS),
  });
