import React from "react";
import type { AgentStatus } from "@/lib/mockData";

interface StatusBadgeProps {
  status: AgentStatus;
  size?: "sm" | "md";
}

const config: Record<AgentStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  active: {
    label: "Active",
    dotClass: "bg-success",
    textClass: "text-success",
    bgClass: "bg-success/10",
  },
  idle: {
    label: "Idle",
    dotClass: "bg-warning",
    textClass: "text-warning",
    bgClass: "bg-warning/10",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-destructive",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "sm" }) => {
  const c = config[status];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bgClass} ${c.textClass} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dotClass} ${status === "active" ? "animate-pulse-glow" : ""}`} />
      {c.label}
    </span>
  );
};

export default StatusBadge;
