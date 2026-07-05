import { PageHeader } from "@/components/shared/page-header";
import { TestsFilterBar } from "@/components/lab/tests-filter-bar";
import { TestsTable } from "@/components/lab/tests-table";
import { TestFormDialog } from "@/components/lab/test-form-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getPackages, getTests } from "@/lib/data/lab";
import type { TestStatus } from "@/lib/data/lab-types";
import { formatCurrency } from "@/lib/format";

export default async function TestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const tests = getTests({
    search: params.q,
    category: params.category,
    status: (params.status as TestStatus | "all") ?? "all",
  });
  const packages = getPackages();

  return (
    <div>
      <PageHeader
        title="Test Catalogue"
        description="Manage available tests, pricing and status."
        actions={<TestFormDialog />}
      />
      <TestsFilterBar categories={CATEGORIES} />
      <TestsTable tests={tests} />

      <h2 className="mt-8 mb-4 text-lg font-semibold">Test Packages</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm">{pkg.name}</CardTitle>
                <Badge variant={pkg.homeCollectionAvailable ? "secondary" : "outline"} className="text-[10px]">
                  {pkg.homeCollectionAvailable ? "Home Collection" : "Lab Visit Only"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{pkg.description}</p>
              <p className="text-xs text-muted-foreground">{pkg.testIds.length} tests included · {pkg.reportDeliveryTime}</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatCurrency(pkg.offerPrice)}</span>
                {pkg.offerPrice < pkg.price && <span className="text-xs text-muted-foreground line-through">{formatCurrency(pkg.price)}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
