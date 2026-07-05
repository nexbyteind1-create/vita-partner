import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CreateFollowUpDialog } from "@/components/hospital/create-followup-dialog";
import { FollowUpsTable } from "@/components/hospital/followups-table";
import { DOCTORS, PATIENTS, getFollowUps } from "@/lib/data/hospital";
import type { FollowUpStatus } from "@/lib/data/hospital-types";
import { cn } from "@/lib/utils";

const TABS: { value: FollowUpStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function FollowUpsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const active = (params.status as FollowUpStatus | "all") ?? "all";
  const all = getFollowUps();
  const filtered = getFollowUps(active);

  return (
    <div>
      <PageHeader
        title="Follow-up Management"
        description="Schedule and track patient follow-ups."
        actions={<CreateFollowUpDialog doctors={DOCTORS} patients={PATIENTS} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Upcoming Follow-ups" value={all.filter((f) => f.status === "upcoming").length} />
        <StatCard label="Completed Follow-ups" value={all.filter((f) => f.status === "completed").length} tone="success" />
        <StatCard label="Missed Follow-ups" value={all.filter((f) => f.status === "missed").length} tone="danger" />
        <StatCard label="Cancelled Follow-ups" value={all.filter((f) => f.status === "cancelled").length} />
      </div>

      <div className="my-4 flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1 w-fit">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/hospital/follow-ups?status=${tab.value}`}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              active === tab.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <FollowUpsTable followUps={filtered} />
    </div>
  );
}
