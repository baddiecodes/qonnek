import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Bot, ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";

const features = [
  { icon: Bot, label: "Autonomous Agents" },
  { icon: Shield, label: "Smart Treasury" },
  { icon: Zap, label: "Instant Payroll" },
  { icon: TrendingUp, label: "Yield Optimized" },
];

export default function Landing() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate("/dashboard");
  }, [connected, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "var(--gradient-glow-warm)" }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center animate-fade-in-up">
        {/* Logo icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 glow-warm">
            <img
              src="/logo.png"
              alt="QONNEK Logo"
              className="h-10 w-10 object-contain"
            />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">QONNEK</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground leading-relaxed text-[15px]">
            AI-powered autonomous agent payroll on Solana devnet.
            <br className="hidden sm:block" />
            Connect your wallet to enter the command center.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {features.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
              <Icon className="h-3 w-3 text-primary/70" />
              {label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <WalletMultiButton />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            connect to enter <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        {/* Badge */}
        <span className="inline-block rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[10px] font-medium text-success tracking-wide">
          CASH (devnet simulation)
        </span>
      </div>
    </div>
  );
}
