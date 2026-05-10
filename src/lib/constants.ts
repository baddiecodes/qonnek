// Qonnek navigation and app constants

import {
  LayoutDashboard,
  Bot,
  Vault,
  ArrowLeftRight,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Treasury", href: "/treasury", icon: Vault },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Activity", href: "/activity", icon: Activity },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export const APP_NAME = "Qonnek";
export const APP_TAGLINE = "CASH-Native Agent Payroll";
