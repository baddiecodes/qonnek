import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import AgentCard from "@/components/AgentCard";
import SimulationStats from "@/components/SimulationStats";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Agents() {
  const simulation = useAgentSimulation();

  return (
    <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Agents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Autonomous AI workforce — live status and task progress
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SimulationStats simulation={simulation} />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {simulation.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </motion.div>
    </motion.div>
  );
}
