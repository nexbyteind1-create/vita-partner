import { PageHeader } from "@/components/shared/page-header";
import { PatientSearch } from "@/components/lab/patient-search";
import { PatientsTable } from "@/components/lab/patients-table";
import { searchPatients } from "@/lib/data/lab";

export default async function PatientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const patients = searchPatients(params.q ?? "");

  return (
    <div>
      <PageHeader title="Patient Analytics" description="Search patients and view their test history." />
      <div className="mb-4">
        <PatientSearch />
      </div>
      <PatientsTable patients={patients} />
    </div>
  );
}
