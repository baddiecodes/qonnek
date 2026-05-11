import { TrendingUp, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TreasuryState } from "@/hooks/useTreasurySimulation";
import { useEffect, useRef, useState } from "react";

interface Props {
  treasury: TreasuryState;
}

/** Smoothly interpolates toward a target value using RAF — no setInterval thrashing */
function AnimatedBalance({ value, decimals = 4 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);
  const targetRef = useRef(value);

  targetRef.current = value;

  useEffect(() => {
    let current = display;
    const step = () => {
      const diff = targetRef.current - current;
      if (Math.abs(diff) < 0.000001) {
        current = targetRef.current;
        setDisplay(current);
        return;
      }
      current += diff * 0.08;
      setDisplay(current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "var(--gradient-glow-warm)" }} />

      <CardContent className="relative z-10 pt-6 pb-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Treasury Balance
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-success/30 bg-success/8 text-success text-[10px]">
              DEVNET
            </Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-[10px] gap-1">
              <TrendingUp className="h-2.5 w-2.5" />
              {currentApy}% APY
            </Badge>
          </div>
        </div>

        {/* Main balance */}
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              <AnimatedBalance value={totalBalance} />
            </span>
            <span className="text-lg text-muted-foreground font-medium">SOL</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/50">
            CASH (devnet simulation) — managed by AI treasury
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Yield Earned</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-success font-mono tabular-nums">
                +<AnimatedBalance value={totalYieldEarned} decimals={6} />
              </span>
              <span className="text-[10px] text-muted-foreground/50">SOL</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-warning" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Idle CASH</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-warning font-mono tabular-nums">
                <AnimatedBalance value={idleCash} />
              </span>
              <span className="text-[10px] text-muted-foreground/50">SOL</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Rate/sec</span>
            </div>
            <span className="text-sm font-bold font-mono text-primary tabular-nums">
              +{yieldPerSecond.toFixed(8)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">
            uptime {formatUptime(uptimeSeconds)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[10px] text-success font-medium">Earning {currentApy}% APY</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
