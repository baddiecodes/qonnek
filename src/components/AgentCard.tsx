import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, CheckCircle2, Zap, Brain, Clock } from "lucide-react";
import AgentStatusPulse from "@/components/AgentStatusPulse";
import type { AgentState, AgentStatus } from "@/hooks/useAgentSimulation";

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "Idle",
  thinking: "Thinking",
  working: "Executing",
  completed: "Done",
  payout: "Payout",
};

const STATUS_BADGE_CLASSES: Record<AgentStatus, string> = {
  idle: "border-muted-foreground/20 bg-muted/40 text-muted-foreground",
  thinking: "border-warning/30 bg-warning/10 text-warning badge-glow",
  working: "border-primary/30 bg-primary/10 text-primary badge-glow",
  completed: "border-success/30 bg-success/10 text-success badge-glow",
  payout: "border-success/30 bg-success/10 text-success badge-glow",
};

const AVATAR_GLOW: Record<AgentStatus, string> = {
  idle: "",
  thinking: "shadow-[0_0_12px_hsl(38_92%_55%/0.25)]",
  working: "shadow-[0_0_12px_hsl(186_100%_50%/0.25)]",
  completed: "shadow-[0_0_12px_hsl(152_70%_45%/0.25)]",
  payout: "shadow-[0_0_16px_hsl(152_70%_45%/0.35)]",
};

const AGENT_ICONS: Record<string, string> = {
  content: "🖊",
  research: "🔬",
  distribution: "📡",
};

interface Props {
  agent: AgentState;
  compact?: boolean;
}

export default function AgentCard({ agent, compact = false }: Props) {
  const { id, name, status, currentTask, progress, completedTasks, totalPayout, recentAction } = agent;
  const isPayout = status === "payout";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        className={`glass-card-strong card-lift transition-all duration-500 ${
          isPayout ? "glow-cyan" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          {/* Agent avatar */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 text-lg transition-shadow duration-500 ${AVATAR_GLOW[status]}`}>
            {AGENT_ICONS[id] || "🤖"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate">{name}</span>
              <AgentStatusPulse status={status} color={agent.color} size="sm" />
            </div>
            <Badge variant="outline" className={`mt-0.5 text-[9px] px-1.5 py-0 ${STATUS_BADGE_CLASSES[status]}`}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <CheckCircle2 className="h-3 w-3" /> {completedTasks}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-success/80 tabular-nums">
              <Coins className="h-3 w-3" /> {totalPayout.toFixed(4)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Current task / action */}
          <AnimatePresence mode="wait">
            <motion.div
              key={recentAction}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2 min-h-[20px]"
            >
              {status === "thinking" && <Brain className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5 animate-pulse" />}
              {status === "working" && <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />}
              {status === "idle" && <Clock className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />}
              {status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />}
              {status === "payout" && <Coins className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />}
              <span className={`text-xs leading-relaxed ${status === "idle" ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                {recentAction}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          {(status === "working" || status === "completed") && currentTask && (
            <div className="space-y-1.5">
              {!compact && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/50 truncate max-w-[70%]">
                    {currentTask.label}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">{progress}%</span>
                </div>
              )}
              <div className="h-1 w-full rounded-full bg-secondary/60 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      progress === 100
                        ? "hsl(152 70% 45%)"
                        : "linear-gradient(90deg, hsl(186 100% 50%), hsl(265 90% 62%))",
                    boxShadow: progress < 100 ? "0 0 8px hsl(186 100% 50% / 0.3)" : "0 0 8px hsl(152 70% 45% / 0.3)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Payout flash */}
          <AnimatePresence>
            {isPayout && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2"
              >
                <motion.div
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 0.4, repeat: 2 }}
                >
                  <Coins className="h-4 w-4 text-success" />
                </motion.div>
                <span className="text-xs font-semibold text-success">
                  CASH (devnet simulation)
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
