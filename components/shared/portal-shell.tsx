import Link from "next/link";
import { HeartPulse, LogOut } from "lucide-react";
import type { PortalType, SessionPayload } from "@/lib/auth/types";
import { logoutAction } from "@/lib/auth/session";
import { PORTAL_CONFIG } from "./portal-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

export function PortalShell({
  portalType,
  session,
  children,
}: {
  portalType: PortalType;
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const config = PORTAL_CONFIG[portalType];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <HeartPulse className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-semibold leading-none">VitaPartner</p>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {config.nav.map((item) => {
            const Icon = item.icon;
            if (item.soon || !item.href) {
              return (
                <div
                  key={item.label}
                  className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground/60"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    Soon
                  </Badge>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-2 border-b bg-background px-3 md:px-6">
          <div className="flex min-w-0 items-center gap-1 md:hidden">
            <MobileNav portalType={portalType} />
            <HeartPulse className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-semibold">{config.label}</span>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">{config.tagline}</p>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="min-w-0 text-right leading-tight">
              <p className="max-w-[110px] truncate text-sm font-medium sm:max-w-none">{session.name}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{session.orgName}</p>
            </div>
            <form action={logoutAction.bind(null, portalType)}>
              <Button variant="ghost" size="icon" type="submit" title="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
