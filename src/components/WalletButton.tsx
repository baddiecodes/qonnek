import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletSession } from "@/hooks/useWalletSession";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  Circle,
  ChevronDown,
} from "lucide-react";

interface WalletButtonProps {
  /** "hero" renders a larger gradient CTA; "nav" renders the compact TopBar version */
  variant?: "hero" | "nav";
}

const WalletButton: React.FC<WalletButtonProps> = ({ variant = "nav" }) => {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    truncatedAddress,
    address,
    disconnect,
    isDevnet,
  } = useWalletSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenExplorer = () => {
    if (!address) return;
    window.open(
      `https://explorer.solana.com/address/${address}?cluster=devnet`,
      "_blank",
    );
    setMenuOpen(false);
  };

  const handleDisconnect = async () => {
    setMenuOpen(false);
    await disconnect();
  };

  // ---- Not connected: show connect button ----
  if (!connected) {
    if (variant === "hero") {
      return (
        <button
          onClick={() => setVisible(true)}
          disabled={connecting}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all glow-cyan hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Phantom"}
        </button>
      );
    }

    return (
      <button
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2 text-[13px] font-medium text-foreground transition-all hover:border-primary/30 hover:glow-cyan disabled:opacity-50"
      >
        <Wallet className="h-3.5 w-3.5 text-primary" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  // ---- Connected: show address + dropdown ----
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/80 px-3 py-2 text-[13px] font-medium text-foreground transition-all hover:border-primary/30 hover:bg-secondary"
      >
        {/* Status dot */}
        <Circle className="h-2 w-2 fill-success text-success" />
        <span className="font-mono text-xs">{truncatedAddress}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 rounded-xl border border-border/60 bg-card p-1.5 shadow-lg"
          >
            {/* Network badge */}
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <Circle
                className={`h-2 w-2 ${isDevnet ? "fill-success text-success" : "fill-destructive text-destructive"}`}
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                {isDevnet ? "Solana Devnet" : "Unknown Network"}
              </span>
            </div>

            {/* Full address */}
            <div className="mx-1.5 mb-1.5 rounded-lg bg-secondary/60 px-3 py-2">
              <div className="font-mono text-[10px] text-muted-foreground break-all leading-relaxed">
                {address}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {copied ? "Copied" : "Copy Address"}
            </button>

            <button
              onClick={handleOpenExplorer}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              View on Explorer
            </button>

            <div className="my-1 border-t border-border/30" />

            <button
              onClick={handleDisconnect}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletButton;
