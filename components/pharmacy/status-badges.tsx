import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABEL,
  PRESCRIPTION_STATUS_LABEL,
  type OrderStatus,
  type PaymentStatus,
  type PrescriptionStatus,
} from "@/lib/data/types";

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  order_received: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  prescription_verified: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  preparing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  ready_for_pickup: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  out_for_delivery: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", ORDER_STATUS_STYLE[status])}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

const PRESCRIPTION_STATUS_STYLE: Record<PrescriptionStatus, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  new_requested: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};

export function PrescriptionStatusBadge({ status }: { status: PrescriptionStatus }) {
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", PRESCRIPTION_STATUS_STYLE[status])}>
      {PRESCRIPTION_STATUS_LABEL[status]}
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
