import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/hospital/status-badges";
import { FollowUpStatusBadge } from "@/components/hospital/status-badges";
import { DocumentUploadDialog } from "@/components/hospital/document-upload-dialog";
import { getPatientJourney } from "@/lib/data/hospital";
import { MEDICAL_DOCUMENT_TYPE_LABEL } from "@/lib/data/hospital-types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default async function PatientJourneyPage({ params }: { params: Promise<{ uhid: string }> }) {
  const { uhid } = await params;
  const journey = getPatientJourney(uhid);
  if (!journey) notFound();

  const { patient, appointments, labBookings, diagnosticBookings, pharmacyBills, admissions, documents, followUps, timeline, billing } = journey;
  const latestAppt = appointments[0];

  return (
    <div>
      <Link href="/hospital/patients" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>

      <PageHeader
        title={patient.name}
        description={`${patient.uhid} · ${patient.gender}, ${patient.age} yrs · Blood Group ${patient.bloodGroup} · ${patient.mobile}`}
        actions={<DocumentUploadDialog uhid={patient.uhid} patientName={patient.name} doctorName={latestAppt?.doctorName} department={latestAppt?.department} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Overall Bill Amount" value={formatCurrency(billing.overallBill)} />
        <StatCard label="Paid Amount" value={formatCurrency(billing.paidAmount)} tone="success" />
        <StatCard label="Pending Amount" value={formatCurrency(billing.pendingAmount)} tone={billing.pendingAmount > 0 ? "warning" : "default"} />
        <StatCard label="Total Appointments" value={appointments.length} />
        <StatCard label="Admissions" value={admissions.length} />
      </div>

      <Tabs defaultValue="timeline" className="mt-6">
        <TabsList>
          <TabsTrigger value="timeline">Medical Timeline</TabsTrigger>
          <TabsTrigger value="appointments">Appointment History</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Medical Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recorded events yet.</p>
              ) : (
                <ol className="space-y-3">
                  {timeline.map((event, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 border-b pb-3 text-sm last:border-0 last:pb-0">
                      <span>{event.label}</span>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(event.date)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appointment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {appointments.length === 0 && <p className="text-sm text-muted-foreground">No appointments yet.</p>}
              {appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                  <div>
                    <p className="font-medium">{a.doctorName} · {a.department}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(a.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(a.consultationFee)}</p>
                    <AppointmentStatusBadge status={a.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Consultation Bills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {appointments.filter((a) => a.status === "completed").map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <span>{a.doctorName} · {formatDate(a.date)}</span>
                    <span className="font-medium">{formatCurrency(a.consultationFee)}</span>
                  </div>
                ))}
                {appointments.filter((a) => a.status === "completed").length === 0 && <p className="text-sm text-muted-foreground">No consultation bills.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Laboratory Bills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {labBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <span>{b.testName} · {b.labName}</span>
                    <span className="flex items-center gap-2 font-medium">{formatCurrency(b.amount)} <PaymentStatusBadge status={b.paymentStatus} /></span>
                  </div>
                ))}
                {labBookings.length === 0 && <p className="text-sm text-muted-foreground">No laboratory bills.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Diagnostic Bills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {diagnosticBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <span>{b.testName} · {b.diagnosticCenter}</span>
                    <span className="flex items-center gap-2 font-medium">{formatCurrency(b.amount)} <PaymentStatusBadge status={b.paymentStatus} /></span>
                  </div>
                ))}
                {diagnosticBookings.length === 0 && <p className="text-sm text-muted-foreground">No diagnostic bills.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pharmacy Bills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pharmacyBills.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <span>{b.billNumber} · {b.pharmacyName}</span>
                    <span className="flex items-center gap-2 font-medium">{formatCurrency(b.amount)} <PaymentStatusBadge status={b.paymentStatus} /></span>
                  </div>
                ))}
                {pharmacyBills.length === 0 && <p className="text-sm text-muted-foreground">No pharmacy bills.</p>}
              </CardContent>
            </Card>
            {admissions.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Admission Bills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {admissions.map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                      <span>{a.treatingDoctor} · {formatDate(a.admissionDate)}{a.dischargeDate ? ` → ${formatDate(a.dischargeDate)}` : " (Admitted)"}</span>
                      <span className="flex items-center gap-2 font-medium">{formatCurrency(a.charges)} <PaymentStatusBadge status={a.paymentStatus} /></span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Medical Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
              {documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                  <div>
                    <p className="font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {MEDICAL_DOCUMENT_TYPE_LABEL[d.type]} · Uploaded {formatDateTime(d.uploadedAt)} by {d.uploadedBy}
                      {d.doctorName ? ` · ${d.doctorName}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<a href={d.fileUrl} target="_blank" rel="noreferrer" />}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {followUps.length === 0 && <p className="text-sm text-muted-foreground">No follow-ups scheduled.</p>}
              {followUps.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                  <div>
                    <p className="font-medium">{f.type} · {f.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(f.followUpDate)}</p>
                  </div>
                  <FollowUpStatusBadge status={f.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
