import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PORTAL_LOGIN_PATH } from "@/lib/auth/types";
import { PortalShell } from "@/components/shared/portal-shell";

export default async function PharmacyPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.portalType !== "pharmacy") {
    redirect(PORTAL_LOGIN_PATH.pharmacy);
  }

  return (
    <PortalShell portalType="pharmacy" session={session}>
      {children}
    </PortalShell>
  );
}
