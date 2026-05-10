import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/constants";
import QonnekLogo from "./QonnekLogo";
import { MOCK_STATS } from "@/lib/mockData";
import { useWalletSession } from "@/hooks/useWalletSession";
import { Circle } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { connected, truncatedAddress, isDevnet } = useWalletSession();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border/40 bg-sidebar">
      {/* Aurora gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 30% 100%, hsl(265 90% 62% / 0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 0%, hsl(186 100% 50% / 0.06) 0%, transparent 50%)",
        }}
      />

      {/* Logo */}
      <div className="relative flex h-16 items-center px-5 border-b border-border/20">
        <QonnekLogo />
      </div>

      {/* Main nav */}
      <nav className="relative flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-glow"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              <item.icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Treasury mini stat */}
      <div
        className="relative mx-3 mb-3 rounded-xl p-3 border border-border/20"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Treasury</div>
        <div className="text-lg font-bold text-foreground">${MOCK_STATS.treasuryBalance.toLocaleString()}</div>
        <div className="text-[10px] font-medium text-success mt-0.5">{MOCK_STATS.treasuryApy}% APY active</div>
      </div>

      {/* Wallet status strip */}
      <div className="relative border-t border-border/20 px-3 py-3 space-y-1">
        {/* Wallet indicator */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 mb-1">
          <Circle
            className={`h-2 w-2 flex-shrink-0 ${
              connected ? "fill-success text-success" : "fill-muted-foreground text-muted-foreground"
            }`}
          />
          {connected ? (
            <div className="flex-1 min-w-0">
              <span className="block font-mono text-[10px] text-foreground truncate">{truncatedAddress}</span>
              <span className="text-[9px] text-muted-foreground">{isDevnet ? "Devnet" : "Unknown"}</span>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground">No wallet</span>
          )}
        </div>

        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
