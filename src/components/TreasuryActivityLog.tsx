import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, TrendingUp, RefreshCw, ShieldCheck, Radio, Vault } from "lucide-react";
import type { TreasuryEvent } from "@/hooks/useTreasurySimulation";

const EVENT_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  auto_deposit: { icon: ArrowDownToLine, color: "text-primary", bg: "bg-primary/3 border-primary/10" },
  yield_accrual: { icon: TrendingUp, color: "text-success", bg: "bg-success/3 border-success/10" },
  rebalance: { icon: RefreshCw, color: "text-accent", bg: "bg-accent/3 border-accent/10" },
  reserve_update: { icon: Vault, color: "text-warning", bg: "bg-warning/3 border-warning/10" },
  health_check: { icon: ShieldCheck, color: "text-success", bg: "bg-success/3 border-success/10" },
};

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

interface Props { events: TreasuryEvent[]; maxItems?: number; compact?: boolean; }

export default function TreasuryActivityLog({ events, maxItems = 12, compact = false }: Props) {
  const visible = events.slice(0, maxItems);

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Vault className="h-4 w-4 text-primary" />
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Treasury Activity</CardTitle>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">{events.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`space-y-1 overflow-y-auto pr-1 ${compact ? "max-h-[240px]" : "max-h-[400px]"}`}>
          <AnimatePresence initial={false}>
            {visible.map((event) => {
              const config = EVENT_CONFIG[event.type] || { icon: Radio, color: "text-muted-foreground/40", bg: "hover:bg-secondary/20" };
              const Icon = config.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${config.bg}`}>
                    <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{event.message}</p>
                      <span className="text-[10px] text-muted-foreground/40 font-mono">{timeAgo(event.timestamp)}</span>
                    </div>
                    {event.amount && (
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold tabular-nums ${
                        event.type === "auto_deposit"
                          ? "bg-primary/8 border border-primary/15 text-primary"
                          : "bg-success/8 border border-success/15 text-success"
                      }`}>
                        {event.type === "auto_deposit" ? "\u2192" : "+"}{event.amount.toFixed(4)} SOL
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {visible.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground/40">
              Treasury initializing...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
