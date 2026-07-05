import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  PrescriptionStatusBadge,
} from "@/components/pharmacy/status-badges";
import { OrderStatusUpdater } from "@/components/pharmacy/order-status-updater";
import { getOrderById } from "@/lib/data/pharmacy";
import { formatCurrency, formatDateTime } from "@/lib/format";

const DELIVERY_LABEL = { home_delivery: "Home Delivery", store_pickup: "Store Pickup" };

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getOrderById(orderId);
  if (!order) notFound();

  return (
    <div>
      <Link href="/pharmacy/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>
      <PageHeader
        title={order.id}
        description={`Placed on ${formatDateTime(order.createdAt)} · ${order.channel === "walk_in" ? "Walk-in" : "Online"} order`}
        actions={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer & Order Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <Info label="UHID" value={order.uhid} />
              <Info label="Customer Name" value={order.customerName} />
              <Info label="Mobile Number" value={order.mobile} />
              <Info label="Doctor Name" value={order.doctorName ?? "—"} />
              <Info label="Hospital Name" value={order.hospitalName ?? "—"} />
              <Info label="Delivery Type" value={DELIVERY_LABEL[order.deliveryType]} />
              <Info label="Order Amount" value={formatCurrency(order.amount)} />
              <Info label="Payment Status" value={<PaymentStatusBadge status={order.paymentStatus} />} />
              <Info
                label="Prescription Status"
                value={order.prescriptionStatus ? <PrescriptionStatusBadge status={order.prescriptionStatus} /> : "Not required"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.items.map((item) => (
                <div key={item.medicineId} className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.medicineName}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold">
                <p>Total</p>
                <p>{formatCurrency(order.amount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {order.statusHistory.map((entry, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <OrderStatusBadge status={entry.status} />
                      <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</p>
                      {entry.note && <p className="mt-1 text-xs">{entry.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater order={order} />
            </CardContent>
          </Card>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<Link href={`/pharmacy/customers/${order.uhid}`} />}
            >
              View Customer Timeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
