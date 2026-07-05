import { Boxes, AlertTriangle, PackageX, CalendarClock, CalendarX2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { InventoryByCategoryChart } from "@/components/pharmacy/dashboard-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getGraphData, getInventoryAnalytics } from "@/lib/data/pharmacy";
import { formatDate } from "@/lib/format";

export default function InventoryPage() {
  const inventory = getInventoryAnalytics();
  const graph = getGraphData();

  return (
    <div>
      <PageHeader title="Inventory Analytics" description="Stock levels, expiry tracking and movement trends." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Stock Units" value={inventory.totalStockUnits} icon={Boxes} />
        <StatCard label="Low Stock Medicines" value={inventory.lowStock.length} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={inventory.outOfStock.length} icon={PackageX} tone="danger" />
        <StatCard label="Expiring Soon (45d)" value={inventory.expiringSoon.length} icon={CalendarClock} tone="warning" />
        <StatCard label="Expired Batches" value={inventory.expired.length} icon={CalendarX2} tone="danger" />
      </div>

      <div className="mt-6">
        <InventoryByCategoryChart data={graph.inventoryByCategory} />
      </div>

      <Tabs defaultValue="low_stock" className="mt-6">
        <TabsList>
          <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="fast">Fast Moving</TabsTrigger>
          <TabsTrigger value="slow">Slow Moving</TabsTrigger>
        </TabsList>

        <TabsContent value="low_stock">
          <SimpleTable
            rows={inventory.lowStock}
            columns={["Medicine", "Category", "Stock", "Reorder Level"]}
            render={(m) => [m.name, m.category, m.stock, m.reorderLevel]}
          />
        </TabsContent>
        <TabsContent value="out_of_stock">
          <SimpleTable
            rows={inventory.outOfStock}
            columns={["Medicine", "Category"]}
            render={(m) => [m.name, m.category]}
          />
        </TabsContent>
        <TabsContent value="expiring">
          <SimpleTable
            rows={inventory.expiringSoon}
            columns={["Medicine", "Batch No.", "Quantity", "Expiry Date"]}
            render={(r) => [r.medicine.name, r.batch.batchNo, r.batch.quantity, formatDate(r.batch.expiryDate)]}
          />
        </TabsContent>
        <TabsContent value="expired">
          <SimpleTable
            rows={inventory.expired}
            columns={["Medicine", "Batch No.", "Quantity", "Expiry Date"]}
            render={(r) => [r.medicine.name, r.batch.batchNo, r.batch.quantity, <Badge key="e" variant="destructive">{formatDate(r.batch.expiryDate)}</Badge>]}
          />
        </TabsContent>
        <TabsContent value="fast">
          <SimpleTable
            rows={inventory.fastMoving}
            columns={["Medicine", "Qty Sold", "Available Stock"]}
            render={(m) => [m.medicine.name, m.totalQuantitySold, m.availableStock]}
          />
        </TabsContent>
        <TabsContent value="slow">
          <SimpleTable
            rows={inventory.slowMoving}
            columns={["Medicine", "Qty Sold", "Available Stock"]}
            render={(m) => [m.medicine.name, m.totalQuantitySold, m.availableStock]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SimpleTable<T>({
  rows,
  columns,
  render,
}: {
  rows: T[];
  columns: string[];
  render: (row: T) => React.ReactNode[];
}) {
  if (rows.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">Nothing to show in this view.</p>;
  }
  return (
    <div className="mt-4 overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {render(row).map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
