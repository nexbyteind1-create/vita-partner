import { CalendarDays, CalendarRange, Store, Globe, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySalesChart } from "@/components/pharmacy/dashboard-charts";
import { getRevenueAnalytics } from "@/lib/data/pharmacy";
import { formatCurrency } from "@/lib/format";

export default function RevenuePage() {
  const revenue = getRevenueAnalytics();

  return (
    <div>
      <PageHeader title="Revenue Analytics" description="Revenue breakdown by medicine, category, period and channel." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Today's Revenue" value={formatCurrency(revenue.todayRevenue)} icon={CalendarDays} />
        <StatCard label="Weekly Revenue" value={formatCurrency(revenue.weeklyRevenue)} />
        <StatCard label="Monthly Revenue" value={formatCurrency(revenue.monthlyRevenue)} />
        <StatCard label="Yearly Revenue" value={formatCurrency(revenue.yearlyRevenue)} icon={CalendarRange} />
        <StatCard label="Walk-in Sales" value={formatCurrency(revenue.walkInRevenue)} icon={Store} />
        <StatCard label="Online Orders" value={formatCurrency(revenue.onlineRevenue)} icon={Globe} />
        <StatCard label="Average Order Value" value={formatCurrency(revenue.averageOrderValue)} icon={Wallet} />
        <StatCard label="Highest Selling Medicine" value={revenue.highestSellingMedicine ?? "—"} icon={TrendingUp} tone="success" />
        <StatCard label="Lowest Selling Medicine" value={revenue.lowestSellingMedicine ?? "—"} icon={TrendingDown} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategorySalesChart data={revenue.byCategory} />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue by Medicine (Top 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {revenue.byMedicine.slice(0, 10).map((m, i) => (
              <div key={m.name} className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0">
                <p>
                  <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                  {m.name}
                </p>
                <p className="font-medium">{formatCurrency(m.revenue)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
