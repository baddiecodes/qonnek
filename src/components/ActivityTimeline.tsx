import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Wallet, TrendingUp, Rocket } from "lucide-react";
import { MOCK_ACTIVITY } from "@/lib/mockData";
import type { ActivityEvent } from "@/lib/mockData";

const iconMap: Record<ActivityEvent["type"], { icon: typeof CheckCircle; color: string }> = {
  task_complete: { icon: CheckCircle, color: "text-success" },
  payment_sent: { icon: Zap, color: "text-primary" },
  treasury_fund: { icon: Wallet, color: "text-accent" },
  yield_accrued: { icon: TrendingUp, color: "text-warning" },
  agent_deployed: { icon: Rocket, color: "text-primary" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.4 } },
};

const ActivityTimeline: React.FC = () => {
  // Show only the most recent 6 events
  const events = MOCK_ACTIVITY.slice(0, 6);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="glass-card-strong rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Real-time agent events</p>
        </div>
        <button className="text-[11px] font-medium text-primary hover:underline">View All</button>
      </div>

      {/* Timeline */}
      <div className="relative px-5 py-3">
        {/* Vertical line */}
        <div className="absolute left-[33px] top-3 bottom-3 w-px bg-border/30" />

        {events.map((event, i) => {
          const ic = iconMap[event.type];
          const Icon = ic.icon;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.06, duration: 0.3 }}
              className="relative flex items-start gap-3 py-2.5"
            >
              {/* Dot */}
              <div className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-secondary border border-border/40 ${ic.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-medium text-foreground truncate pr-2">{event.title}</h4>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{event.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
