"use server";

import { revalidatePath } from "next/cache";
import { labStore } from "./lab-store";
import { BOOKING_STATUS_LABEL, TEST_STATUS_LABEL } from "./lab-types";
import type { BookingStatus, Test, TestStatus } from "./lab-types";

export interface ActionResult {
  success: boolean;
  message: string;
}

function notifyPatient(uhid: string, message: string) {
  console.log(`[notify -> ${uhid}] ${message}`);
}

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus): Promise<ActionResult> {
  const booking = labStore.bookings.find((b) => b.id === bookingId);
  if (!booking) return { success: false, message: "Booking not found." };

  booking.status = status;
  const now = new Date().toISOString();
  if (status === "sample_collected") booking.tat.sampleCollectedAt = booking.tat.sampleCollectedAt ?? now;
  if (status === "report_uploaded" || status === "completed") {
    booking.reportStatus = "Uploaded";
    booking.tat.reportUploadedAt = booking.tat.reportUploadedAt ?? now;
    if (status === "completed") booking.tat.reportDownloadedAt = booking.tat.reportDownloadedAt ?? now;
  }
  if (!booking.tat.arrivedAt && status !== "booked" && status !== "cancelled") booking.tat.arrivedAt = booking.tat.arrivedAt ?? now;

  notifyPatient(booking.uhid, `Your booking ${booking.id} is now "${BOOKING_STATUS_LABEL[status]}".`);

  revalidatePath("/lab/bookings");
  revalidatePath("/lab");

  return { success: true, message: `Booking marked as ${BOOKING_STATUS_LABEL[status]}. Patient notified.` };
}

export async function setTestStatusAction(testId: string, status: TestStatus): Promise<ActionResult> {
  const test = labStore.tests.find((t) => t.id === testId);
  if (!test) return { success: false, message: "Test not found." };
  test.status = status;
  test.modifiedBy = "Priya Menon";
  test.modifiedAt = new Date().toISOString();

  revalidatePath("/lab/tests");
  return { success: true, message: `${test.name} marked as ${TEST_STATUS_LABEL[status]}.` };
}

export interface TestFormInput {
  id?: string;
  name: string;
  code: string;
  category: string;
  type: Test["type"];
  description: string;
  sampleType: string;
  testDuration: string;
  reportDeliveryTime: string;
  mrp: number;
  offerPrice: number;
  homeCollectionAvailable: boolean;
  preparationInstructions: string;
}

export async function saveTestAction(input: TestFormInput): Promise<ActionResult> {
  const now = new Date().toISOString();

  if (input.id) {
    const test = labStore.tests.find((t) => t.id === input.id);
    if (!test) return { success: false, message: "Test not found." };
    Object.assign(test, {
      name: input.name,
      code: input.code,
      category: input.category,
      type: input.type,
      description: input.description,
      sampleType: input.sampleType,
      testDuration: input.testDuration,
      reportDeliveryTime: input.reportDeliveryTime,
      mrp: input.mrp,
      offerPrice: input.offerPrice,
      homeCollectionAvailable: input.homeCollectionAvailable,
      preparationInstructions: input.preparationInstructions,
      modifiedBy: "Priya Menon",
      modifiedAt: now,
    });
    revalidatePath("/lab/tests");
    return { success: true, message: `${test.name} updated.` };
  }

  const newTest: Test = {
    id: `test_${labStore.tests.length + 1}_${Date.now()}`,
    name: input.name,
    code: input.code,
    category: input.category,
    type: input.type,
    department: input.category,
    description: input.description,
    sampleType: input.sampleType,
    fastingRequired: false,
    testDuration: input.testDuration,
    reportDeliveryTime: input.reportDeliveryTime,
    mrp: input.mrp,
    offerPrice: input.offerPrice,
    gst: 5,
    homeCollectionAvailable: input.homeCollectionAvailable,
    safeForPregnant: true,
    genderRestriction: "None",
    preparationInstructions: input.preparationInstructions,
    status: "active",
    createdBy: "Priya Menon",
    createdAt: now,
  };
  labStore.tests.unshift(newTest);

  revalidatePath("/lab/tests");
  return { success: true, message: `${newTest.name} added to the test catalogue.` };
}
