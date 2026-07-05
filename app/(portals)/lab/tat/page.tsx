import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTatAnalytics, getTechnicianPerformance } from "@/lib/data/lab";

export default function TatPage() {
  const tat = getTatAnalytics();
  const technicians = getTechnicianPerformance();

  return (
    <div>
      <PageHeader title="Turnaround Time & Technician Performance" description="Sample-to-report turnaround and technician productivity." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Overall Average TAT" value={`${tat.overallAverageHours} hrs`} />
        <StatCard label="Delayed Tests (>24h)" value={tat.byTest.filter((t) => t.delayed).length} tone="warning" />
        <StatCard label="Tests Tracked" value={tat.byTest.length} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Average Turnaround Time by Test</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Samples</TableHead>
                <TableHead>Avg. Collection → Report (hrs)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tat.byTest.map((t) => (
                <TableRow key={t.key}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.sampleCount}</TableCell>
                  <TableCell>{t.averageHours}</TableCell>
                  <TableCell>
                    {t.delayed ? <Badge variant="destructive">Delayed</Badge> : <Badge variant="secondary">On Time</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Technician Performance</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {technicians.map((t) => (
          <Card key={t.technician.id}>
            <CardHeader>
              <CardTitle className="text-sm">{t.technician.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tests Processed</span><span>{t.totalTestsProcessed}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reports Uploaded</span><span>{t.reportsUploaded}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg. Processing Time</span><span>{t.averageProcessingHours} hrs</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pending Reports</span><span>{t.pendingReports}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delayed Reports</span><span>{t.delayedReports}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
