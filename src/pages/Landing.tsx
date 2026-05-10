import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Bot, ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-30" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow-cyan)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow-violet)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 glow-cyan"
        >
          <Bot className="h-8 w-8 text-primary" />
        </motion.div>

        {/* Title + description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">QONNEK</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground leading-relaxed text-[15px]">
            AI-powered autonomous agent payroll on Solana devnet.
            <br className="hidden sm:block" />
            Connect your wallet to enter the command center.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {features.map(({ icon: Icon, label }, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
            >
              <Icon className="h-3 w-3 text-primary/70" />
              {label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <WalletMultiButton />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            connect to enter <ArrowRight className="h-3 w-3" />
          </span>
        </motion.div>

        {/* Bottom badge */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-block rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[10px] font-medium text-success/80 tracking-wide"
        >
          CASH (devnet simulation)
        </motion.span>
      </div>
    </div>
  );
}
