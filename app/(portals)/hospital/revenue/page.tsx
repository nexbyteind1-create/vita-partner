import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHospitalRevenueAnalytics } from "@/lib/data/hospital";
import { formatCurrency } from "@/lib/format";

export default function HospitalRevenuePage() {
  const revenue = getHospitalRevenueAnalytics();
  const breakdownEntries = [
    { label: "Consultation Revenue", value: revenue.breakdown.consultation },
    { label: "Laboratory Revenue", value: revenue.breakdown.laboratory },
    { label: "Diagnostic Revenue", value: revenue.breakdown.diagnostic },
    { label: "Pharmacy Revenue", value: revenue.breakdown.pharmacy },
    { label: "Admission Revenue", value: revenue.breakdown.admission },
  ];
  const maxValue = Math.max(...breakdownEntries.map((b) => b.value), 1);

  return (
    <div>
      <PageHeader title="Revenue Analytics" description="Daily, weekly, monthly and yearly revenue across all services." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Daily Revenue" value={formatCurrency(revenue.daily)} />
        <StatCard label="Weekly Revenue" value={formatCurrency(revenue.weekly)} />
        <StatCard label="Monthly Revenue" value={formatCurrency(revenue.monthly)} />
        <StatCard label="Yearly Revenue" value={formatCurrency(revenue.yearly)} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {breakdownEntries.map((entry) => (
            <div key={entry.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{entry.label}</span>
                <span className="font-medium">{formatCurrency(entry.value)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--chart-1)]"
                  style={{ width: `${Math.max((entry.value / maxValue) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
