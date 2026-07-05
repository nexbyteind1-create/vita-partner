import { PageHeader } from "@/components/shared/page-header";
import { BookingsFilterBar } from "@/components/lab/bookings-filter-bar";
import { BookingsTable } from "@/components/lab/bookings-table";
import { getBookings } from "@/lib/data/lab";
import type { BookingStatus } from "@/lib/data/lab-types";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const bookings = getBookings({ search: params.q, status: (params.status as BookingStatus | "all") ?? "all" });

  return (
    <div>
      <PageHeader title="Bookings" description="View and update all laboratory and diagnostic bookings." />
      <BookingsFilterBar />
      <BookingsTable bookings={bookings} />
    </div>
  );
}
