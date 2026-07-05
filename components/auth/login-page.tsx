import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_USERS, type PortalType } from "@/lib/auth/types";
import { PORTAL_CONFIG } from "@/components/shared/portal-config";
import { LoginForm } from "./login-form";

export function LoginPage({ portalType }: { portalType: PortalType }) {
  const config = PORTAL_CONFIG[portalType];
  const demoUser = DEMO_USERS.find((u) => u.portalType === portalType)!;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-primary/10 p-3">
            <HeartPulse className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">VitaPartner</h1>
          <p className="text-sm text-muted-foreground">{config.tagline}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{config.label} Login</CardTitle>
            <CardDescription>Sign in to manage your {config.label.toLowerCase()} dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm portalType={portalType} defaultEmail={demoUser.email} />
          </CardContent>
        </Card>

        <Card className="border-dashed bg-muted/40">
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo credentials</p>
            <p>
              Email: <span className="font-mono">{demoUser.email}</span>
            </p>
            <p>
              Password: <span className="font-mono">{demoUser.password}</span>
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          {(["pharmacy", "hospital", "lab"] as PortalType[])
            .filter((p) => p !== portalType)
            .map((p) => (
              <Link key={p} href={`/login/${p}`} className="hover:underline">
                {PORTAL_CONFIG[p].label} login
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
