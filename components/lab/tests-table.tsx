"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { TestStatusBadge } from "@/components/lab/status-badges";
import { TestFormDialog } from "@/components/lab/test-form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setTestStatusAction } from "@/lib/data/lab-actions";
import { TEST_STATUS_LABEL, type Test, type TestStatus } from "@/lib/data/lab-types";
import { formatCurrency } from "@/lib/format";

const STATUSES: TestStatus[] = ["active", "inactive", "hidden", "out_of_service"];

function TestStatusSelect({ test }: { test: Test }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(status: TestStatus) {
    startTransition(async () => {
      const result = await setTestStatusAction(test.id, status);
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
      <Select value={test.status} onValueChange={(v) => update((v as TestStatus) ?? test.status)} disabled={isPending}>
        <SelectTrigger className="w-36" size="sm">
          <SelectValue>{(value: TestStatus) => TEST_STATUS_LABEL[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {TEST_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "name",
    header: "Test Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "offerPrice",
    header: "Price",
    cell: ({ row }) => (
      <div>
        <p>{formatCurrency(row.original.offerPrice)}</p>
        {row.original.offerPrice < row.original.mrp && (
          <p className="text-xs text-muted-foreground line-through">{formatCurrency(row.original.mrp)}</p>
        )}
      </div>
    ),
  },
  { accessorKey: "reportDeliveryTime", header: "Report Delivery Time" },
  { accessorKey: "homeCollectionAvailable", header: "Home Collection", cell: ({ row }) => (row.original.homeCollectionAvailable ? "Yes" : "No") },
  {
    id: "badge",
    header: "Status Badge",
    cell: ({ row }) => <TestStatusBadge status={row.original.status} />,
  },
  { id: "status", header: "Update Status", cell: ({ row }) => <TestStatusSelect test={row.original} /> },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <TestFormDialog test={row.original} />
      </div>
    ),
  },
];

export function TestsTable({ tests }: { tests: Test[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={tests}
      pageSize={15}
      emptyMessage="No tests found."
      onRowClick={(t) => router.push(`/lab/tests/${t.id}`)}
    />
  );
}
