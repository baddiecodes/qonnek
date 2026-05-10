import React from "react";
import { motion } from "framer-motion";
import { Bot, DollarSign, TrendingUp, Zap, Clock, type LucideIcon } from "lucide-react";
import { MOCK_STATS } from "@/lib/mockData";

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const cards: StatCard[] = [
  {
    label: "Active Agents",
    value: `${MOCK_STATS.activeAgents}/${MOCK_STATS.totalAgents}`,
    change: "+1 deployed today",
    icon: Bot,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Total CASH Balance",
    value: `$${MOCK_STATS.totalCash.toLocaleString()}`,
    change: `+$${MOCK_STATS.earned24h.toLocaleString()} today`,
    icon: DollarSign,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    label: "Treasury APY",
    value: `${MOCK_STATS.treasuryApy}%`,
    change: "+0.3% this week",
    icon: TrendingUp,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    label: "Pending Payouts",
    value: `$${MOCK_STATS.totalPendingPayouts}`,
    change: `${MOCK_STATS.tasksToday} tasks today`,
    icon: Clock,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const StatsRow: React.FC = () => {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial="hidden"
          animate="visible"
          custom={i}
          variants={fadeUp}
          className="group relative glass-card-strong rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-primary/20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(186 100% 50% / 0.04) 0%, transparent 70%)" }}
          />

          <div className="relative flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </div>
          <div className="relative text-2xl font-bold tracking-tight text-foreground">{card.value}</div>
          <div className="relative mt-1.5 text-[11px] font-medium text-success">{card.change}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsRow;
