export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "waiting"
  | "consultation_started"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show";

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  checked_in: "Checked-In",
  waiting: "Waiting",
  consultation_started: "Consultation Started",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
  no_show: "No Show",
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type NoShowReason =
  | "Patient Did Not Arrive"
  | "Patient Cancelled Offline"
  | "Doctor Unavailable"
  | "Hospital Closed"
  | "Other";

export interface Patient {
  uhid: string;
  name: string;
  mobile: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  bloodGroup: string;
  photoUrl: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  uhid: string;
  name: string;
  photoUrl: string;
  mobile: string;
  email: string;
  specialization: string;
  department: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  status: "active" | "inactive";
  assignedStaffId?: string;
}

export interface Staff {
  id: string;
  name: string;
  mobile: string;
  email: string;
  designation: string;
  assignedDoctorIds: string[];
  status: "active" | "inactive";
}

export interface Appointment {
  id: string;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientMobile: string;
  patientEmail: string;
  patientPhotoUrl: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string; // ISO datetime for the scheduled slot
  status: AppointmentStatus;
  consultationFee: number;
  noShowReason?: NoShowReason;
  notes: { text: string; by: string; at: string }[];
  createdAt: string;
}

export interface LabBooking {
  id: string;
  uhid: string;
  patientName: string;
  labName: string;
  testName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  reportStatus: "Pending" | "Uploaded";
}

export interface DiagnosticBooking {
  id: string;
  uhid: string;
  patientName: string;
  diagnosticCenter: string;
  testName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  reportStatus: "Pending" | "Uploaded";
  doctorName?: string;
}

export interface PharmacyBill {
  id: string;
  uhid: string;
  patientName: string;
  pharmacyName: string;
  billNumber: string;
  amount: number;
  paymentStatus: PaymentStatus;
  purchaseDate: string;
}

export interface Admission {
  id: string;
  uhid: string;
  patientName: string;
  admissionDate: string;
  dischargeDate?: string;
  treatingDoctor: string;
  charges: number;
  paymentStatus: PaymentStatus;
  status: "Admitted" | "Discharged";
}

export type MedicalDocumentType =
  | "prescription"
  | "lab_report"
  | "diagnostic_report"
  | "admission_note"
  | "discharge_summary"
  | "referral_letter"
  | "insurance"
  | "consent_form"
  | "medical_certificate"
  | "fitness_certificate"
  | "other";

export const MEDICAL_DOCUMENT_TYPE_LABEL: Record<MedicalDocumentType, string> = {
  prescription: "Prescription",
  lab_report: "Laboratory Report",
  diagnostic_report: "Diagnostic Report",
  admission_note: "Admission Note",
  discharge_summary: "Discharge Summary",
  referral_letter: "Referral Letter",
  insurance: "Insurance Document",
  consent_form: "Consent Form",
  medical_certificate: "Medical Certificate",
  fitness_certificate: "Fitness Certificate",
  other: "Other Document",
};

export interface MedicalDocument {
  id: string;
  uhid: string;
  patientName: string;
  type: MedicalDocumentType;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
  version: number;
  doctorName?: string;
  department?: string;
  appointmentId?: string;
  admissionId?: string;
}

export type SupportTicketStatus = "open" | "assigned" | "in_progress" | "waiting_response" | "resolved" | "closed";
export type SupportTicketPriority = "Low" | "Medium" | "High" | "Critical";
export type SupportTicketCategory =
  | "Technical Issue"
  | "Appointment Issue"
  | "Doctor Availability Issue"
  | "Patient Issue"
  | "Payment Issue"
  | "Other";

export const SUPPORT_TICKET_STATUS_LABEL: Record<SupportTicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  waiting_response: "Waiting for Response",
  resolved: "Resolved",
  closed: "Closed",
};

export interface SupportTicket {
  id: string;
  subject: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  description: string;
  status: SupportTicketStatus;
  contactNumber: string;
  email: string;
  raisedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type FollowUpStatus = "upcoming" | "completed" | "missed" | "cancelled";

export interface FollowUp {
  id: string;
  uhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  followUpDate: string;
  type: string;
  remarks?: string;
  status: FollowUpStatus;
  attachedDocumentIds: string[];
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  performedBy: string;
  timestamp: string;
  details?: string;
}
