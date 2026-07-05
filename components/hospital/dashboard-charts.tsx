"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
};

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

export function AppointmentTrendChart({ data }: { data: { date: string; appointments: number }[] }) {
  return (
    <ChartCard title="Appointment Trends (last 14 days)">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="appointments" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ChartCard>
  );
}

export function HospitalRevenueTrendChart({ data }: { data: { date: string; revenue: number }[] }) {
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

export function DoctorWiseAppointmentsChart({ data }: { data: { name: string; appointments: number }[] }) {
  return (
    <ChartCard title="Doctor-wise Appointments">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} width={110} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="appointments" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((row, i) => (
            <Cell key={row.name} fill={CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export function DepartmentWisePatientsChart({ data }: { data: { department: string; patients: number }[] }) {
  const rows = data.slice(0, 7);
  const restTotal = data.slice(7).reduce((s, d) => s + d.patients, 0);
  const all = restTotal > 0 ? [...rows, { department: "Other", patients: restTotal }] : rows;
  return (
    <ChartCard title="Department-wise Patients">
      <BarChart data={all} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="department" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={{ stroke: GRID_STROKE }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="patients" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {all.map((row, i) => (
            <Cell key={row.department} fill={row.department === "Other" ? OTHER_FILL : CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export function ServiceRevenueChart({
  data,
}: {
  data: { labRevenue: number; diagnosticRevenue: number; pharmacyRevenue: number };
}) {
  const rows = [
    { service: "Laboratory", value: data.labRevenue },
    { service: "Diagnostic", value: data.diagnosticRevenue },
    { service: "Pharmacy", value: data.pharmacyRevenue },
  ];
  return (
    <ChartCard title="Laboratory / Diagnostic / Pharmacy Revenue">
      <BarChart data={rows} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="service" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(Number(v))} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
          {rows.map((row, i) => (
            <Cell key={row.service} fill={CATEGORICAL[i % CATEGORICAL.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

export function MonthlyGrowthChart({ data }: { data: { label: string; appointments: number }[] }) {
  return (
    <ChartCard title="Monthly Growth (Appointments)">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="appointments" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ChartCard>
  );
}
