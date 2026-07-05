import { CalendarDays, CalendarRange, Home, Building2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestWiseRevenueChart } from "@/components/lab/dashboard-charts";
import { getRevenueAnalytics } from "@/lib/data/lab";
import { formatCurrency } from "@/lib/format";

export default function RevenuePage() {
  const revenue = getRevenueAnalytics();

  return (
    <div>
      <PageHeader title="Revenue Analytics" description="Revenue by test, category, period and channel." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Daily Revenue" value={formatCurrency(revenue.day)} icon={CalendarDays} />
        <StatCard label="Weekly Revenue" value={formatCurrency(revenue.week)} />
        <StatCard label="Monthly Revenue" value={formatCurrency(revenue.month)} />
        <StatCard label="Yearly Revenue" value={formatCurrency(revenue.year)} icon={CalendarRange} />
        <StatCard label="Home Collection Revenue" value={formatCurrency(revenue.homeCollection)} icon={Home} />
        <StatCard label="Walk-in Revenue" value={formatCurrency(revenue.walkIn)} icon={Building2} />
        <StatCard label="Average Revenue / Patient" value={formatCurrency(revenue.averageRevenuePerPatient)} icon={Wallet} />
        <StatCard label="Highest Revenue Test" value={revenue.highestRevenueTest ?? "—"} icon={TrendingUp} tone="success" />
        <StatCard label="Lowest Revenue Test" value={revenue.lowestRevenueTest ?? "—"} icon={TrendingDown} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TestWiseRevenueChart data={revenue.byTest.slice(0, 8)} />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {revenue.byCategory.map((c) => (
              <div key={c.category} className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0">
                <span>{c.category}</span>
                <span className="font-medium">{formatCurrency(c.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
