"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEMO_USERS,
  PORTAL_LOGIN_PATH,
  SESSION_COOKIE,
  decodeSession,
  encodeSession,
  type PortalType,
  type SessionPayload,
} from "./types";

export type LoginResult = { error: string } | { success: true };

export async function loginAction(
  portalType: PortalType,
  email: string,
  password: string
): Promise<LoginResult> {
  const user = DEMO_USERS.find(
    (u) => u.portalType === portalType && u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user || user.password !== password) {
    return { error: "Invalid email or password for this portal." };
  }

  const payload: SessionPayload = {
    userId: user.id,
    name: user.name,
    portalType: user.portalType,
    role: user.role,
    orgName: user.orgName,
  };

  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { success: true };
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function logoutAction(portalType: PortalType): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect(PORTAL_LOGIN_PATH[portalType]);
}
