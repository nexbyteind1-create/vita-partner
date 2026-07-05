import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdmissionBillingTable,
  ConsolidatedBillingTable,
  ConsultationBillingTable,
  DiagnosticBillingTable,
  LabBillingTable,
  PharmacyBillingTable,
} from "@/components/hospital/billing-tables";
import {
  getAdmissionBillings,
  getConsolidatedBilling,
  getConsultationBillings,
  getDiagnosticBillings,
  getLabBillings,
  getPharmacyBillings,
} from "@/lib/data/hospital";

export default function BillingPage() {
  const consolidated = getConsolidatedBilling();
  const consultation = getConsultationBillings();
  const lab = getLabBillings();
  const diagnostic = getDiagnosticBillings();
  const pharmacy = getPharmacyBillings();
  const admission = getAdmissionBillings();

  return (
    <div>
      <PageHeader title="Billing" description="Consolidated and per-service billing across the hospital." />
      <Tabs defaultValue="consolidated">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="admission">Admission</TabsTrigger>
        </TabsList>
        <TabsContent value="consolidated">
          <ConsolidatedBillingTable rows={consolidated} />
        </TabsContent>
        <TabsContent value="consultation">
          <ConsultationBillingTable rows={consultation} />
        </TabsContent>
        <TabsContent value="laboratory">
          <LabBillingTable rows={lab} />
        </TabsContent>
        <TabsContent value="diagnostic">
          <DiagnosticBillingTable rows={diagnostic} />
        </TabsContent>
        <TabsContent value="pharmacy">
          <PharmacyBillingTable rows={pharmacy} />
        </TabsContent>
        <TabsContent value="admission">
          <AdmissionBillingTable rows={admission} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
