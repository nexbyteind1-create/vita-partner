"use client";

import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToCsv, exportToExcel, exportToPdf, type ReportColumn } from "@/lib/export";

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  columns: ReportColumn[];
  data: Record<string, unknown>[];
}

function ReportCard({ report }: { report: ReportDefinition }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{report.title}</CardTitle>
        <CardDescription>{report.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => exportToCsv(report.id, report.columns, report.data)}>
          <FileDown className="h-4 w-4" /> CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => exportToExcel(report.id, report.title, report.columns, report.data)}
        >
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportToPdf(report.id, report.title, report.columns, report.data)}>
          <FileText className="h-4 w-4" /> PDF
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReportsPanel({ reports }: { reports: ReportDefinition[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  );
}
