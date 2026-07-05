import { BOOKINGS, PACKAGES, TESTS } from "@/lib/mock/lab-fixtures";
import type { Booking, Test, TestPackage } from "./lab-types";

interface LabStore {
  bookings: Booking[];
  tests: Test[];
  packages: TestPackage[];
}

const globalForStore = globalThis as unknown as { __labStore?: LabStore };

export const labStore: LabStore =
  globalForStore.__labStore ??
  (globalForStore.__labStore = {
    bookings: structuredClone(BOOKINGS),
    tests: structuredClone(TESTS),
    packages: structuredClone(PACKAGES),
  });
