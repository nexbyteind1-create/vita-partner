import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PORTAL_LOGIN_PATH } from "@/lib/auth/types";
import { PortalShell } from "@/components/shared/portal-shell";

export default async function HospitalPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.portalType !== "hospital") {
    redirect(PORTAL_LOGIN_PATH.hospital);
  }

  return (
    <PortalShell portalType="hospital" session={session}>
      {children}
    </PortalShell>
  );
}
