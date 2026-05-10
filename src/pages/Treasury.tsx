import { useTreasurySimulation } from "@/hooks/useTreasurySimulation";
import TreasuryBalanceHero from "@/components/TreasuryBalanceHero";
import TreasuryAllocationChart from "@/components/TreasuryAllocationChart";
import TreasuryHealthMetrics from "@/components/TreasuryHealthMetrics";
import TreasuryActivityLog from "@/components/TreasuryActivityLog";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Treasury() {
  const treasury = useTreasurySimulation();

  return (
    <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Treasury</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-managed treasury — idle CASH auto-deposited for yield
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <TreasuryBalanceHero treasury={treasury} />
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-5 lg:grid-cols-3">
        <TreasuryAllocationChart allocations={treasury.allocations} totalBalance={treasury.totalBalance} />
        <TreasuryHealthMetrics metrics={treasury.healthMetrics} healthScore={treasury.healthScore} />
        <TreasuryActivityLog events={treasury.events} />
      </motion.div>
    </motion.div>
  );
}
