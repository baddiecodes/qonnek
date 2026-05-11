import { RefreshCw, Wallet, Copy, Check, ExternalLink, Download, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import type { AgentWalletState } from "@/hooks/useAgentWallet";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

type AirdropStatus = "idle" | "requesting" | "confirming" | "success" | "error";

const AIRDROP_SOL = 1;

interface Props { wallet: AgentWalletState; label?: string; }

export default function AgentWalletCard({ wallet, label = "Agent Wallet" }: Props) {
  const { connection } = useConnection();
  const { address, balanceSol, loading, error, refreshBalance } = wallet;
  const [copied, setCopied] = useState(false);
  const [airdropStatus, setAirdropStatus] = useState<AirdropStatus>("idle");
  const [airdropError, setAirdropError] = useState<string | null>(null);

  const handleAirdrop = useCallback(async () => {
    setAirdropStatus("requesting");
    setAirdropError(null);
    try {
      const sig = await connection.requestAirdrop(
        new PublicKey(address),
        AIRDROP_SOL * LAMPORTS_PER_SOL
      );
      setAirdropStatus("confirming");
      await connection.confirmTransaction(sig, "confirmed");
      setAirdropStatus("success");
      refreshBalance();
      setTimeout(() => setAirdropStatus("idle"), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Airdrop failed";
      setAirdropError(msg.includes("429") ? "Rate limited — wait a moment and retry" : msg);
      setAirdropStatus("error");
      setTimeout(() => setAirdropStatus("idle"), 5000);
    }
  }, [connection, address, refreshBalance]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
        <Badge variant="outline" className="border-success/30 bg-success/8 text-success text-[10px]">DEVNET</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            {loading && balanceSol === null ? (
              <div className="h-8 w-28 rounded-md bg-muted/50 animate-[skeleton-pulse_1.8s_ease-in-out_infinite]" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
                {balanceSol !== null ? balanceSol.toFixed(4) : "—"}
              </span>
            )}
            <span className="text-sm text-muted-foreground font-medium">SOL</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground/50">CASH (devnet simulation)</p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/40 border border-border/40 px-3 py-2.5 group">
          <Wallet className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          <span className="font-mono text-xs text-foreground/80 truncate">{truncate(address)}</span>
          <button onClick={handleCopy} className="ml-auto p-1.5 rounded-md hover:bg-muted/50 transition-colors focus-ring min-h-[28px] min-w-[28px] flex items-center justify-center" title="Copy address">
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
          </button>
          <a href={`https://explorer.solana.com/address/${address}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted/50 transition-colors focus-ring min-h-[28px] min-w-[28px] flex items-center justify-center" title="View on Explorer">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </a>
        </div>

        {error && (
          <p className="text-[11px] text-destructive bg-destructive/5 rounded-md px-2.5 py-1.5 border border-destructive/10">
            Balance unavailable: {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button onClick={refreshBalance} disabled={loading} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 focus-ring rounded-md py-1.5 min-h-[32px]">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Fetching..." : "Refresh"}
          </button>
          <span className="h-3 w-px bg-border/50" />
          <button
            onClick={handleAirdrop}
            disabled={airdropStatus === "requesting" || airdropStatus === "confirming"}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40 focus-ring rounded-md py-1.5 min-h-[32px]"
          >
            {airdropStatus === "requesting" || airdropStatus === "confirming" ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" />{airdropStatus === "requesting" ? "Requesting..." : "Confirming..."}</>
            ) : airdropStatus === "success" ? (
              <><CheckCircle2 className="h-3.5 w-3.5 text-success" /><span className="text-success">+{AIRDROP_SOL} SOL</span></>
            ) : (
              <><Download className="h-3.5 w-3.5" />Airdrop {AIRDROP_SOL} SOL</>
            )}
          </button>
        </div>

        {airdropStatus === "error" && airdropError && (
          <div className="flex items-start gap-2 rounded-lg border border-warning/15 bg-warning/5 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
            <p className="text-[11px] text-warning">{airdropError}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
