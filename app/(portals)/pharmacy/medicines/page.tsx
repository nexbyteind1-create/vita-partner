import { PageHeader } from "@/components/shared/page-header";
import { MedicinesTable } from "@/components/pharmacy/medicines-table";
import { getMedicineAnalyticsList } from "@/lib/data/pharmacy";

export default function MedicinesPage() {
  const rows = getMedicineAnalyticsList().sort((a, b) => b.revenueGenerated - a.revenueGenerated);
  return (
    <div>
      <PageHeader
        title="Medicine-wise Analytics"
        description="Orders, quantity sold, revenue and stock status for every medicine."
      />
      <MedicinesTable rows={rows} />
    </div>
  );
}
