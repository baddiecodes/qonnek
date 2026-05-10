import React from "react";
import { Bell, Search } from "lucide-react";
import WalletButton from "./WalletButton";
import { useWalletSession } from "@/hooks/useWalletSession";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { isDevnet } = useWalletSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-xl px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-secondary/50 text-muted-foreground transition-all hover:text-foreground hover:border-border">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-secondary/50 text-muted-foreground transition-all hover:text-foreground hover:border-border">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            3
          </span>
        </button>

        {/* Devnet badge */}
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
            isDevnet
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isDevnet ? "DEVNET" : "UNKNOWN"}
        </span>

        {/* Wallet */}
        <WalletButton variant="nav" />
      </div>
    </header>
  );
};

export default TopBar;
