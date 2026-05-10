import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import type { AgentWalletState } from "@/hooks/useAgentWallet";

const RECIPIENT_STORAGE_KEY = "qonnek_recipient_wallet";

function getOrCreateRecipient(): Keypair {
  try {
    const stored = localStorage.getItem(RECIPIENT_STORAGE_KEY);
    if (stored) {
      return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(stored)));
    }
  } catch {
    localStorage.removeItem(RECIPIENT_STORAGE_KEY);
  }
  const kp = Keypair.generate();
  localStorage.setItem(RECIPIENT_STORAGE_KEY, JSON.stringify(Array.from(kp.secretKey)));
  return kp;
}

function truncate(s: string) {
  return `${s.slice(0, 6)}...${s.slice(-4)}`;
}

type TxStatus = "idle" | "sending" | "confirming" | "success" | "error";

interface Props {
  agentWallet: AgentWalletState;
}

const TRANSFER_AMOUNT_SOL = 0.01;

export default function PayrollTransfer({ agentWallet }: Props) {
  const { connection } = useConnection();
  const [recipient] = useState<Keypair>(() => getOrCreateRecipient());
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recipientAddr = recipient.publicKey.toBase58();
  const canSend =
    status !== "sending" &&
    status !== "confirming" &&
    agentWallet.balanceSol !== null &&
    agentWallet.balanceSol >= TRANSFER_AMOUNT_SOL;

  const handleTransfer = async () => {
    setStatus("sending");
    setTxSig(null);
    setErrorMsg(null);

    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: agentWallet.keypair.publicKey,
          toPubkey: new PublicKey(recipientAddr),
          lamports: Math.round(TRANSFER_AMOUNT_SOL * LAMPORTS_PER_SOL),
        })
      );

      setStatus("confirming");

      const signature = await sendAndConfirmTransaction(connection, tx, [agentWallet.keypair], {
        commitment: "confirmed",
      });

      setTxSig(signature);
      setStatus("success");
      agentWallet.refreshBalance();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transfer failed";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]">
          Payroll Transfer
        </CardTitle>
        <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-[9px] badge-glow">
          CASH
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* From */}
        <div className="rounded-lg border border-border/30 bg-secondary/20 p-3 space-y-1">
          <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 font-medium">
            From: Agent Wallet
          </span>
          <p className="font-mono text-xs text-foreground/80">{truncate(agentWallet.address)}</p>
          <p className="text-sm font-semibold text-foreground font-mono tabular-nums">
            {agentWallet.balanceSol !== null ? `${agentWallet.balanceSol.toFixed(4)} SOL` : "..."}
          </p>
        </div>

        <div className="flex justify-center py-0.5">
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-primary/60" />
          </motion.div>
        </div>

        {/* To */}
        <div className="rounded-lg border border-border/30 bg-secondary/20 p-3 space-y-1">
          <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 font-medium">
            To: Recipient
          </span>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-foreground/80">{truncate(recipientAddr)}</p>
            <a
              href={`https://explorer.solana.com/address/${recipientAddr}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-0.5 rounded hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground/40" />
            </a>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center py-1">
          <span className="text-2xl font-bold text-foreground font-mono tabular-nums">{TRANSFER_AMOUNT_SOL}</span>
          <span className="ml-1.5 text-sm text-muted-foreground/50 font-medium">SOL</span>
        </div>

        {/* Transfer button */}
        <motion.button
          onClick={handleTransfer}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.01 } : {}}
          whileTap={canSend ? { scale: 0.98 } : {}}
          className={`
            w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold
            transition-all duration-200 focus-ring
            ${canSend
              ? "bg-primary text-primary-foreground glow-cyan cursor-pointer"
              : "bg-muted/60 text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          <AnimatePresence mode="wait">
            {(status === "sending" || status === "confirming") ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {status === "sending" ? "Sending..." : "Confirming..."}
              </motion.span>
            ) : status === "success" ? (
              <motion.span key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Transfer Complete
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Payroll
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Insufficient balance warning */}
        <AnimatePresence>
          {agentWallet.balanceSol !== null && agentWallet.balanceSol < TRANSFER_AMOUNT_SOL && status === "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 rounded-lg border border-warning/15 bg-warning/5 p-3">
                <AlertTriangle className="h-4 w-4 text-warning/80 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-warning/90">Insufficient balance</p>
                  <p className="mt-0.5">
                    Fund the agent wallet with devnet SOL at{" "}
                    <a
                      href="https://faucet.solana.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      faucet.solana.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success result */}
        <AnimatePresence>
          {status === "success" && txSig && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-success/15 bg-success/5 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs font-semibold text-success">Confirmed on devnet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground/60 truncate">{truncate(txSig)}</span>
                <a
                  href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-primary hover:underline shrink-0"
                >
                  Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error result */}
        <AnimatePresence>
          {status === "error" && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-destructive/15 bg-destructive/5 p-3"
            >
              <p className="text-xs text-destructive/80">{errorMsg}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-[11px] text-primary hover:underline"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
