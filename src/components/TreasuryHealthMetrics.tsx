import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity } from "lucide-react";
import type { TreasuryHealthMetric } from "@/hooks/useTreasurySimulation";

interface Props {
  metrics: TreasuryHealthMetric[];
  healthScore: number;
}

const STATUS_STYLES: Record<string, { badge: string; bar: string }> = {
  excellent: { badge: "border-success/25 bg-success/8 text-success", bar: "bg-success" },
  good: { badge: "border-primary/25 bg-primary/8 text-primary", bar: "bg-primary" },
  caution: { badge: "border-warning/25 bg-warning/8 text-warning", bar: "bg-warning" },
  warning: { badge: "border-destructive/25 bg-destructive/8 text-destructive", bar: "bg-destructive" },
};

function ScoreRing({ score }: { score: number }) {
  const size = 84;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 85 ? "hsl(152 70% 45%)" :
    score >= 70 ? "hsl(186 100% 50%)" :
    score >= 50 ? "hsl(38 92% 55%)" :
    "hsl(0 72% 55%)";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(228 14% 10%)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${filled} ${circumference - filled}` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
      />
      <text
        x={size / 2} y={size / 2 - 3}
        textAnchor="middle" dominantBaseline="middle"
        className="fill-foreground text-lg font-bold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {score}
      </text>
      <text
        x={size / 2} y={size / 2 + 13}
        textAnchor="middle" dominantBaseline="middle"
        className="fill-muted-foreground text-[8px] uppercase tracking-[0.15em]"
        style={{ opacity: 0.4 }}
      >
        SCORE
      </text>
    </svg>
  );
}

export default function TreasuryHealthMetrics({ metrics, healthScore }: Props) {
  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <ShieldCheck className="h-4 w-4 text-success/70" />
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]">
          Treasury Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-center">
          <ScoreRing score={healthScore} />
        </div>

        <div className="space-y-3">
          {metrics.map((metric, i) => {
            const styles = STATUS_STYLES[metric.status];
            const pct = Math.min(100, (metric.value / metric.maxValue) * 100);

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-muted-foreground/30" />
                    <span className="text-[11px] text-muted-foreground/60">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-foreground/80 tabular-nums">
                      {metric.value}{metric.unit}
                    </span>
                    <Badge variant="outline" className={`text-[7px] px-1.5 py-0 capitalize ${styles.badge}`}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full bg-secondary/40 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${styles.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
