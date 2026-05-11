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

export default function Dashboard() {
  const agentWallet = useAgentWallet();
  const simulation = useAgentSimulation();
  const treasury = useTreasurySimulation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">CASH (devnet simulation) — AI agent payroll overview</p>
      </div>

      <SimulationStats simulation={simulation} />

      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Workforce</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {simulation.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Operations</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AgentWalletCard wallet={agentWallet} />
          <PayrollTransfer agentWallet={agentWallet} />
          <TreasurySummaryWidget treasury={treasury} />
          <Card className="glass-card-strong card-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <LiveActivityFeed events={simulation.events} maxItems={8} showHeader={false} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
