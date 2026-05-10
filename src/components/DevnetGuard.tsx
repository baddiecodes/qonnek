import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function DevnetGuard({ children }: Props) {
  const { connection } = useConnection();
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const url = connection.rpcEndpoint;
    if (!url.includes("devnet") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
      setOk(false);
    }
  }, [connection]);

  if (!ok) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-strong rounded-xl p-8 text-center max-w-md"
        >
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <ShieldX className="h-6 w-6 text-destructive/70" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-foreground mb-2">Mainnet Blocked</h1>
          <p className="text-sm text-muted-foreground/60 leading-relaxed">
            Qonnek operates on Solana <strong className="text-primary">devnet only</strong>.
            Switch your wallet to devnet and reload.
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
