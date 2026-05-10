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
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/treasury", label: "Treasury", icon: Vault },
  { to: "/transactions", label: "Transfers", icon: ArrowLeftRight },
  { to: "/activity", label: "Activity", icon: Activity },
];

// Bottom nav shows first 4 links (most used), 5th is the "More" drawer trigger
const BOTTOM_NAV_LINKS = links.slice(0, 4);

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside
        className="hidden md:flex w-[220px] flex-col border-r border-sidebar-border shrink-0"
        style={{ background: "var(--gradient-sidebar)" }}
      >
        <div className="px-5 pt-5 pb-6">
          <span className="text-lg font-extrabold gradient-text tracking-tight select-none">
            QONNEK
          </span>
          <p className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium tracking-wide">
            AI Agent Payroll
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`h-4 w-4 transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-mono text-success/70 uppercase tracking-[0.15em]">
              devnet
            </span>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-2.5 backdrop-blur-sm bg-background/80 shrink-0">
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary/50 transition-colors focus-ring"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <span className="text-lg font-extrabold gradient-text select-none">
              QONNEK
            </span>
          </div>

          {/* Desktop: devnet indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] text-muted-foreground/50 font-medium">
              Solana Devnet
            </span>
          </div>

          <div className="ml-auto">
            <WalletMultiButton />
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-5 sm:py-6 pb-24 md:pb-6 max-w-[1360px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ========== MOBILE SLIDE-OVER DRAWER ========== */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r border-sidebar-border md:hidden"
              style={{ background: "var(--gradient-sidebar)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <span className="text-lg font-extrabold gradient-text tracking-tight select-none">
                    QONNEK
                  </span>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium tracking-wide">
                    AI Agent Payroll
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors focus-ring"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 space-y-0.5 px-3 pt-2">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/40"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="drawer-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        <Icon
                          className={`h-4.5 w-4.5 transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                          }`}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 py-4 border-t border-sidebar-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-mono text-success/70 uppercase tracking-[0.15em]">
                    devnet
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========== MOBILE BOTTOM NAV ========== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/60 backdrop-blur-xl bg-background/90">
        <div className="flex items-center justify-around px-2 py-1.5 safe-area-bottom">
          {BOTTOM_NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-indicator"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 transition-colors duration-150 ${
                    isActive ? "text-primary" : "text-muted-foreground/50"
                  }`}
                />
                <span
                  className={`text-[9px] font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground/40"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}

          {/* More button — opens drawer for full nav */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-muted-foreground/50" />
            <span className="text-[9px] font-medium text-muted-foreground/40">
              More
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
