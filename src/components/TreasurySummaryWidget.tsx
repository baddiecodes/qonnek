import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TreasuryState } from "@/hooks/useTreasurySimulation";
import { useEffect, useRef, useState } from "react";

interface Props {
  treasury: TreasuryState;
}

function AnimatedCounter({ value, decimals = 4 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);
  const targetRef = useRef(value);
  targetRef.current = value;

  useEffect(() => {
    let current = display;
    const step = () => {
      const diff = targetRef.current - current;
      if (Math.abs(diff) < 0.000001) { current = targetRef.current; setDisplay(current); return; }
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

export default function TreasurySummaryWidget({ treasury }: Props) {
  const { totalBalance, currentApy, totalYieldEarned, healthScore } = treasury;

  return (
    <Card className="glass-card-strong card-lift relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ background: "var(--gradient-glow-warm)" }} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary" />
          Treasury
        </CardTitle>
        <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-[9px] gap-1">
          <TrendingUp className="h-2.5 w-2.5" />
          {currentApy}% APY
        </Badge>
      </CardHeader>
      <CardContent className="relative z-10 space-y-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              <AnimatedCounter value={totalBalance} />
            </span>
            <span className="text-sm text-muted-foreground font-medium">SOL</span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground/50">CASH (devnet simulation)</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/30 border border-border/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground font-medium">Yield</span>
            <p className="text-[11px] font-bold text-success mt-0.5 font-mono tabular-nums">
              +<AnimatedCounter value={totalYieldEarned} decimals={6} />
            </p>
          </div>
          <div className="rounded-lg bg-secondary/30 border border-border/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground font-medium">Health</span>
            <p className="text-[11px] font-bold text-foreground mt-0.5 font-mono tabular-nums">
              {healthScore}/100
            </p>
          </div>
        </div>

        <Link
          to="/treasury"
          className="group flex items-center gap-1.5 text-[11px] text-primary hover:underline transition-colors"
        >
          View full treasury
          <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
