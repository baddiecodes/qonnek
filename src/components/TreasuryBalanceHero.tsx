import { motion } from "framer-motion";
import { TrendingUp, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TreasuryState } from "@/hooks/useTreasurySimulation";
import { useEffect, useState } from "react";

interface Props {
  treasury: TreasuryState;
}

function AnimatedBalance({ value, decimals = 4 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const step = () => {
      setDisplay((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.000001) return value;
        return prev + diff * 0.12;
      });
    };
    const id = setInterval(step, 40);
    return () => clearInterval(id);
  }, [value]);

  return <span className="font-mono tabular-nums">{display.toFixed(decimals)}</span>;
}

export default function TreasuryBalanceHero({ treasury }: Props) {
  const { totalBalance, currentApy, totalYieldEarned, yieldPerSecond, idleCash, uptimeSeconds } = treasury;

  const formatUptime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <Card className="glass-card-strong relative overflow-hidden">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ background: "var(--gradient-glow-cyan)" }} />
      <div className="pointer-events-none absolute top-0 right-0 w-1/2 h-full opacity-15" style={{ background: "var(--gradient-glow-violet)" }} />

      <CardContent className="relative z-10 pt-6 pb-6 space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary/80" />
            <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
              Treasury Balance
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-success/25 bg-success/5 text-success/80 text-[9px] badge-glow">
              DEVNET
            </Badge>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Badge variant="outline" className="border-primary/25 bg-primary/8 text-primary text-[9px] gap-1 badge-glow">
                <TrendingUp className="h-2.5 w-2.5" />
                {currentApy}% APY
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Main balance */}
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              <AnimatedBalance value={totalBalance} />
            </span>
            <span className="text-lg text-muted-foreground/40 font-medium">SOL</span>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground/30">
            CASH (devnet simulation) — managed by AI treasury
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-success/70" />
              <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.12em] font-medium">Yield Earned</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-success font-mono tabular-nums">
                +<AnimatedBalance value={totalYieldEarned} decimals={6} />
              </span>
              <span className="text-[9px] text-muted-foreground/30">SOL</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-warning/70" />
              <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.12em] font-medium">Idle CASH</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-warning font-mono tabular-nums">
                <AnimatedBalance value={idleCash} />
              </span>
              <span className="text-[9px] text-muted-foreground/30">SOL</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                <Zap className="h-3 w-3 text-primary/60" />
              </motion.div>
              <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.12em] font-medium">Rate/sec</span>
            </div>
            <span className="text-sm font-bold font-mono text-primary/80 tabular-nums">
              +{yieldPerSecond.toFixed(8)}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground/25 font-mono tabular-nums">
            uptime {formatUptime(uptimeSeconds)}
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-success"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] text-success/70 font-medium">Earning {currentApy}% APY</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
