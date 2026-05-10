import { RefreshCw, Wallet, Copy, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "framer-motion";
import type { AgentWalletState } from "@/hooks/useAgentWallet";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

interface Props {
  wallet: AgentWalletState;
  label?: string;
}

export default function AgentWalletCard({ wallet, label = "Agent Wallet" }: Props) {
  const { address, balanceSol, loading, error, refreshBalance } = wallet;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]">
          {label}
        </CardTitle>
        <Badge variant="outline" className="border-success/30 bg-success/8 text-success text-[9px] badge-glow">
          DEVNET
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance */}
        <div>
          <div className="flex items-baseline gap-2">
            {loading && balanceSol === null ? (
              <div className="h-8 w-28 rounded-md bg-muted/50 animate-[skeleton-pulse_1.8s_ease-in-out_infinite]" />
            ) : (
              <motion.span
                key={balanceSol?.toFixed(4)}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums"
              >
                {balanceSol !== null ? balanceSol.toFixed(4) : "—"}
              </motion.span>
            )}
            <span className="text-sm text-muted-foreground/60 font-medium">SOL</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground/40">CASH (devnet simulation)</p>
        </div>

        {/* Address bar */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/40 border border-border/40 px-3 py-2 group">
          <Wallet className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          <span className="font-mono text-xs text-foreground/80 truncate">{truncate(address)}</span>
          <button
            onClick={handleCopy}
            className="ml-auto p-1 rounded-md hover:bg-muted/50 transition-colors focus-ring"
            title="Copy address"
          >
            {copied
              ? <Check className="h-3 w-3 text-success" />
              : <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            }
          </button>
          <a
            href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-muted/50 transition-colors focus-ring"
            title="View on Explorer"
          >
            <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </a>
        </div>

        {error && (
          <p className="text-[11px] text-destructive/80 bg-destructive/5 rounded-md px-2.5 py-1.5 border border-destructive/10">
            Balance unavailable: {error}
          </p>
        )}

        <button
          onClick={refreshBalance}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-40 focus-ring rounded-md py-1"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Fetching..." : "Refresh balance"}
        </button>
      </CardContent>
    </Card>
  );
}
