export type PortalType = "pharmacy" | "hospital" | "lab";
export type Role = "admin" | "staff";

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  portalType: PortalType;
  role: Role;
  orgName: string;
}

export interface SessionPayload {
  userId: string;
  name: string;
  portalType: PortalType;
  role: Role;
  orgName: string;
}

// NOTE: Demo-only credential store. Replace with Supabase Auth + a real
// `profiles` table (org_id, portal_type, role) when the backend is wired in.
export const DEMO_USERS: DemoUser[] = [
  {
    id: "u_pharmacy_admin",
    email: "pharmacy.admin@demo.vita",
    password: "demo1234",
    name: "Ananya Rao",
    portalType: "pharmacy",
    role: "admin",
    orgName: "Vita Pharmacy — MG Road",
  },
  {
    id: "u_hospital_admin",
    email: "hospital.admin@demo.vita",
    password: "demo1234",
    name: "Dr. Karthik Iyer",
    portalType: "hospital",
    role: "admin",
    orgName: "Apollo Care Hospital",
  },
  {
    id: "u_lab_admin",
    email: "lab.admin@demo.vita",
    password: "demo1234",
    name: "Priya Menon",
    portalType: "lab",
    role: "admin",
    orgName: "Vita Diagnostics Center",
  },
];

export const PORTAL_LOGIN_PATH: Record<PortalType, string> = {
  pharmacy: "/login/pharmacy",
  hospital: "/login/hospital",
  lab: "/login/lab",
};

export const PORTAL_HOME_PATH: Record<PortalType, string> = {
  pharmacy: "/pharmacy",
  hospital: "/hospital",
  lab: "/lab",
};

export const SESSION_COOKIE = "vita_session";

// Demo-only session encoding (plain JSON, not signed/encrypted). Fine for a
// mock-data prototype; must not be trusted as secure once real auth lands.
export function encodeSession(payload: SessionPayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}

export function decodeSession(value: string | undefined | null): SessionPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as SessionPayload;
  } catch {
    return null;
  }
}
