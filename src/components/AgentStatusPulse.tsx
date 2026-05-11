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

export default function AgentStatusPulse({ status, size = "md" }: Props) {
  const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  const isActive = status !== "idle";

  return (
    <span className="relative inline-flex items-center justify-center">
      {isActive && (
        <span className={`absolute ${dotSize} rounded-full ${STATUS_COLORS[status]} opacity-40 animate-ping`} />
      )}
      <span className={`relative ${dotSize} rounded-full ${STATUS_COLORS[status]}`} />
    </span>
  );
}
