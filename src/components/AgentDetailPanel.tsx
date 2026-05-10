import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Agent } from "@/lib/mockData";

interface AgentDetailPanelProps {
  agent: Agent | null;
  onClose: () => void;
}

const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  const pendingTotal = agent.pendingPayouts.reduce((s, p) => s + p.amount, 0);

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-border/40 bg-card overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/30 bg-card/95 backdrop-blur-md px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-xl border border-border/50">
                  {agent.avatar}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{agent.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{agent.type} Agent</span>
                    <StatusBadge status={agent.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>

              {/* Wallet address */}
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 border border-border/30 px-3 py-2.5">
                <Wallet className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="font-mono text-xs text-foreground flex-1">{agent.walletAddress}</span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary/50 border border-border/30 p-3 text-center">
                  <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">${agent.balance.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">Balance</div>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border/30 p-3 text-center">
                  <CheckCircle className="h-4 w-4 text-success mx-auto mb-1" />
                  <div className="text-lg font-bold text-foreground">{agent.tasksCompleted}</div>
                  <div className="text-[10px] text-muted-foreground">Completed</div>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border/30 p-3 text-center">
                  <ArrowUpRight className="h-4 w-4 text-success mx-auto mb-1" />
                  <div className="text-lg font-bold text-success">+${agent.earned24h}</div>
                  <div className="text-[10px] text-muted-foreground">24h Earned</div>
                </div>
              </div>

              {/* Pending Payouts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-warning" />
                    <h3 className="text-xs font-semibold text-foreground">Pending Payouts</h3>
                  </div>
                  {pendingTotal > 0 && (
                    <span className="text-[11px] font-bold text-warning">${pendingTotal} total</span>
                  )}
                </div>

                {agent.pendingPayouts.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/40 py-4 text-center text-[11px] text-muted-foreground">
                    No pending payouts
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agent.pendingPayouts.map((pp) => (
                      <div
                        key={pp.id}
                        className="flex items-center justify-between rounded-lg bg-warning/5 border border-warning/10 px-3 py-2.5"
                      >
                        <div>
                          <div className="text-[11px] font-medium text-foreground">{pp.taskTitle}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">ETA: {pp.estimatedAt}</div>
                        </div>
                        <span className="text-xs font-bold text-warning">${pp.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <h3 className="text-xs font-semibold text-foreground">
                    Completed Tasks ({agent.completedTasks.length})
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {agent.completedTasks.map((ct) => (
                    <div
                      key={ct.id}
                      className="flex items-center justify-between rounded-lg bg-secondary/40 border border-border/20 px-3 py-2.5"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="text-[11px] font-medium text-foreground truncate">{ct.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{ct.completedAt}</div>
                      </div>
                      <span className="text-xs font-semibold text-success whitespace-nowrap">+${ct.payout}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last active */}
              <div className="text-center text-[10px] text-muted-foreground pt-2 border-t border-border/20">
                Last active: {agent.lastActive}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentDetailPanel;
