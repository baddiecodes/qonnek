import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Bot, Vault, ArrowLeftRight, Activity, Menu, X,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { playClick, playNav } from "@/lib/sounds";

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
  const navigate = useNavigate();
  const { connected } = useWallet();

  // Redirect to landing when wallet disconnects
  useEffect(() => {
    if (!connected) {
      navigate("/", { replace: true });
    }
  }, [connected, navigate]);

  // Close drawer + play nav sound on route change
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      playNav();
      prevPath.current = location.pathname;
    }
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const openDrawer = useCallback(() => { playClick(); setDrawerOpen(true); }, []);
  const closeDrawer = useCallback(() => { playClick(); setDrawerOpen(false); }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-[220px] flex-col border-r border-sidebar-border shrink-0"
        style={{ background: "var(--gradient-sidebar)" }}
      >
        <div className="px-5 pt-5 pb-5">
          <span className="text-lg font-extrabold gradient-text tracking-tight select-none">QONNEK</span>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5 font-medium">AI Agent Payroll</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3" role="navigation" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border/60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-[11px] font-mono text-success/80 uppercase tracking-wide">devnet</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex items-center justify-between border-b border-border/50 px-4 sm:px-6 h-14 shrink-0 bg-background">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={openDrawer}
              className="p-2 -ml-2 rounded-lg hover:bg-secondary/50 transition-colors focus-ring"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <span className="text-base font-bold gradient-text select-none">QONNEK</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-[11px] text-muted-foreground font-medium">Solana Devnet</span>
          </div>

          <div className="ml-auto">
            <WalletMultiButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-5 sm:py-6 pb-24 md:pb-6 max-w-[1360px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile slide-over drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={closeDrawer}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r border-sidebar-border md:hidden"
              style={{ background: "var(--gradient-sidebar)" }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <span className="text-lg font-extrabold gradient-text tracking-tight select-none">QONNEK</span>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5 font-medium">AI Agent Payroll</p>
                </div>
                <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors focus-ring" aria-label="Close navigation">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 space-y-0.5 px-3 pt-2" role="navigation" aria-label="Mobile navigation">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />}
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="px-4 py-4 border-t border-sidebar-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-[11px] font-mono text-success/80 uppercase tracking-wide">devnet</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav — min 44px touch targets */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/50 bg-background" role="navigation" aria-label="Bottom navigation">
        <div className="flex items-stretch justify-around safe-area-bottom">
          {BOTTOM_NAV.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-[56px] px-2"
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary" />
                )}
                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground/40"}`}>
                  {label}
                </span>
              </NavLink>
            );
          })}
          <button
            onClick={openDrawer}
            className="flex flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-[56px] px-2"
          >
            <Menu className="h-5 w-5 text-muted-foreground/50" />
            <span className="text-[10px] font-medium text-muted-foreground/40">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
