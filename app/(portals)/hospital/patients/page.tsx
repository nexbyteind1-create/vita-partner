import { PageHeader } from "@/components/shared/page-header";
import { PatientSearch } from "@/components/hospital/patient-search";
import { PatientsTable } from "@/components/hospital/patients-table";
import { searchPatients } from "@/lib/data/hospital";

export default async function PatientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const patients = searchPatients(params.q ?? "");

  return (
    <div>
      <PageHeader title="Patient Visit History" description="Search patients and view their complete healthcare journey." />
      <div className="mb-4">
        <PatientSearch />
      </div>
      <PatientsTable patients={patients} />
    </div>
  );
}
