import { useAgentSimulation } from "@/hooks/useAgentSimulation";
import LiveActivityFeed from "@/components/LiveActivityFeed";
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

export default function ActivityFeed() {
  const simulation = useAgentSimulation();

  return (
    <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Activity Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time event stream from all agents — CASH (devnet simulation)
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SimulationStats simulation={simulation} />
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card-strong rounded-xl p-5">
        <LiveActivityFeed events={simulation.events} maxItems={50} />
      </motion.div>
    </motion.div>
  );
}
