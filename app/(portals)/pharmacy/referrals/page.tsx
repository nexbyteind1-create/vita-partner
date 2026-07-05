import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReferralAnalytics } from "@/lib/data/pharmacy";
import { formatCurrency } from "@/lib/format";

export default function ReferralsPage() {
  const { doctors, hospitals, mostPrescribedMedicines } = getReferralAnalytics();

  return (
    <div>
      <PageHeader title="Doctor & Hospital Analytics" description="Referral prescriptions, revenue and most-prescribed medicines." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Doctor-wise Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Prescriptions</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Most Prescribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((d) => (
                  <TableRow key={d.doctor.id}>
                    <TableCell className="font-medium">{d.doctor.name}</TableCell>
                    <TableCell className="text-muted-foreground">{d.doctor.hospitalName}</TableCell>
                    <TableCell>{d.prescriptions}</TableCell>
                    <TableCell>{formatCurrency(d.revenue)}</TableCell>
                    <TableCell className="text-muted-foreground">{d.mostPrescribed ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hospital-wise Orders</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.map((h) => (
                  <TableRow key={h.hospitalId}>
                    <TableCell className="font-medium">{h.hospitalName}</TableCell>
                    <TableCell>{h.orders}</TableCell>
                    <TableCell>{formatCurrency(h.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Most Prescribed Medicines</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {mostPrescribedMedicines.map((m, i) => (
              <div key={m.name} className="rounded-md border p-3 text-sm">
                <p className="text-xs text-muted-foreground">#{i + 1}</p>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.qty} units</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
