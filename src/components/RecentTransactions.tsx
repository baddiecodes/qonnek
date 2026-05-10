import React from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";
import type { Transaction } from "@/lib/mockData";

const typeConfig: Record<Transaction["type"], { icon: typeof ArrowDownLeft; color: string; label: string }> = {
  payment: { icon: ArrowDownLeft, color: "text-success", label: "Payment" },
  fund: { icon: ArrowUpRight, color: "text-accent", label: "Fund" },
  yield: { icon: Sparkles, color: "text-primary", label: "Yield" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.4 } },
};

const RecentTransactions: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="glass-card-strong rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">On-chain via Helius</p>
        </div>
        <button className="text-[11px] font-medium text-primary hover:underline">View All</button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-5 py-2.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border/20">
        <span className="col-span-2">Type</span>
        <span className="col-span-3">Agent</span>
        <span className="col-span-2">Amount</span>
        <span className="col-span-2">Time</span>
        <span className="col-span-3">Signature</span>
      </div>

      {/* Rows */}
      {MOCK_TRANSACTIONS.map((tx, i) => {
        const tc = typeConfig[tx.type];
        const Icon = tc.icon;
        return (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
            className="grid grid-cols-12 gap-2 items-center px-5 py-3 border-b border-border/10 transition-colors hover:bg-secondary/30"
          >
            {/* Type */}
            <div className="col-span-2 flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${tc.color}`} />
              <span className="text-[11px] font-medium text-foreground">{tc.label}</span>
            </div>

            {/* Agent */}
            <span className="col-span-3 text-[11px] text-muted-foreground truncate">{tx.agentName}</span>

            {/* Amount */}
            <span className={`col-span-2 text-[11px] font-semibold ${tx.type === "fund" ? "text-accent" : "text-success"}`}>
              {tx.type === "fund" ? "-" : "+"}${tx.amount.toFixed(2)}
            </span>

            {/* Time */}
            <span className="col-span-2 text-[11px] text-muted-foreground">{tx.timestamp}</span>

            {/* Signature */}
            <div className="col-span-3 flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-muted-foreground">{tx.signature}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors flex-shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default RecentTransactions;
