import Link from "next/link";
import { HeartPulse, Pill, Building2, FlaskConical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PORTALS = [
  {
    href: "/login/hospital",
    icon: Building2,
    title: "Hospital Admin",
    description: "Manage doctors, staff, appointments, patient records and billing.",
  },
  {
    href: "/login/pharmacy",
    icon: Pill,
    title: "Medical Store / Pharmacy Admin",
    description: "Manage orders, prescriptions, inventory and revenue analytics.",
  },
  {
    href: "/login/lab",
    icon: FlaskConical,
    title: "Laboratory / Diagnostics Admin",
    description: "Manage test catalogue, bookings and diagnostic analytics.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 p-6">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <div className="rounded-xl bg-primary/10 p-3">
          <HeartPulse className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">VitaPartner</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Choose your partner portal to sign in.
        </p>
      </div>
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {PORTALS.map((portal) => (
          <Link key={portal.href} href={portal.href} className="block">
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/40">
              <CardHeader>
                <portal.icon className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2 text-base">{portal.title}</CardTitle>
                <CardDescription>{portal.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
