import { useTreasurySimulation } from "@/hooks/useTreasurySimulation";
import TreasuryBalanceHero from "@/components/TreasuryBalanceHero";
import TreasuryAllocationChart from "@/components/TreasuryAllocationChart";
import TreasuryHealthMetrics from "@/components/TreasuryHealthMetrics";
import TreasuryActivityLog from "@/components/TreasuryActivityLog";

export default function Treasury() {
  const treasury = useTreasurySimulation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Treasury</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-managed treasury — idle CASH auto-deposited for yield</p>
      </div>

      <TreasuryBalanceHero treasury={treasury} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TreasuryAllocationChart allocations={treasury.allocations} totalBalance={treasury.totalBalance} />
        <TreasuryHealthMetrics metrics={treasury.healthMetrics} healthScore={treasury.healthScore} />
        <TreasuryActivityLog events={treasury.events} />
      </div>
    </div>
  );
}
