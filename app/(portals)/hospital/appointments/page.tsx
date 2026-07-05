import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AppointmentsFilterBar } from "@/components/hospital/appointments-filter-bar";
import { AppointmentsTable } from "@/components/hospital/appointments-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEPARTMENTS, DOCTORS, getAppointments, getNoShowAnalytics } from "@/lib/data/hospital";
import type { AppointmentStatus } from "@/lib/data/hospital-types";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; doctorId?: string; department?: string }>;
}) {
  const params = await searchParams;
  const allAppointments = getAppointments();
  const filtered = getAppointments({
    status: (params.status as AppointmentStatus | "all") ?? "all",
    search: params.q,
    doctorId: params.doctorId,
    department: params.department,
  });
  const noShow = getNoShowAnalytics();

  const total = allAppointments.length;
  const completed = allAppointments.filter((a) => a.status === "completed").length;
  const cancelled = allAppointments.filter((a) => a.status === "cancelled").length;
  const rescheduled = allAppointments.filter((a) => a.status === "rescheduled").length;
  const pending = allAppointments.filter((a) => ["scheduled", "checked_in", "waiting", "consultation_started"].includes(a.status)).length;

  return (
    <div>
      <PageHeader title="Appointments" description="Attendance management, appointment status and no-show tracking." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Appointments" value={total} />
        <StatCard label="Completed" value={completed} tone="success" />
        <StatCard label="Cancelled" value={cancelled} tone="danger" />
        <StatCard label="Rescheduled" value={rescheduled} />
        <StatCard label="Pending" value={pending} tone="warning" />
        <StatCard label="No Show" value={noShow.total} tone="danger" />
      </div>

      <Tabs defaultValue="appointments" className="mt-6">
        <TabsList>
          <TabsTrigger value="appointments">All Appointments</TabsTrigger>
          <TabsTrigger value="noshow">No-Show Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <AppointmentsFilterBar doctors={DOCTORS} departments={DEPARTMENTS} />
          <AppointmentsTable appointments={filtered} />
        </TabsContent>

        <TabsContent value="noshow">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
            <StatCard label="Total No Shows" value={noShow.total} />
            <StatCard label="Today's No Shows" value={noShow.today} />
            <StatCard label="This Month's No Shows" value={noShow.thisMonth} />
            <StatCard label="Repeat No-Show Patients" value={noShow.repeatPatients.length} tone="warning" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Doctor-wise No Shows</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>No Shows</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {noShow.byDoctor.map((d) => (
                      <TableRow key={d.name}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Department-wise No Shows</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>No Shows</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {noShow.byDepartment.map((d) => (
                      <TableRow key={d.name}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Repeat No-Show Patients</CardTitle>
              </CardHeader>
              <CardContent>
                {noShow.repeatPatients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No repeat no-show patients.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {noShow.repeatPatients.map((p) => (
                      <div key={p.uhid} className="rounded-md border p-2.5 text-sm">
                        <p className="font-medium">{p.patientName}</p>
                        <p className="text-xs text-muted-foreground">{p.uhid} · {p.count} no-shows</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
