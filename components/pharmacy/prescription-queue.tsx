"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { PrescriptionStatusBadge } from "@/components/pharmacy/status-badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updatePrescriptionStatusAction } from "@/lib/data/pharmacy-actions";
import { formatDateTime } from "@/lib/format";
import type { Prescription } from "@/lib/data/types";

function ReviewDialog({ prescription }: { prescription: Prescription }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [remarks, setRemarks] = useState(prescription.remarks ?? "");
  const [open, setOpen] = useState(false);

  function act(status: Prescription["status"]) {
    startTransition(async () => {
      const result = await updatePrescriptionStatusAction(prescription.id, status, remarks || undefined);
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
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Review</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{prescription.id}</DialogTitle>
          <DialogDescription>
            {prescription.customerName} ({prescription.uhid}) · Uploaded {formatDateTime(prescription.uploadedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center rounded-md border bg-muted/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prescription.fileUrl} alt="Uploaded prescription" width={220} height={286} className="rounded" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Doctor</p>
            <p>{prescription.doctorName ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Hospital</p>
            <p>{prescription.hospitalName ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Status</p>
            <PrescriptionStatusBadge status={prescription.status} />
          </div>
          {prescription.orderId && (
            <div>
              <p className="text-xs text-muted-foreground">Linked Order</p>
              <p>{prescription.orderId}</p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Verification Remarks</Label>
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Optional remarks…" />
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-start">
          <Button disabled={isPending} onClick={() => act("verified")}>
            Verify
          </Button>
          <Button disabled={isPending} variant="outline" onClick={() => act("rejected")} className="text-red-600 hover:text-red-600">
            Reject
          </Button>
          <Button disabled={isPending} variant="outline" onClick={() => act("new_requested")}>
            Request New Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "id",
    header: "Prescription ID",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.id}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(row.original.uploadedAt)}</p>
      </div>
    ),
  },
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "doctorName",
    header: "Doctor",
    cell: ({ row }) => row.original.doctorName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "hospitalName",
    header: "Hospital",
    cell: ({ row }) => row.original.hospitalName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => row.original.orderId ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <PrescriptionStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ReviewDialog prescription={row.original} />,
  },
];

export function PrescriptionQueue({ prescriptions }: { prescriptions: Prescription[] }) {
  return <DataTable columns={columns} data={prescriptions} pageSize={12} emptyMessage="No prescriptions in this view." />;
}
