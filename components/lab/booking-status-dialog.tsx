"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateBookingStatusAction } from "@/lib/data/lab-actions";
import { BOOKING_STATUS_LABEL, type Booking, type BookingStatus } from "@/lib/data/lab-types";
import { formatDateTime } from "@/lib/format";

const FLOW: BookingStatus[] = ["booked", "sample_collected", "processing", "report_uploaded", "completed", "cancelled", "no_show"];

export function BookingStatusDialog({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  function submit() {
    startTransition(async () => {
      const result = await updateBookingStatusAction(booking.id, status);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Update</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{booking.id}</DialogTitle>
          <DialogDescription>
            {booking.patientName} ({booking.uhid}) · {booking.testName} · {formatDateTime(booking.bookingDate)}
          </DialogDescription>
        </DialogHeader>

        <Select value={status} onValueChange={(v) => setStatus((v as BookingStatus) ?? booking.status)}>
          <SelectTrigger className="w-full">
            <SelectValue>{(value: BookingStatus) => BOOKING_STATUS_LABEL[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FLOW.map((s) => (
              <SelectItem key={s} value={s}>
                {BOOKING_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button disabled={isPending} onClick={submit}>
            {isPending ? "Updating…" : "Save Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
