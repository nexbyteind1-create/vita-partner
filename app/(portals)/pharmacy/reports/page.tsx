import { PageHeader } from "@/components/shared/page-header";
import { ReportsPanel, type ReportDefinition } from "@/components/shared/reports-panel";
import { CUSTOMERS } from "@/lib/mock/pharmacy-fixtures";
import {
  getCustomerOrders,
  getInventoryAnalytics,
  getMedicineAnalyticsList,
  getOrders,
  getRevenueAnalytics,
} from "@/lib/data/pharmacy";
import { ORDER_STATUS_LABEL } from "@/lib/data/types";

export default function ReportsPage() {
  const orders = getOrders();
  const medicines = getMedicineAnalyticsList();
  const inventory = getInventoryAnalytics();
  const revenue = getRevenueAnalytics();

  const orderReport = orders.map((o) => ({
    orderId: o.id,
    uhid: o.uhid,
    customerName: o.customerName,
    mobile: o.mobile,
    amount: o.amount,
    paymentStatus: o.paymentStatus,
    deliveryType: o.deliveryType,
    status: ORDER_STATUS_LABEL[o.status],
    createdAt: new Date(o.createdAt).toLocaleString("en-IN"),
  }));

  const customerReport = CUSTOMERS.map((c) => {
    const custOrders = getCustomerOrders(c.uhid).filter((o) => o.status !== "cancelled");
    return {
      uhid: c.uhid,
      name: c.name,
      mobile: c.mobile,
      membership: c.membership,
      totalOrders: custOrders.length,
      totalSpent: custOrders.reduce((s, o) => s + o.amount, 0),
      walletCredits: c.walletCredits,
    };
  });

  const medicineSalesReport = medicines.map((m) => ({
    name: m.medicine.name,
    category: m.medicine.category,
    totalOrders: m.totalOrders,
    quantitySold: m.totalQuantitySold,
    revenue: m.revenueGenerated,
    availableStock: m.availableStock,
  }));

  const inventoryReport = medicines.map((m) => ({
    name: m.medicine.name,
    category: m.medicine.category,
    availableStock: m.availableStock,
    reorderLevel: m.medicine.reorderLevel,
    status: m.outOfStock ? "Out of Stock" : m.lowStock ? "Low Stock" : "In Stock",
  }));

  const revenueReport = revenue.byMedicine.map((m) => ({ medicine: m.name, revenue: m.revenue }));

  const lowStockReport = inventory.lowStock.map((m) => ({
    name: m.name,
    category: m.category,
    stock: m.stock,
    reorderLevel: m.reorderLevel,
  }));

  const expiryReport = [...inventory.expired, ...inventory.expiringSoon].map((r) => ({
    medicine: r.medicine.name,
    batchNo: r.batch.batchNo,
    quantity: r.batch.quantity,
    expiryDate: new Date(r.batch.expiryDate).toLocaleDateString("en-IN"),
    status: new Date(r.batch.expiryDate) < new Date() ? "Expired" : "Expiring Soon",
  }));

  const reports: ReportDefinition[] = [
    {
      id: "order-report",
      title: "Order Report",
      description: `${orderReport.length} orders`,
      columns: [
        { key: "orderId", label: "Order ID" },
        { key: "uhid", label: "UHID" },
        { key: "customerName", label: "Customer Name" },
        { key: "mobile", label: "Mobile" },
        { key: "amount", label: "Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "deliveryType", label: "Delivery Type" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ],
      data: orderReport,
    },
    {
      id: "customer-report",
      title: "Customer Report",
      description: `${customerReport.length} customers`,
      columns: [
        { key: "uhid", label: "UHID" },
        { key: "name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "membership", label: "Membership" },
        { key: "totalOrders", label: "Total Orders" },
        { key: "totalSpent", label: "Total Spent" },
        { key: "walletCredits", label: "Wallet Credits" },
      ],
      data: customerReport,
    },
    {
      id: "medicine-sales-report",
      title: "Medicine Sales Report",
      description: `${medicineSalesReport.length} medicines`,
      columns: [
        { key: "name", label: "Medicine" },
        { key: "category", label: "Category" },
        { key: "totalOrders", label: "Total Orders" },
        { key: "quantitySold", label: "Quantity Sold" },
        { key: "revenue", label: "Revenue" },
        { key: "availableStock", label: "Available Stock" },
      ],
      data: medicineSalesReport,
    },
    {
      id: "inventory-report",
      title: "Inventory Report",
      description: `${inventoryReport.length} medicines`,
      columns: [
        { key: "name", label: "Medicine" },
        { key: "category", label: "Category" },
        { key: "availableStock", label: "Available Stock" },
        { key: "reorderLevel", label: "Reorder Level" },
        { key: "status", label: "Status" },
      ],
      data: inventoryReport,
    },
    {
      id: "revenue-report",
      title: "Revenue Report",
      description: `Revenue by medicine (${revenueReport.length} items)`,
      columns: [
        { key: "medicine", label: "Medicine" },
        { key: "revenue", label: "Revenue" },
      ],
      data: revenueReport,
    },
    {
      id: "low-stock-report",
      title: "Low Stock Report",
      description: `${lowStockReport.length} medicines below reorder level`,
      columns: [
        { key: "name", label: "Medicine" },
        { key: "category", label: "Category" },
        { key: "stock", label: "Stock" },
        { key: "reorderLevel", label: "Reorder Level" },
      ],
      data: lowStockReport,
    },
    {
      id: "expiry-report",
      title: "Expiry Report",
      description: `${expiryReport.length} batches expired or expiring soon`,
      columns: [
        { key: "medicine", label: "Medicine" },
        { key: "batchNo", label: "Batch No." },
        { key: "quantity", label: "Quantity" },
        { key: "expiryDate", label: "Expiry Date" },
        { key: "status", label: "Status" },
      ],
      data: expiryReport,
    },
  ];

  return (
    <div>
      <PageHeader title="Reports" description="Export pharmacy reports as CSV, Excel or PDF." />
      <ReportsPanel reports={reports} />
    </div>
  );
}
