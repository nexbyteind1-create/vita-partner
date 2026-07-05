export type TestType = "Laboratory" | "Diagnostic" | "Scan" | "Imaging";
export type TestStatus = "active" | "inactive" | "hidden" | "out_of_service";

export const TEST_STATUS_LABEL: Record<TestStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  hidden: "Hidden",
  out_of_service: "Out of Service",
};

export interface Test {
  id: string;
  name: string;
  code: string;
  category: string;
  type: TestType;
  department: string;
  description: string;
  sampleType: string;
  fastingRequired: boolean;
  fastingDuration?: string;
  testDuration: string;
  reportDeliveryTime: string;
  mrp: number;
  offerPrice: number;
  gst: number;
  homeCollectionAvailable: boolean;
  safeForPregnant: boolean;
  genderRestriction: "None" | "Male Only" | "Female Only";
  preparationInstructions: string;
  status: TestStatus;
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface TestPackage {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  price: number;
  offerPrice: number;
  homeCollectionAvailable: boolean;
  reportDeliveryTime: string;
  status: TestStatus;
}

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type BookingChannel = "home_collection" | "walk_in";
export type BookingStatus =
  | "booked"
  | "sample_collected"
  | "processing"
  | "report_uploaded"
  | "completed"
  | "cancelled"
  | "no_show";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  booked: "Booked",
  sample_collected: "Sample Collected",
  processing: "Processing",
  report_uploaded: "Report Uploaded",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

export interface Patient {
  uhid: string;
  name: string;
  mobile: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  createdAt: string;
}

export interface ReferringDoctor {
  id: string;
  name: string;
  hospitalId?: string;
  hospitalName?: string;
  specialization: string;
}

export interface Hospital {
  id: string;
  name: string;
}

export interface Technician {
  id: string;
  name: string;
}

export interface TatTimestamps {
  bookedAt: string;
  arrivedAt?: string;
  sampleCollectedAt?: string;
  reportUploadedAt?: string;
  reportDownloadedAt?: string;
}

export interface Booking {
  id: string;
  uhid: string;
  patientName: string;
  mobile: string;
  testId?: string;
  testName: string;
  packageId?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  channel: BookingChannel;
  status: BookingStatus;
  reportStatus: "Pending" | "Uploaded";
  bookingDate: string;
  doctorId?: string;
  doctorName?: string;
  hospitalId?: string;
  hospitalName?: string;
  technicianId?: string;
  technicianName?: string;
  tat: TatTimestamps;
}
