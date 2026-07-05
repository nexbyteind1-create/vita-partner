import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  APPOINTMENT_STATUS_LABEL,
  SUPPORT_TICKET_STATUS_LABEL,
  type AppointmentStatus,
  type FollowUpStatus,
  type PaymentStatus,
  type SupportTicketStatus,
} from "@/lib/data/hospital-types";

const APPOINTMENT_STATUS_STYLE: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  checked_in: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  waiting: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  consultation_started: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  rescheduled: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  no_show: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", APPOINTMENT_STATUS_STYLE[status])}>
      {APPOINTMENT_STATUS_LABEL[status]}
    </Badge>
  );
}

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  refunded: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium capitalize", PAYMENT_STATUS_STYLE[status])}>
      {status}
    </Badge>
  );
}

const TICKET_STATUS_STYLE: Record<SupportTicketStatus, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  assigned: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  waiting_response: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  closed: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function TicketStatusBadge({ status }: { status: SupportTicketStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", TICKET_STATUS_STYLE[status])}>
      {SUPPORT_TICKET_STATUS_LABEL[status]}
    </Badge>
  );
}

const FOLLOWUP_STATUS_STYLE: Record<FollowUpStatus, string> = {
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  missed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  cancelled: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium capitalize", FOLLOWUP_STATUS_STYLE[status])}>
      {status}
    </Badge>
  );
}
