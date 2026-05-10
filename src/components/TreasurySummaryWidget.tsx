import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TreasuryState } from "@/hooks/useTreasurySimulation";
import { useEffect, useState } from "react";

interface Props {
  treasury: TreasuryState;
}

function AnimatedCounter({ value, decimals = 4 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.000001) return value;
        return prev + diff * 0.12;
      });
    }, 40);
    return () => clearInterval(id);
  }, [value]);
  return <span className="font-mono tabular-nums">{display.toFixed(decimals)}</span>;
}

export default function TreasurySummaryWidget({ treasury }: Props) {
  const { totalBalance, currentApy, totalYieldEarned, healthScore } = treasury;

  return (
    <Card className="glass-card-strong card-lift relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{ background: "var(--gradient-glow-cyan)" }} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary/70" />
          Treasury
        </CardTitle>
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <Badge variant="outline" className="border-primary/25 bg-primary/8 text-primary text-[8px] gap-1 badge-glow">
            <TrendingUp className="h-2.5 w-2.5" />
            {currentApy}% APY
          </Badge>
        </motion.div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              <AnimatedCounter value={totalBalance} />
            </span>
            <span className="text-sm text-muted-foreground/40 font-medium">SOL</span>
          </div>
          <p className="mt-0.5 text-[9px] text-muted-foreground/30">
            CASH (devnet simulation)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/25 border border-border/20 px-3 py-2">
            <span className="text-[9px] text-muted-foreground/40 font-medium">Yield</span>
            <p className="text-[11px] font-bold text-success mt-0.5 font-mono tabular-nums">
              +<AnimatedCounter value={totalYieldEarned} decimals={6} />
            </p>
          </div>
          <div className="rounded-lg bg-secondary/25 border border-border/20 px-3 py-2">
            <span className="text-[9px] text-muted-foreground/40 font-medium">Health</span>
            <p className="text-[11px] font-bold text-foreground/80 mt-0.5 font-mono tabular-nums">
              {healthScore}/100
            </p>
          </div>
        </div>

        <Link
          to="/treasury"
          className="group flex items-center gap-1.5 text-[11px] text-primary/70 hover:text-primary transition-colors"
        >
          View full treasury
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
