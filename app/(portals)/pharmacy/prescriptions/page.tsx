import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { PrescriptionQueue } from "@/components/pharmacy/prescription-queue";
import { getPrescriptions } from "@/lib/data/pharmacy";
import type { PrescriptionStatus } from "@/lib/data/types";
import { PRESCRIPTION_STATUS_LABEL } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const TABS: { value: PrescriptionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: PRESCRIPTION_STATUS_LABEL.pending },
  { value: "verified", label: PRESCRIPTION_STATUS_LABEL.verified },
  { value: "rejected", label: PRESCRIPTION_STATUS_LABEL.rejected },
  { value: "new_requested", label: PRESCRIPTION_STATUS_LABEL.new_requested },
];

export default async function PrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active = (params.status as PrescriptionStatus | "all") ?? "pending";
  const prescriptions = getPrescriptions({ status: active });

  return (
    <div>
      <PageHeader
        title="Prescription Verification"
        description="Review uploaded prescriptions before medicines are dispensed."
      />
      <div className="mb-4 flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1 w-fit">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/pharmacy/prescriptions?status=${tab.value}`}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              active === tab.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <PrescriptionQueue prescriptions={prescriptions} />
    </div>
  );
}
