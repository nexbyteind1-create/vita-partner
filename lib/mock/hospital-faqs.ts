export interface FaqEntry {
  category: string;
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = [
  "Appointment Management",
  "Doctor Management",
  "Staff Management",
  "Billing",
  "Laboratory",
  "Diagnostics",
  "Pharmacy",
  "Reports",
  "Payments",
  "Technical Issues",
  "Account Management",
];

export const FAQS: FaqEntry[] = [
  { category: "Appointment Management", question: "How do I book an appointment for a walk-in patient?", answer: "Go to Appointments, search for the patient by UHID or mobile number, then use the doctor's availability calendar to select an open slot." },
  { category: "Appointment Management", question: "How do I mark an appointment as completed?", answer: "Open the appointment from the Appointments list and use Update Status to set it to Completed." },
  { category: "Appointment Management", question: "Can I reschedule an appointment on behalf of a patient?", answer: "Yes — mark the appointment as Rescheduled and book a new slot; the patient is notified automatically." },
  { category: "Doctor Management", question: "How do I view a doctor's appointment history?", answer: "Go to Doctors, select the doctor, and their full appointment history and analytics will be shown." },
  { category: "Staff Management", question: "Who can update doctor availability?", answer: "Both Hospital Admin and assigned Staff members can update doctor availability from the Doctors & Staff Management section." },
  { category: "Billing", question: "Where can I see a patient's consolidated bill?", answer: "Open the patient's profile from Patients and go to the Billing tab for a consolidated view across consultation, lab, diagnostic, pharmacy and admission charges." },
  { category: "Laboratory", question: "How do I check pending laboratory reports?", answer: "Go to Billing → Laboratory tab and filter by Report Status = Pending." },
  { category: "Diagnostics", question: "How are diagnostic bookings linked to a patient?", answer: "Every diagnostic booking is linked to the patient's UHID and appears in their Medical Timeline automatically." },
  { category: "Pharmacy", question: "Can I see pharmacy purchases made by a hospital patient?", answer: "Yes — the Billing → Pharmacy tab lists all pharmacy bills linked to patients associated with this hospital." },
  { category: "Reports", question: "What formats are supported for report export?", answer: "PDF, Excel and CSV are all supported from the Reports section." },
  { category: "Payments", question: "What happens if a payment is captured but the appointment isn't confirmed?", answer: "Raise a Payment Issue support ticket with the transaction details so the Vita support team can reconcile it." },
  { category: "Technical Issues", question: "The appointment calendar isn't loading — what should I do?", answer: "Refresh the page first. If the issue persists, raise a Technical Issue ticket from the Support Center." },
  { category: "Account Management", question: "How do I request a new staff login?", answer: "Raise a support request under category 'Other' with the staff member's details, or contact Vita Support directly." },
];
