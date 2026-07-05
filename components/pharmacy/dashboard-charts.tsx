"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

const CATEGORICAL = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];
const OTHER_FILL = "var(--muted-foreground)";
const GRID_STROKE = "var(--border)";
const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 11 };

function foldTop<T extends { value: number }>(rows: T[], labelKey: keyof T, max = 7) {
  if (rows.length <= max) return rows;
  const top = rows.slice(0, max);
  const restTotal = rows.slice(max).reduce((s, r) => s + r.value, 0);
  return [...top, { [labelKey]: "Other", value: restTotal } as unknown as T];
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
};

export function DailyOrdersChart({ data }: { data: { date: string; orders: number }[] }) {
  return (
    <ChartCard title="Daily Orders (last 14 days)">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="orders" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ChartCard>
  );
}

export function RevenueTrendChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ChartCard title="Revenue Trend (last 14 days)">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(Number(v))} />
        <Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartCard>
  );
}

export function CategorySalesChart({ data }: { data: { category: string; revenue: number }[] }) {
  const rows = foldTop(
    data.map((d) => ({ category: d.category, value: d.revenue })),
    "category"
  );
  return (
    <ChartCard title="Medicine Category Sales">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <YAxis type="category" dataKey="category" tick={AXIS_TICK} axisLine={false} tickLine={false} width={110} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(Number(v))} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {rows.map((row, i) => (
            <Cell key={row.category} fill={row.category === "Other" ? OTHER_FILL : CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export function MonthlySalesChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ChartCard title="Monthly Sales">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(Number(v))} />
        <Bar dataKey="revenue" fill="var(--chart-3)" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartCard>
  );
}

export function CustomerGrowthChart({ data }: { data: { label: string; totalCustomers: number }[] }) {
  return (
    <ChartCard title="Customer Growth">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="totalCustomers" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ChartCard>
  );
}

export function RepeatCustomerTrendChart({ data }: { data: { label: string; repeatRate: number }[] }) {
  return (
    <ChartCard title="Repeat Customer Trend">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
        <Line type="monotone" dataKey="repeatRate" stroke="var(--chart-6)" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ChartCard>
  );
}

export function TopSellingMedicinesChart({ data }: { data: { name: string; quantity: number }[] }) {
  return (
    <ChartCard title="Top Selling Medicines">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} width={140} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="quantity" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((row, i) => (
            <Cell key={row.name} fill={CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export function InventoryByCategoryChart({ data }: { data: { category: string; stock: number }[] }) {
  const rows = foldTop(
    data.map((d) => ({ category: d.category, value: d.stock })),
    "category"
  );
  return (
    <ChartCard title="Inventory by Category">
      <BarChart data={rows} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={{ stroke: GRID_STROKE }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {rows.map((row, i) => (
            <Cell key={row.category} fill={row.category === "Other" ? OTHER_FILL : CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
