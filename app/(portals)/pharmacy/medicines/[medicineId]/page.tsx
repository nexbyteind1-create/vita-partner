import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { MedicineBuyersTable } from "@/components/pharmacy/medicine-buyers-table";
import { getMedicineDetail } from "@/lib/data/pharmacy";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function MedicineDetailPage({ params }: { params: Promise<{ medicineId: string }> }) {
  const { medicineId } = await params;
  const detail = getMedicineDetail(medicineId);
  if (!detail) notFound();

  const { medicine, buyers } = detail;
  const totalQuantitySold = buyers.reduce((s, b) => s + b.quantity, 0);
  const revenue = buyers.reduce((s, b) => s + b.spend, 0);

  return (
    <div>
      <Link href="/pharmacy/medicines" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Medicines
      </Link>
      <PageHeader
        title={medicine.name}
        description={`${medicine.category} · MRP ${formatCurrency(medicine.mrp)} · Selling Price ${formatCurrency(medicine.price)}`}
        actions={medicine.requiresPrescription ? <Badge variant="secondary">Prescription Required</Badge> : undefined}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Orders" value={buyers.length} />
        <StatCard label="Total Quantity Sold" value={totalQuantitySold} />
        <StatCard label="Revenue Generated" value={formatCurrency(revenue)} />
        <StatCard
          label="Available Stock"
          value={medicine.stock}
          tone={medicine.stock === 0 ? "danger" : medicine.stock <= medicine.reorderLevel ? "warning" : "default"}
        />
      </div>

      <div className="mt-6 rounded-md border p-4">
        <p className="mb-2 text-sm font-medium">Batches</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {medicine.batches.map((b) => (
            <div key={b.batchNo} className="rounded-md border p-2.5 text-xs">
              <p className="font-medium">{b.batchNo}</p>
              <p className="text-muted-foreground">Qty: {b.quantity}</p>
              <p className="text-muted-foreground">Expiry: {formatDate(b.expiryDate)}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Customers who purchased this medicine</h2>
      <MedicineBuyersTable buyers={buyers} />
    </div>
  );
}
