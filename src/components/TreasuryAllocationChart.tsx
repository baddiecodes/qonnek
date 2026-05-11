import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import type { TreasuryAllocation } from "@/hooks/useTreasurySimulation";

interface Props { allocations: TreasuryAllocation[]; totalBalance: number; }

function DonutChart({ allocations }: { allocations: TreasuryAllocation[] }) {
  const size = 136;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Treasury allocation chart">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="hsl(220 12% 10%)" strokeWidth={strokeWidth} />
      {allocations.map((alloc) => {
        const segmentLength = (alloc.percentage / 100) * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += segmentLength;

        return (
          <circle
            key={alloc.label}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={alloc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

export default function TreasuryAllocationChart({ allocations, totalBalance }: Props) {
  return (
    <Card className="glass-card-strong card-lift">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <PieChart className="h-4 w-4 text-primary" />
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-center">
          <div className="relative">
            <DonutChart allocations={allocations} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground font-mono tabular-nums">{totalBalance.toFixed(2)}</span>
              <span className="text-[10px] text-muted-foreground font-medium">SOL</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {allocations.map((alloc) => (
            <div key={alloc.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: alloc.color }} />
                  <span className="text-xs font-medium text-foreground/80">{alloc.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-foreground tabular-nums">{alloc.amount.toFixed(4)}</span>
                  <span className="text-[10px] text-muted-foreground">({alloc.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full" style={{ backgroundColor: alloc.color, width: `${alloc.percentage}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed">{alloc.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
