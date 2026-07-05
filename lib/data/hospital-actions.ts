"use server";

import { revalidatePath } from "next/cache";
import { hospitalStore, pushAuditLog } from "./hospital-store";
import { APPOINTMENT_STATUS_LABEL } from "./hospital-types";
import type {
  AppointmentStatus,
  FollowUpStatus,
  MedicalDocumentType,
  NoShowReason,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "./hospital-types";

export interface ActionResult {
  success: boolean;
  message: string;
}

function notifyPatient(uhid: string, message: string) {
  console.log(`[notify -> ${uhid}] ${message}`);
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatus,
  noShowReason?: NoShowReason,
  note?: string
): Promise<ActionResult> {
  const appt = hospitalStore.appointments.find((a) => a.id === appointmentId);
  if (!appt) return { success: false, message: "Appointment not found." };

  appt.status = status;
  if (status === "no_show") appt.noShowReason = noShowReason;
  if (note) appt.notes.push({ text: note, by: "Hospital Admin", at: new Date().toISOString() });

  pushAuditLog({
    action: `Appointment marked ${APPOINTMENT_STATUS_LABEL[status]}`,
    entity: "appointment",
    entityId: appointmentId,
    performedBy: "Dr. Karthik Iyer (Admin)",
    details: note,
  });

  notifyPatient(
    appt.uhid,
    status === "no_show"
      ? "Your appointment has been marked as 'No Show'. If this is incorrect, please contact the hospital or Vita Support."
      : `Your appointment status is now "${APPOINTMENT_STATUS_LABEL[status]}".`
  );

  revalidatePath("/hospital/appointments");
  revalidatePath(`/hospital/appointments/${appointmentId}`);
  revalidatePath("/hospital");

  return { success: true, message: `Appointment marked as ${APPOINTMENT_STATUS_LABEL[status]}. Patient notified.` };
}

export async function uploadMedicalDocumentAction(input: {
  uhid: string;
  patientName: string;
  type: MedicalDocumentType;
  title: string;
  doctorName?: string;
  department?: string;
  appointmentId?: string;
  admissionId?: string;
}): Promise<ActionResult> {
  const id = `DOC${Math.floor(Math.random() * 900000 + 100000)}`;
  hospitalStore.documents.unshift({
    id,
    uhid: input.uhid,
    patientName: input.patientName,
    type: input.type,
    title: input.title,
    fileUrl: "/mock-prescription.svg",
    uploadedBy: "Dr. Karthik Iyer (Admin)",
    uploadedAt: new Date().toISOString(),
    version: 1,
    doctorName: input.doctorName,
    department: input.department,
    appointmentId: input.appointmentId,
    admissionId: input.admissionId,
  });

  pushAuditLog({
    action: `Uploaded ${input.title}`,
    entity: "document",
    entityId: id,
    performedBy: "Dr. Karthik Iyer (Admin)",
  });

  notifyPatient(input.uhid, `A new ${input.title} has been uploaded by Apollo Care Hospital. You can view it in Vita Vault.`);

  revalidatePath(`/hospital/patients/${input.uhid}`);
  revalidatePath("/hospital/patients");

  return { success: true, message: "Document uploaded. Patient notified." };
}

export async function createFollowUpAction(input: {
  uhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  followUpDate: string;
  type: string;
  remarks?: string;
}): Promise<ActionResult> {
  const id = `FU${Math.floor(Math.random() * 900000 + 100000)}`;
  hospitalStore.followUps.unshift({
    id,
    ...input,
    status: "upcoming",
    attachedDocumentIds: [],
    createdAt: new Date().toISOString(),
  });

  pushAuditLog({ action: `Follow-up scheduled for ${input.patientName}`, entity: "followup", entityId: id, performedBy: input.doctorName });
  notifyPatient(input.uhid, `A follow-up has been scheduled on ${new Date(input.followUpDate).toLocaleDateString("en-IN")}. Tap to book your slot.`);

  revalidatePath("/hospital/follow-ups");
  revalidatePath(`/hospital/patients/${input.uhid}`);

  return { success: true, message: "Follow-up created. Patient notified." };
}

export async function updateFollowUpStatusAction(id: string, status: FollowUpStatus): Promise<ActionResult> {
  const followUp = hospitalStore.followUps.find((f) => f.id === id);
  if (!followUp) return { success: false, message: "Follow-up not found." };
  followUp.status = status;

  pushAuditLog({ action: `Follow-up marked ${status}`, entity: "followup", entityId: id, performedBy: "Hospital Admin" });

  revalidatePath("/hospital/follow-ups");
  return { success: true, message: "Follow-up updated." };
}

export async function createSupportTicketAction(input: {
  subject: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  description: string;
  contactNumber: string;
  email: string;
}): Promise<ActionResult & { ticketId?: string }> {
  const id = `TCK${Math.floor(Math.random() * 900000 + 100000)}`;
  const now = new Date().toISOString();
  hospitalStore.tickets.unshift({
    id,
    ...input,
    status: "open",
    raisedBy: "Hospital Admin",
    createdAt: now,
    updatedAt: now,
  });

  pushAuditLog({ action: `Support ticket raised: ${input.subject}`, entity: "ticket", entityId: id, performedBy: "Hospital Admin" });

  revalidatePath("/hospital/support");
  return { success: true, message: `Ticket ${id} created.`, ticketId: id };
}

export async function updateSupportTicketStatusAction(id: string, status: SupportTicketStatus): Promise<ActionResult> {
  const ticket = hospitalStore.tickets.find((t) => t.id === id);
  if (!ticket) return { success: false, message: "Ticket not found." };
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  pushAuditLog({ action: `Ticket ${id} status changed to ${status}`, entity: "ticket", entityId: id, performedBy: "Hospital Admin" });

  revalidatePath("/hospital/support");
  return { success: true, message: "Ticket updated." };
}
