import { useAgentWallet } from "@/hooks/useAgentWallet";
import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import { useTreasurySimulation } from "@/hooks/useTreasurySimulation";
import AgentWalletCard from "@/components/AgentWalletCard";
import PayrollTransfer from "@/components/PayrollTransfer";
import AgentCard from "@/components/AgentCard";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import SimulationStats from "@/components/SimulationStats";
import TreasurySummaryWidget from "@/components/TreasurySummaryWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const agentWallet = useAgentWallet();
  const simulation = useAgentSimulation();
  const treasury = useTreasurySimulation();

  return (
    <motion.div
      className="space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          CASH (devnet simulation) — AI agent payroll overview
        </p>
      </motion.div>

      {/* Top stats */}
      <motion.div variants={fadeUp}>
        <SimulationStats simulation={simulation} />
      </motion.div>

      {/* Agent grid */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3">
          AI Workforce
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {simulation.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </motion.div>

      {/* Wallet + Transfer + Treasury + Feed */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3">
          Operations
        </h2>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          <AgentWalletCard wallet={agentWallet} />
          <PayrollTransfer agentWallet={agentWallet} />
          <TreasurySummaryWidget treasury={treasury} />
          <Card className="glass-card-strong card-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveActivityFeed events={simulation.events} maxItems={8} showHeader={false} />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
