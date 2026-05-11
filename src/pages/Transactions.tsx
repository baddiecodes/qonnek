import { ArrowLeftRight } from "lucide-react";

export default function Transactions() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">Transaction history and transfer log</p>
      </div>

      <div className="glass-card-strong rounded-xl p-12 text-center">
        <ArrowLeftRight className="h-10 w-10 text-muted-foreground/15 mx-auto mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Transaction log coming soon</p>
        <p className="text-xs text-muted-foreground/50 mt-1.5">Detailed history of all payroll transfers and treasury operations</p>
      </div>
    </div>
  );
}
