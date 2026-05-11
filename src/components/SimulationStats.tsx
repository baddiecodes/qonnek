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
  },
  {
    label: "Tasks Done",
    value: sim.totalTasks.toString(),
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    label: "Total Payouts",
    value: sim.totalPayouts.toFixed(4) + " SOL",
    icon: Coins,
    color: "text-success",
  },
  {
    label: "Events",
    value: sim.events.length.toString(),
    icon: Activity,
    color: "text-accent",
  },
];

export default function SimulationStats({ simulation }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {getStats(simulation).map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl px-4 py-3.5 card-lift">
          <div className="flex items-center gap-2 mb-1.5">
            <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {stat.label}
            </span>
          </div>
          <span className="text-lg font-bold text-foreground font-mono tabular-nums">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
