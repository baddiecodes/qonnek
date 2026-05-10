import { useState, useEffect, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const STORAGE_KEY = "qonnek_agent_wallet";

export interface AgentWalletState {
  keypair: Keypair;
  address: string;
  balanceSol: number | null;
  balanceLamports: number | null;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

/**
 * Load or create a devnet-only agent Keypair persisted in localStorage.
 * Secret key stored as JSON number array -- acceptable for devnet simulation ONLY.
 */
function getOrCreateKeypair(): Keypair {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const arr: number[] = JSON.parse(stored);
      return Keypair.fromSecretKey(Uint8Array.from(arr));
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  const kp = Keypair.generate();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(kp.secretKey)));
  return kp;
}

export function useAgentWallet(): AgentWalletState {
  const { connection } = useConnection();
  const [keypair] = useState<Keypair>(() => getOrCreateKeypair());
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const address = keypair.publicKey.toBase58();
  const balanceSol = balanceLamports !== null ? balanceLamports / LAMPORTS_PER_SOL : null;

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lamports = await connection.getBalance(new PublicKey(keypair.publicKey));
      setBalanceLamports(lamports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Balance fetch failed");
    } finally {
      setLoading(false);
    }
  }, [connection, keypair.publicKey]);

  useEffect(() => {
    refreshBalance();
    const id = setInterval(refreshBalance, 30_000);
    return () => clearInterval(id);
  }, [refreshBalance]);

  return { keypair, address, balanceSol, balanceLamports, loading, error, refreshBalance };
}
