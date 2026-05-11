import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import AgentCard from "@/components/AgentCard";
import SimulationStats from "@/components/SimulationStats";

export default function Agents() {
  const simulation = useAgentSimulation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Agents</h1>
        <p className="text-sm text-muted-foreground mt-1">Autonomous AI workforce — live status and task progress</p>
      </div>

      <SimulationStats simulation={simulation} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulation.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
