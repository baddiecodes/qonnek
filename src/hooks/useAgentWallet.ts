import { useState, useEffect, useCallback, useRef } from "react";
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

/** Delay helper */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAgentWallet(): AgentWalletState {
  const { connection } = useConnection();
  const [keypair] = useState<Keypair>(() => getOrCreateKeypair());
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);

  const address = keypair.publicKey.toBase58();
  const balanceSol = balanceLamports !== null ? balanceLamports / LAMPORTS_PER_SOL : null;

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    // Retry up to 3 times with exponential backoff on 429
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const lamports = await connection.getBalance(new PublicKey(keypair.publicKey));
        setBalanceLamports(lamports);
        setError(null);
        retryCount.current = 0;
        setLoading(false);
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const is429 = msg.includes("429") || msg.includes("Too many requests");
        if (is429 && attempt < 2) {
          // Exponential backoff: 2s, 4s
          await wait((attempt + 1) * 2000);
          continue;
        }
        // On 429, keep last known balance and just set a soft error
        if (is429 && balanceLamports !== null) {
          setError(null); // Don't show error if we have a cached value
        } else {
          setError(msg);
        }
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  }, [connection, keypair.publicKey, balanceLamports]);

  useEffect(() => {
    // Stagger initial fetch by 2s to avoid competing with useConnectedWallet
    const initTimer = setTimeout(() => {
      refreshBalance();
    }, 2000);

    // Poll every 60s (was 30s) to reduce RPC pressure
    const id = setInterval(refreshBalance, 60_000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(id);
    };
  }, [refreshBalance]);

  return { keypair, address, balanceSol, balanceLamports, loading, error, refreshBalance };
}
