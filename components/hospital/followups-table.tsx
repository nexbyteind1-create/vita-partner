"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { FollowUpStatusBadge } from "@/components/hospital/status-badges";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateFollowUpStatusAction } from "@/lib/data/hospital-actions";
import { formatDateTime } from "@/lib/format";
import type { FollowUp, FollowUpStatus } from "@/lib/data/hospital-types";

function FollowUpActions({ followUp }: { followUp: FollowUp }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(status: FollowUpStatus) {
    startTransition(async () => {
      const result = await updateFollowUpStatusAction(followUp.id, status);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={isPending} />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => update("upcoming")}>Reschedule (mark Upcoming)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => update("completed")}>Mark Completed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => update("missed")}>Mark Missed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => update("cancelled")} variant="destructive">
            Cancel Follow-up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const columns: ColumnDef<FollowUp>[] = [
  { accessorKey: "patientName", header: "Patient" },
  { accessorKey: "uhid", header: "UHID" },
  { accessorKey: "doctorName", header: "Doctor" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "followUpDate", header: "Follow-up Date", cell: ({ row }) => formatDateTime(row.original.followUpDate) },
  { accessorKey: "type", header: "Type" },
  { id: "status", header: "Status", cell: ({ row }) => <FollowUpStatusBadge status={row.original.status} /> },
  { id: "actions", header: "", cell: ({ row }) => <FollowUpActions followUp={row.original} /> },
];

export function FollowUpsTable({ followUps }: { followUps: FollowUp[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={followUps}
      pageSize={12}
      emptyMessage="No follow-ups in this view."
      onRowClick={(f) => router.push(`/hospital/patients/${f.uhid}`)}
    />
  );
}
