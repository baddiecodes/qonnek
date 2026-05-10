import { motion } from "framer-motion";
import type { AgentStatus } from "@/hooks/useAgentSimulation";

interface Props {
  status: AgentStatus;
  color: "cyan" | "violet" | "emerald";
  size?: "sm" | "md";
}

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: "bg-muted-foreground/40",
  thinking: "bg-warning",
  working: "bg-primary",
  completed: "bg-success",
  payout: "bg-success",
};

const RING_COLORS: Record<string, string> = {
  cyan: "ring-primary/30",
  violet: "ring-accent/30",
  emerald: "ring-success/30",
};

const GLOW_SHADOWS: Record<AgentStatus, string> = {
  idle: "none",
  thinking: "0 0 8px hsl(38 92% 55% / 0.5)",
  working: "0 0 12px hsl(186 100% 50% / 0.5)",
  completed: "0 0 12px hsl(152 70% 45% / 0.5)",
  payout: "0 0 16px hsl(152 70% 45% / 0.7)",
};

export default function AgentStatusPulse({ status, color, size = "md" }: Props) {
  const dotSize = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  const ringSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const isActive = status !== "idle";

  return (
    <div className={`relative flex items-center justify-center ${ringSize}`}>
      {/* Outer ring pulse */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-full ring-2 ${RING_COLORS[color]}`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Core dot */}
      <motion.div
        className={`relative ${dotSize} rounded-full ${STATUS_COLORS[status]}`}
        style={{ boxShadow: GLOW_SHADOWS[status] }}
        animate={
          isActive
            ? { scale: [1, 1.15, 1] }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
