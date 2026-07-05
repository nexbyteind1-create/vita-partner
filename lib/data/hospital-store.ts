import {
  APPOINTMENTS,
  FOLLOW_UPS,
  MEDICAL_DOCUMENTS,
  SUPPORT_TICKETS,
} from "@/lib/mock/hospital-fixtures";
import type { Appointment, AuditLogEntry, FollowUp, MedicalDocument, SupportTicket } from "./hospital-types";

interface HospitalStore {
  appointments: Appointment[];
  documents: MedicalDocument[];
  tickets: SupportTicket[];
  followUps: FollowUp[];
  auditLog: AuditLogEntry[];
}

const globalForStore = globalThis as unknown as { __hospitalStore?: HospitalStore };

export const hospitalStore: HospitalStore =
  globalForStore.__hospitalStore ??
  (globalForStore.__hospitalStore = {
    appointments: structuredClone(APPOINTMENTS),
    documents: structuredClone(MEDICAL_DOCUMENTS),
    tickets: structuredClone(SUPPORT_TICKETS),
    followUps: structuredClone(FOLLOW_UPS),
    auditLog: [],
  });

let auditSeq = 1;
export function pushAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">) {
  hospitalStore.auditLog.unshift({
    id: `AUD${(auditSeq++).toString().padStart(4, "0")}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
}
