import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export interface ConnectedWalletState {
  address: string | null;
  balanceSol: number | null;
  loading: boolean;
  error: string | null;
  connected: boolean;
  refreshBalance: () => Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Reads the balance of the currently-connected Phantom wallet.
 * Includes retry with backoff for 429 rate-limit errors.
 */
export function useConnectedWallet(): ConnectedWalletState {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [balanceSol, setBalanceSol] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = publicKey?.toBase58() ?? null;

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const lamports = await connection.getBalance(new PublicKey(publicKey));
        setBalanceSol(lamports / LAMPORTS_PER_SOL);
        setError(null);
        setLoading(false);
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const is429 = msg.includes("429") || msg.includes("Too many requests");
        if (is429 && attempt < 2) {
          await wait((attempt + 1) * 2000);
          continue;
        }
        // On 429 with cached balance, suppress error display
        if (is429 && balanceSol !== null) {
          setError(null);
        } else {
          setError(msg);
        }
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  }, [connection, publicKey, balanceSol]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalanceSol(null);
      return;
    }
    // Fetch immediately on connect
    refreshBalance();
    // Poll every 60s (reduced from 30s to avoid 429)
    const id = setInterval(refreshBalance, 60_000);
    return () => clearInterval(id);
  }, [connected, publicKey, refreshBalance]);

  return { address, balanceSol, loading, error, connected, refreshBalance };
}
