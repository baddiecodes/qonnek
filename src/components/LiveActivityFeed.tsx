import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, CheckCircle2, Coins, Radio } from "lucide-react";
import type { AgentEvent } from "@/hooks/useAgentSimulation";

const EVENT_ICONS: Record<string, React.ElementType> = {
  thinking: Brain,
  task_start: Zap,
  task_complete: CheckCircle2,
  payout: Coins,
  status_change: Radio,
};

const EVENT_COLORS: Record<string, string> = {
  thinking: "text-warning/80",
  task_start: "text-primary/80",
  task_complete: "text-success/80",
  payout: "text-success",
  status_change: "text-muted-foreground/50",
};

const AGENT_COLORS: Record<string, string> = {
  content: "text-primary",
  research: "text-accent",
  distribution: "text-success",
};

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

interface Props {
  events: AgentEvent[];
  maxItems?: number;
  showHeader?: boolean;
}

export default function LiveActivityFeed({ events, maxItems = 15, showHeader = true }: Props) {
  const visible = events.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-1.5">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-success"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.12em]">
              Live Feed
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground/30 ml-auto font-mono tabular-nums">
            {events.length}
          </span>
        </div>
      )}

      <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {visible.map((event) => {
            const Icon = EVENT_ICONS[event.type] || Radio;
            const iconColor = EVENT_COLORS[event.type] || "text-muted-foreground/40";
            const agentColor = AGENT_COLORS[event.agentId] || "text-foreground";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, height: 0, x: -12 }}
                animate={{ opacity: 1, height: "auto", x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div
                  className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200 ${
                    event.type === "payout"
                      ? "bg-success/5 border border-success/8"
                      : "hover:bg-secondary/20"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-semibold ${agentColor}`}>
                        {event.agentName}
                      </span>
                      <span className="text-[9px] text-muted-foreground/30 font-mono">
                        {timeAgo(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed truncate">
                      {event.message}
                    </p>
                  </div>
                  {event.payoutSol && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="shrink-0 rounded-full bg-success/8 border border-success/15 px-2 py-0.5 text-[9px] font-mono font-semibold text-success tabular-nums"
                    >
                      +{event.payoutSol} SOL
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="text-center py-10">
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-xs text-muted-foreground/40"
            >
              Agents initializing...
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
