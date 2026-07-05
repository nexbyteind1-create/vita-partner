"use client";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportColumn {
  key: string;
  label: string;
}

function toRows(data: Record<string, unknown>[], columns: ReportColumn[]) {
  return data.map((row) => columns.map((c) => row[c.key] ?? ""));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportToCsv(filename: string, columns: ReportColumn[], data: Record<string, unknown>[]) {
  const header = columns.map((c) => c.label).join(",");
  const rows = toRows(data, columns).map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  );
  const csv = [header, ...rows].join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${filename}.csv`);
}

export function exportToExcel(filename: string, sheetName: string, columns: ReportColumn[], data: Record<string, unknown>[]) {
  const rows = data.map((row) => {
    const record: Record<string, unknown> = {};
    for (const c of columns) record[c.label] = row[c.key] ?? "";
    return record;
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPdf(filename: string, title: string, columns: ReportColumn[], data: Record<string, unknown>[]) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [columns.map((c) => c.label)],
    body: toRows(data, columns).map((row) => row.map(String)),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [42, 120, 214] },
  });
  doc.save(`${filename}.pdf`);
}
