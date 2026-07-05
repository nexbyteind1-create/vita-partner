import { NextResponse, type NextRequest } from "next/server";
import {
  PORTAL_HOME_PATH,
  PORTAL_LOGIN_PATH,
  SESSION_COOKIE,
  decodeSession,
  type PortalType,
} from "@/lib/auth/types";

const PORTAL_TYPES: PortalType[] = ["pharmacy", "hospital", "lab"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = decodeSession(req.cookies.get(SESSION_COOKIE)?.value);

  const portalSegment = pathname.split("/")[1];

  if (PORTAL_TYPES.includes(portalSegment as PortalType)) {
    const portal = portalSegment as PortalType;
    if (!session) {
      return NextResponse.redirect(new URL(PORTAL_LOGIN_PATH[portal], req.url));
    }
    if (session.portalType !== portal) {
      return NextResponse.redirect(new URL(PORTAL_HOME_PATH[session.portalType], req.url));
    }
  }

  const loginMatch = pathname.match(/^\/login\/(pharmacy|hospital|lab)/);
  if (loginMatch && session) {
    const portal = loginMatch[1] as PortalType;
    if (session.portalType === portal) {
      return NextResponse.redirect(new URL(PORTAL_HOME_PATH[portal], req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pharmacy/:path*", "/hospital/:path*", "/lab/:path*", "/login/:path*"],
};
