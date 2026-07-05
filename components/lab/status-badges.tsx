import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_LABEL,
  TEST_STATUS_LABEL,
  type BookingStatus,
  type PaymentStatus,
  type TestStatus,
} from "@/lib/data/lab-types";

const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  booked: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sample_collected: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  report_uploaded: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  no_show: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", BOOKING_STATUS_STYLE[status])}>
      {BOOKING_STATUS_LABEL[status]}
    </Badge>
  );
}

const TEST_STATUS_STYLE: Record<TestStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  inactive: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  hidden: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  out_of_service: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function TestStatusBadge({ status }: { status: TestStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", TEST_STATUS_STYLE[status])}>
      {TEST_STATUS_LABEL[status]}
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
