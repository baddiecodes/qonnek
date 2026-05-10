import React from "react";
import { Zap } from "lucide-react";

interface QonnekLogoProps {
  collapsed?: boolean;
  className?: string;
}

const QonnekLogo: React.FC<QonnekLogoProps> = ({ collapsed = false, className = "" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border-glow">
        <Zap className="h-4 w-4 text-primary" />
        <div className="absolute inset-0 rounded-lg animate-pulse-glow bg-primary/5" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">
            Qonnek
          </span>
          <span className="text-[10px] font-medium text-muted-foreground leading-none">
            Agent Payroll
          </span>
        </div>
      )}
    </div>
  );
};

export default QonnekLogo;
