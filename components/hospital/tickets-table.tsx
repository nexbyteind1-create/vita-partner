"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSupportTicketStatusAction } from "@/lib/data/hospital-actions";
import { SUPPORT_TICKET_STATUS_LABEL, type SupportTicket, type SupportTicketStatus } from "@/lib/data/hospital-types";
import { formatDateTime } from "@/lib/format";

const STATUSES: SupportTicketStatus[] = ["open", "assigned", "in_progress", "waiting_response", "resolved", "closed"];

function TicketStatusSelect({ ticket }: { ticket: SupportTicket }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(status: SupportTicketStatus) {
    startTransition(async () => {
      const result = await updateSupportTicketStatusAction(ticket.id, status);
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
      <Select value={ticket.status} onValueChange={(v) => update(v as SupportTicketStatus)} disabled={isPending}>
        <SelectTrigger className="w-40" size="sm">
          <SelectValue>{(value: SupportTicketStatus) => SUPPORT_TICKET_STATUS_LABEL[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {SUPPORT_TICKET_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.id}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</p>
      </div>
    ),
  },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "priority", header: "Priority" },
  { id: "status", header: "Status", cell: ({ row }) => <TicketStatusSelect ticket={row.original} /> },
];

export function TicketsTable({ tickets }: { tickets: SupportTicket[] }) {
  return <DataTable columns={columns} data={tickets} pageSize={10} emptyMessage="No support tickets yet." />;
}
