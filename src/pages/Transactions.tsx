import { ArrowLeftRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Transactions() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Transaction history and transfer log
        </p>
      </div>

      <div className="glass-card-strong rounded-xl p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <ArrowLeftRight className="h-10 w-10 text-muted-foreground/15" />
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="h-2.5 w-2.5 text-primary/60" />
            </motion.div>
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground/50">
          Transaction log coming soon
        </p>
        <p className="text-xs text-muted-foreground/25 mt-1.5">
          Detailed history of all payroll transfers and treasury operations
        </p>
      </div>
    </motion.div>
  );
}
