import Link from "next/link";
import { Users, UserPlus, Repeat, Percent, Wallet, Crown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CustomerSearch } from "@/components/pharmacy/customer-search";
import { CustomersTable } from "@/components/pharmacy/customers-table";
import { getCustomerAnalytics, searchCustomers } from "@/lib/data/pharmacy";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const analytics = getCustomerAnalytics();
  const customers = searchCustomers(params.q ?? "");

  return (
    <div>
      <PageHeader title="Customers" description="Search customer order history and view customer analytics." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="New Customers (30d)" value={analytics.newCustomers} icon={UserPlus} />
        <StatCard label="Returning Customers" value={analytics.returningCustomers} icon={Repeat} />
        <StatCard label="Repeat Purchase Rate" value={`${analytics.repeatPurchaseRate}%`} icon={Percent} />
        <StatCard label="Average Order Value" value={formatCurrency(analytics.averageOrderValue)} icon={Wallet} />
        <StatCard label="Lifetime Customer Value" value={formatCurrency(analytics.lifetimeCustomerValue)} icon={Crown} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.topCustomers.map(({ customer, orders, spend }) => (
              <Link
                key={customer!.uhid}
                href={`/pharmacy/customers/${customer!.uhid}`}
                className="rounded-md border p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <p className="font-medium">{customer!.name}</p>
                <p className="text-xs text-muted-foreground">{customer!.uhid}</p>
                <p className="mt-1 text-xs">{orders} orders · {formatCurrency(spend)}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Search Customers</h2>
      </div>
      <div className="mb-4">
        <CustomerSearch />
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
}
