"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createFollowUpAction } from "@/lib/data/hospital-actions";
import type { Doctor, Patient } from "@/lib/data/hospital-types";

const FOLLOWUP_TYPES = ["Routine Follow-up", "Post-Surgery Review", "Lab Result Review", "Medication Review"];

export function CreateFollowUpDialog({ doctors, patients }: { doctors: Doctor[]; patients: Patient[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [uhid, setUhid] = useState("");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [type, setType] = useState(FOLLOWUP_TYPES[0]);
  const [remarks, setRemarks] = useState("");

  const patient = patients.find((p) => p.uhid.toLowerCase() === uhid.trim().toLowerCase());
  const doctor = doctors.find((d) => d.id === doctorId);

  function submit() {
    if (!patient || !doctor || !date) {
      toast.error("Enter a valid patient UHID, doctor and follow-up date.");
      return;
    }
    startTransition(async () => {
      const result = await createFollowUpAction({
        uhid: patient.uhid,
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        followUpDate: new Date(date).toISOString(),
        type,
        remarks: remarks || undefined,
      });
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setUhid("");
        setDate("");
        setRemarks("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" /> Create Follow-up
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Follow-up</DialogTitle>
          <DialogDescription>Schedule a follow-up for a patient after a completed appointment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Patient UHID</Label>
          <Input value={uhid} onChange={(e) => setUhid(e.target.value)} placeholder="e.g. VITA-210001" />
          {uhid && !patient && <p className="text-xs text-red-600">No patient found with this UHID.</p>}
          {patient && <p className="text-xs text-muted-foreground">{patient.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Doctor</Label>
          <Select value={doctorId} onValueChange={(v) => setDoctorId(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue>{(value: string) => doctors.find((d) => d.id === value)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name} — {d.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Follow-up Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Follow-up Type</Label>
          <Select value={type} onValueChange={(v) => setType(v ?? FOLLOWUP_TYPES[0])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FOLLOWUP_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Remarks (optional)</Label>
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} />
        </div>

        <DialogFooter>
          <Button disabled={isPending} onClick={submit}>
            {isPending ? "Saving…" : "Create Follow-up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
