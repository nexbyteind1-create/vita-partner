"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "@/lib/data/pharmacy-actions";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type Order, type OrderStatus } from "@/lib/data/types";

export function OrderStatusUpdater({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<OrderStatus>(order.status === "cancelled" ? order.status : order.status);
  const [note, setNote] = useState("");

  const isFinal = order.status === "delivered" || order.status === "cancelled";

  function submit(status: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(order.id, status, note || undefined);
      if (result.success) {
        toast.success(result.message);
        setNote("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  if (isFinal) {
    return <p className="text-sm text-muted-foreground">This order is {ORDER_STATUS_LABEL[order.status].toLowerCase()} and cannot be updated further.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Update status to</Label>
        <Select value={nextStatus} onValueChange={(v) => setNextStatus(v as OrderStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue>{(value: OrderStatus) => ORDER_STATUS_LABEL[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS_FLOW.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Note (optional)</Label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note for this update…" rows={2} />
      </div>
      <div className="flex gap-2">
        <Button disabled={isPending} onClick={() => submit(nextStatus)}>
          {isPending ? "Updating…" : "Update Status"}
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => submit("cancelled")}
          className="text-red-600 hover:text-red-600"
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
