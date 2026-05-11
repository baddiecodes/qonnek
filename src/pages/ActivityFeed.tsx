import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import SimulationStats from "@/components/SimulationStats";

export default function ActivityFeed() {
  const simulation = useAgentSimulation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Activity Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time event stream from all agents — CASH (devnet simulation)</p>
      </div>

      <SimulationStats simulation={simulation} />

      <div className="glass-card-strong rounded-xl p-5">
        <LiveActivityFeed events={simulation.events} maxItems={50} />
      </div>
    </div>
  );
}
