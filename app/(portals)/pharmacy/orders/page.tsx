import { PageHeader } from "@/components/shared/page-header";
import { OrdersFilterBar } from "@/components/pharmacy/orders-filter-bar";
import { OrdersTable } from "@/components/pharmacy/orders-table";
import { getOrders } from "@/lib/data/pharmacy";
import type { OrderStatus } from "@/lib/data/types";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const orders = getOrders({
    status: (params.status as OrderStatus | "all") ?? "all",
    search: params.q,
  });

  return (
    <div>
      <PageHeader title="Order Management" description="View and update all medicine orders." />
      <OrdersFilterBar />
      <OrdersTable orders={orders} />
    </div>
  );
}
