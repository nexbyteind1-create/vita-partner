"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { updateAppointmentStatusAction } from "@/lib/data/hospital-actions";
import { APPOINTMENT_STATUS_LABEL, type Appointment, type AppointmentStatus, type NoShowReason } from "@/lib/data/hospital-types";
import { formatDateTime } from "@/lib/format";

const ATTENDANCE_FLOW: AppointmentStatus[] = ["scheduled", "checked_in", "waiting", "consultation_started", "completed", "cancelled", "rescheduled"];
const NO_SHOW_REASONS: NoShowReason[] = ["Patient Did Not Arrive", "Patient Cancelled Offline", "Doctor Unavailable", "Hospital Closed", "Other"];

export function AppointmentStatusDialog({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [noShowReason, setNoShowReason] = useState<NoShowReason>("Patient Did Not Arrive");
  const [note, setNote] = useState("");

  function submit(finalStatus: AppointmentStatus) {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(
        appointment.id,
        finalStatus,
        finalStatus === "no_show" ? noShowReason : undefined,
        note || undefined
      );
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setNote("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Update</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{appointment.id}</DialogTitle>
          <DialogDescription>
            {appointment.patientName} ({appointment.uhid}) with {appointment.doctorName} · {formatDateTime(appointment.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Attendance Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as AppointmentStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue>{(value: AppointmentStatus) => APPOINTMENT_STATUS_LABEL[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ATTENDANCE_FLOW.map((s) => (
                <SelectItem key={s} value={s}>
                  {APPOINTMENT_STATUS_LABEL[s]}
                </SelectItem>
              ))}
              <SelectItem value="no_show">{APPOINTMENT_STATUS_LABEL.no_show}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === "no_show" && (
          <div className="space-y-1.5">
            <Label>No Show Reason</Label>
            <Select value={noShowReason} onValueChange={(v) => setNoShowReason(v as NoShowReason)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NO_SHOW_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Internal Note (optional)</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Internal note for follow-up / communication…" />
        </div>

        <DialogFooter>
          <Button disabled={isPending} onClick={() => submit(status)}>
            {isPending ? "Updating…" : "Save Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
