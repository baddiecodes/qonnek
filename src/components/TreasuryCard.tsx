import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, ArrowUpRight, Wallet } from "lucide-react";
import { MOCK_STATS } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.45 } },
};

// Simple sparkline bars for visual effect
const bars = [35, 42, 38, 55, 48, 62, 58, 70, 65, 72, 68, 78, 75, 82];

const TreasuryCard: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="relative glass-card-strong rounded-xl p-5 overflow-hidden"
    >
      {/* Aurora gradient behind */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, hsl(265 90% 62% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(186 100% 50% / 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Treasury</h3>
              <span className="text-[10px] text-muted-foreground">Altitude Yield Strategy</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
            <TrendingUp className="h-3 w-3" />
            {MOCK_STATS.treasuryApy}% APY
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Treasury Balance</div>
          <div className="text-3xl font-bold text-foreground tracking-tight">
            ${MOCK_STATS.treasuryBalance.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1.5">CASH</span>
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="mb-4 flex items-end gap-1 h-12">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${h}%`,
                background: i >= bars.length - 3
                  ? "hsl(186 100% 50% / 0.6)"
                  : "hsl(var(--muted))",
              }}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-success" />
            <div>
              <div className="text-[10px] text-muted-foreground">Yield (30d)</div>
              <div className="text-sm font-semibold text-foreground">+${MOCK_STATS.yieldEarned30d}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground">Total Deployed</div>
              <div className="text-sm font-semibold text-foreground">${MOCK_STATS.totalCash.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TreasuryCard;
