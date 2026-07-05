import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReferralAnalytics } from "@/lib/data/lab";
import { formatCurrency } from "@/lib/format";

export default function ReferralsPage() {
  const { doctors, hospitals } = getReferralAnalytics();

  return (
    <div>
      <PageHeader title="Referring Doctor & Hospital Analytics" description="Referred patients, tests booked and revenue by referral source." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Referring Doctors</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Patients Referred</TableHead>
                  <TableHead>Tests Booked</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Most Recommended</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((d) => (
                  <TableRow key={d.doctor.id}>
                    <TableCell className="font-medium">{d.doctor.name}</TableCell>
                    <TableCell>{d.totalPatientsReferred}</TableCell>
                    <TableCell>{d.testsBooked}</TableCell>
                    <TableCell>{formatCurrency(d.revenueGenerated)}</TableCell>
                    <TableCell className="text-muted-foreground">{d.mostRecommendedTest ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hospital Analytics</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Pending Reports</TableHead>
                  <TableHead>Most Requested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.map((h) => (
                  <TableRow key={h.hospitalId}>
                    <TableCell className="font-medium">{h.hospitalName}</TableCell>
                    <TableCell>{h.totalPatients}</TableCell>
                    <TableCell>{h.totalTests}</TableCell>
                    <TableCell>{formatCurrency(h.revenue)}</TableCell>
                    <TableCell>{h.pendingReports}</TableCell>
                    <TableCell className="text-muted-foreground">{h.mostRequestedTest ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
