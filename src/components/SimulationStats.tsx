import { motion } from "framer-motion";
import { Bot, CheckCircle2, Coins, Activity } from "lucide-react";
import type { SimulationState } from "@/hooks/useAgentSimulation";

interface Props {
  simulation: SimulationState;
}

const getStats = (sim: SimulationState) => [
  {
    label: "Active Agents",
    value: sim.agents.filter((a) => a.status !== "idle").length + " / " + sim.agents.length,
    icon: Bot,
    color: "text-primary",
    glow: "group-hover:shadow-[0_0_16px_hsl(186_100%_50%/0.12)]",
  },
  {
    label: "Tasks Done",
    value: sim.totalTasks.toString(),
    icon: CheckCircle2,
    color: "text-success",
    glow: "group-hover:shadow-[0_0_16px_hsl(152_70%_45%/0.12)]",
  },
  {
    label: "Total Payouts",
    value: sim.totalPayouts.toFixed(4) + " SOL",
    icon: Coins,
    color: "text-success",
    glow: "group-hover:shadow-[0_0_16px_hsl(152_70%_45%/0.12)]",
  },
  {
    label: "Events",
    value: sim.events.length.toString(),
    icon: Activity,
    color: "text-accent",
    glow: "group-hover:shadow-[0_0_16px_hsl(265_90%_62%/0.12)]",
  },
];

export default function SimulationStats({ simulation }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {getStats(simulation).map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`group glass-card rounded-xl px-4 py-3.5 card-lift cursor-default ${stat.glow}`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <stat.icon className={`h-3.5 w-3.5 ${stat.color} transition-transform duration-200 group-hover:scale-110`} />
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.1em] font-medium">
              {stat.label}
            </span>
          </div>
          <motion.span
            key={stat.value}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-foreground font-mono tabular-nums"
          >
            {stat.value}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
