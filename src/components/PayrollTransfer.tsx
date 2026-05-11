import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,
} from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Send, ExternalLink, CheckCircle2, Loader2, AlertTriangle, ArrowDown } from "lucide-react";
import type { AgentWalletState } from "@/hooks/useAgentWallet";
import type { ConnectedWalletState } from "@/hooks/useConnectedWallet";

function truncate(s: string) { return `${s.slice(0, 6)}...${s.slice(-4)}`; }

type TxStatus = "idle" | "sending" | "confirming" | "success" | "error";

const TRANSFER_AMOUNT_SOL = 0.01;

interface Props {
  /** Connected Phantom wallet — the funding source */
  connectedWallet: ConnectedWalletState;
  /** Local agent wallet — the recipient */
  agentWallet: AgentWalletState;
}

export default function PayrollTransfer({ connectedWallet, agentWallet }: Props) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fromAddr = connectedWallet.address;
  const toAddr = agentWallet.address;

  const hasFunds = connectedWallet.balanceSol !== null && connectedWallet.balanceSol >= TRANSFER_AMOUNT_SOL;
  const canSend = status !== "sending" && status !== "confirming" && publicKey && hasFunds;

  const handleTransfer = async () => {
    if (!publicKey) return;
    setStatus("sending");
    setTxSig(null);
    setErrorMsg(null);
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toAddr),
          lamports: Math.round(TRANSFER_AMOUNT_SOL * LAMPORTS_PER_SOL),
        })
      );

      setStatus("confirming");
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setTxSig(signature);
      setStatus("success");
      // Refresh both wallets
      connectedWallet.refreshBalance();
      agentWallet.refreshBalance();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Transfer failed");
      setStatus("error");
    }
  };

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payroll Transfer</CardTitle>
        <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-[10px]">DEVNET</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* From: Connected Phantom wallet */}
        <div className="rounded-lg border border-border/30 bg-secondary/20 p-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">From: Your Wallet (Phantom)</span>
          <p className="font-mono text-xs text-foreground/80">{fromAddr ? truncate(fromAddr) : "Not connected"}</p>
          <p className="text-sm font-semibold text-foreground font-mono tabular-nums">
            {connectedWallet.balanceSol !== null ? `${connectedWallet.balanceSol.toFixed(4)} SOL` : "..."}
          </p>
        </div>

        <div className="flex justify-center py-0.5">
          <ArrowDown className="h-4 w-4 text-primary/50" />
        </div>

        {/* To: Local agent wallet */}
        <div className="rounded-lg border border-border/30 bg-secondary/20 p-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">To: Agent Wallet</span>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-foreground/80">{truncate(toAddr)}</p>
            <a href={`https://explorer.solana.com/address/${toAddr}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="p-0.5 rounded hover:bg-muted/50 transition-colors">
              <ExternalLink className="h-3 w-3 text-muted-foreground/40" />
            </a>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center py-1">
          <span className="text-2xl font-bold text-foreground font-mono tabular-nums">{TRANSFER_AMOUNT_SOL}</span>
          <span className="ml-1.5 text-sm text-muted-foreground font-medium">SOL</span>
        </div>

        {/* Transfer button */}
        <button
          onClick={handleTransfer}
          disabled={!canSend}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 min-h-[44px] text-sm font-semibold transition-all focus-ring ${
            canSend ? "bg-primary text-primary-foreground glow-warm cursor-pointer active:scale-[0.98]" : "bg-muted/60 text-muted-foreground cursor-not-allowed"
          }`}
        >
          {(status === "sending" || status === "confirming") ? (
            <><Loader2 className="h-4 w-4 animate-spin" />{status === "sending" ? "Sending..." : "Confirming..."}</>
          ) : status === "success" ? (
            <><CheckCircle2 className="h-4 w-4" />Transfer Complete</>
          ) : (
            <><Send className="h-4 w-4" />Fund Agent Wallet</>
          )}
        </button>

        {/* Insufficient balance warning */}
        <AnimatePresence>
          {connectedWallet.balanceSol !== null && connectedWallet.balanceSol < TRANSFER_AMOUNT_SOL && status === "idle" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex items-start gap-2 rounded-lg border border-warning/15 bg-warning/5 p-3">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-warning">Insufficient balance</p>
                  <p className="mt-0.5">Fund your Phantom wallet at <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">faucet.solana.com</a></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not connected warning */}
        <AnimatePresence>
          {!publicKey && status === "idle" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex items-start gap-2 rounded-lg border border-warning/15 bg-warning/5 p-3">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning font-medium">Connect your Phantom wallet to send payroll</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {status === "success" && txSig && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-lg border border-success/15 bg-success/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs font-semibold text-success">Confirmed on devnet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground truncate">{truncate(txSig)}</span>
                <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-primary hover:underline shrink-0">
                  Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {status === "error" && errorMsg && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-lg border border-destructive/15 bg-destructive/5 p-3">
              <p className="text-xs text-destructive">{errorMsg}</p>
              <button onClick={() => setStatus("idle")} className="mt-2 text-[11px] text-primary hover:underline">Try again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
