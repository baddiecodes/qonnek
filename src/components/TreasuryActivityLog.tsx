import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, TrendingUp, RefreshCw, ShieldCheck, Radio, Vault } from "lucide-react";
import type { TreasuryEvent } from "@/hooks/useTreasurySimulation";

const EVENT_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  auto_deposit: { icon: ArrowDownToLine, color: "text-primary/80", bg: "bg-primary/3 border-primary/8" },
  yield_accrual: { icon: TrendingUp, color: "text-success/80", bg: "bg-success/3 border-success/8" },
  rebalance: { icon: RefreshCw, color: "text-accent/80", bg: "bg-accent/3 border-accent/8" },
  reserve_update: { icon: Vault, color: "text-warning/80", bg: "bg-warning/3 border-warning/8" },
  health_check: { icon: ShieldCheck, color: "text-success/80", bg: "bg-success/3 border-success/8" },
};

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

interface Props {
  events: TreasuryEvent[];
  maxItems?: number;
  compact?: boolean;
}

export default function TreasuryActivityLog({ events, maxItems = 12, compact = false }: Props) {
  const visible = events.slice(0, maxItems);

  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Vault className="h-4 w-4 text-primary/70" />
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]">
          Treasury Activity
        </CardTitle>
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[9px] text-muted-foreground/30 font-mono tabular-nums">{events.length}</span>
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
                  initial={{ opacity: 0, height: 0, x: -10 }}
                  animate={{ opacity: 1, height: "auto", x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${config.bg}`}>
                    <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                        {event.message}
                      </p>
                      <span className="text-[9px] text-muted-foreground/25 font-mono">
                        {timeAgo(event.timestamp)}
                      </span>
                    </div>
                    {event.amount && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-mono font-semibold tabular-nums ${
                          event.type === "auto_deposit"
                            ? "bg-primary/8 border border-primary/15 text-primary"
                            : "bg-success/8 border border-success/15 text-success"
                        }`}
                      >
                        {event.type === "auto_deposit" ? "\u2192" : "+"}{event.amount.toFixed(4)} SOL
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {visible.length === 0 && (
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-center py-8 text-xs text-muted-foreground/30"
            >
              Treasury initializing...
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
