import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  FileCheck2,
  Users,
  Pill,
  TrendingUp,
  Boxes,
  Stethoscope,
  FileDown,
  CalendarClock,
  ClipboardList,
  UserCog,
  Receipt,
  PhoneCall,
  LifeBuoy,
  FlaskConical,
  BookOpen,
  Timer,
} from "lucide-react";
import type { PortalType } from "@/lib/auth/types";

export interface PortalNavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  soon?: boolean;
}

export interface PortalConfig {
  type: PortalType;
  label: string;
  tagline: string;
  nav: PortalNavItem[];
}

export const PORTAL_CONFIG: Record<PortalType, PortalConfig> = {
  pharmacy: {
    type: "pharmacy",
    label: "Pharmacy Admin",
    tagline: "Medical Store Partner Portal",
    nav: [
      { label: "Dashboard", href: "/pharmacy", icon: LayoutDashboard },
      { label: "Orders", href: "/pharmacy/orders", icon: ShoppingCart },
      { label: "Prescriptions", href: "/pharmacy/prescriptions", icon: FileCheck2 },
      { label: "Customers", href: "/pharmacy/customers", icon: Users },
      { label: "Medicines", href: "/pharmacy/medicines", icon: Pill },
      { label: "Revenue", href: "/pharmacy/revenue", icon: TrendingUp },
      { label: "Inventory", href: "/pharmacy/inventory", icon: Boxes },
      { label: "Doctors & Hospitals", href: "/pharmacy/referrals", icon: Stethoscope },
      { label: "Reports", href: "/pharmacy/reports", icon: FileDown },
    ],
  },
  hospital: {
    type: "hospital",
    label: "Hospital Admin",
    tagline: "Hospital Partner Portal",
    nav: [
      { label: "Dashboard", href: "/hospital", icon: LayoutDashboard },
      { label: "Appointments", href: "/hospital/appointments", icon: CalendarClock },
      { label: "Doctors", href: "/hospital/doctors", icon: Stethoscope },
      { label: "Patients", href: "/hospital/patients", icon: ClipboardList },
      { label: "Billing", href: "/hospital/billing", icon: Receipt },
      { label: "Revenue", href: "/hospital/revenue", icon: TrendingUp },
      { label: "Follow-ups", href: "/hospital/follow-ups", icon: PhoneCall },
      { label: "Support Center", href: "/hospital/support", icon: LifeBuoy },
      { label: "Reports", href: "/hospital/reports", icon: FileDown },
      { label: "Doctors & Staff Management", icon: UserCog, soon: true },
    ],
  },
  lab: {
    type: "lab",
    label: "Laboratory / Diagnostics Admin",
    tagline: "Lab & Diagnostics Partner Portal",
    nav: [
      { label: "Dashboard", href: "/lab", icon: LayoutDashboard },
      { label: "Test Catalogue", href: "/lab/tests", icon: FlaskConical },
      { label: "Bookings", href: "/lab/bookings", icon: BookOpen },
      { label: "Patients", href: "/lab/patients", icon: Users },
      { label: "Revenue", href: "/lab/revenue", icon: TrendingUp },
      { label: "TAT & Technicians", href: "/lab/tat", icon: Timer },
      { label: "Referrals", href: "/lab/referrals", icon: Stethoscope },
      { label: "Reports", href: "/lab/reports", icon: FileDown },
    ],
  },
};
