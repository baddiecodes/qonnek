import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Vault,
  ArrowLeftRight,
  Activity,
  Menu,
  X,
} from "lucide-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/treasury", label: "Treasury", icon: Vault },
  { to: "/transactions", label: "Transfers", icon: ArrowLeftRight },
  { to: "/activity", label: "Activity", icon: Activity },
];

const BOTTOM_NAV = links.slice(0, 4);

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-[220px] flex-col border-r border-sidebar-border shrink-0"
        style={{ background: "var(--gradient-sidebar)" }}
      >
        <div className="px-5 pt-5 pb-5">
          <span className="text-lg font-extrabold gradient-text tracking-tight select-none">
            QONNEK
          </span>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5 font-medium">
            AI Agent Payroll
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border/60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[11px] font-mono text-green-400 uppercase tracking-wide">
              devnet
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border/50 px-4 sm:px-6 h-14 shrink-0 bg-background">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={openDrawer}
              className="p-2 rounded-lg hover:bg-secondary/50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold">QONNEK</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">
              Solana Devnet
            </span>
          </div>

          <div className="ml-auto">
            <WalletMultiButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 pb-24 md:pb-6 max-w-[1360px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="hidden md:flex items-center justify-between px-6 py-3 border-t border-border/50 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} QONNEK</span>

          <div className="flex gap-4">
            <a href="https://github.com/baddiecodes/qonnek" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://twitter.com/xqonnek" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </footer>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            <motion.aside
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-background md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="p-4 flex justify-between">
                <span className="font-bold">QONNEK</span>
                <button onClick={closeDrawer}>
                  <X />
                </button>
              </div>

              <nav className="px-3 space-y-1">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} className="flex items-center gap-2 p-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background flex justify-around">
        {BOTTOM_NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="flex flex-col items-center p-2 text-xs">
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
