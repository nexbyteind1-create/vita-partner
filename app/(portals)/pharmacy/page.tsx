import {
  ShoppingCart,
  CalendarClock,
  Clock,
  Loader2,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Users,
  Wallet,
  TrendingUp,
  CalendarDays,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getDashboardStats, getGraphData } from "@/lib/data/pharmacy";
import { formatCurrency } from "@/lib/format";
import {
  CategorySalesChart,
  CustomerGrowthChart,
  DailyOrdersChart,
  InventoryByCategoryChart,
  MonthlySalesChart,
  RepeatCustomerTrendChart,
  RevenueTrendChart,
  TopSellingMedicinesChart,
} from "@/components/pharmacy/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PharmacyDashboardPage() {
  const stats = getDashboardStats();
  const graph = getGraphData();

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of orders, prescriptions, customers and revenue." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard label="Today's Orders" value={stats.todaysOrders} icon={CalendarClock} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} tone="warning" />
        <StatCard label="Processing Orders" value={stats.processingOrders} icon={Loader2} />
        <StatCard label="Ready for Pickup" value={stats.readyForPickup} icon={PackageCheck} />
        <StatCard label="Out for Delivery" value={stats.outForDelivery} icon={Truck} />
        <StatCard label="Delivered Orders" value={stats.deliveredOrders} icon={CheckCircle2} tone="success" />
        <StatCard label="Cancelled Orders" value={stats.cancelledOrders} icon={XCircle} tone="danger" />
        <StatCard
          label="Prescription Verification Pending"
          value={stats.prescriptionVerificationPending}
          icon={FileCheck2}
          tone="warning"
        />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={Users} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} />
        <StatCard label="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} icon={TrendingUp} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={CalendarDays} />
        <StatCard label="Yearly Revenue" value={formatCurrency(stats.yearlyRevenue)} icon={CalendarRange} />
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Graphical Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyOrdersChart data={graph.dailyOrders} />
        <RevenueTrendChart data={graph.dailyOrders} />
        <CategorySalesChart data={graph.categoryRevenue} />
        <MonthlySalesChart data={graph.monthlySales} />
        <CustomerGrowthChart data={graph.customerGrowth} />
        <RepeatCustomerTrendChart data={graph.repeatCustomerTrend} />
        <TopSellingMedicinesChart data={graph.topSellingMedicines} />
        <InventoryByCategoryChart data={graph.inventoryByCategory} />
      </div>

      <Card className="mt-6 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">AI Insights</CardTitle>
          </div>
          <CardDescription>
            Demand forecasting, seasonal trend prediction and inventory forecasting are planned for a future
            iteration.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
