import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  PrescriptionStatusBadge,
} from "@/components/pharmacy/status-badges";
import { getCustomerSummary } from "@/lib/data/pharmacy";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default async function CustomerTimelinePage({ params }: { params: Promise<{ uhid: string }> }) {
  const { uhid } = await params;
  const summary = getCustomerSummary(uhid);
  if (!summary) notFound();

  const { customer, orders, prescriptions } = summary;

  const medicineMap = new Map<string, { quantity: number; spend: number }>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const existing = medicineMap.get(item.medicineName) ?? { quantity: 0, spend: 0 };
      existing.quantity += item.quantity;
      existing.spend += item.quantity * item.price;
      medicineMap.set(item.medicineName, existing);
    }
  }
  const purchasedMedicines = Array.from(medicineMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.spend - a.spend);

  return (
    <div>
      <Link href="/pharmacy/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <PageHeader
        title={customer.name}
        description={`${customer.uhid} · ${customer.gender}, ${customer.age} yrs · Customer since ${formatDate(customer.createdAt)}`}
        actions={
          customer.membership !== "None" ? (
            <Badge variant="secondary" className="text-sm">
              {customer.membership} Member
            </Badge>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Orders" value={summary.totalOrders} />
        <StatCard label="Medicines Purchased" value={summary.totalMedicinesPurchased} />
        <StatCard label="Total Amount Spent" value={formatCurrency(summary.totalAmountSpent)} />
        <StatCard label="Last Purchase" value={summary.lastPurchase ? formatDate(summary.lastPurchase) : "—"} />
        <StatCard label="Active Orders" value={summary.activeOrders} />
        <StatCard label="Wallet Credits" value={customer.walletCredits} icon={Wallet} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/pharmacy/orders/${order.id}`}
                className="flex items-center justify-between rounded-md border p-2.5 text-sm transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.amount)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uploaded Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {prescriptions.length === 0 && <p className="text-sm text-muted-foreground">No prescriptions uploaded.</p>}
            {prescriptions.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                <div>
                  <p className="font-medium">{p.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(p.uploadedAt)} {p.doctorName ? `· ${p.doctorName}` : ""}
                  </p>
                </div>
                <PrescriptionStatusBadge status={p.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Purchased Medicines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {purchasedMedicines.length === 0 && <p className="text-sm text-muted-foreground">No purchases yet.</p>}
            {purchasedMedicines.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">Qty {m.quantity} · {formatCurrency(m.spend)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.amount)}</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
