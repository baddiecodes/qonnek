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

/**
 * Reads the balance of the currently-connected Phantom wallet.
 * This is the wallet the user funded with devnet SOL.
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
    setError(null);
    try {
      const lamports = await connection.getBalance(new PublicKey(publicKey));
      setBalanceSol(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Balance fetch failed");
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalanceSol(null);
      return;
    }
    refreshBalance();
    const id = setInterval(refreshBalance, 30_000);
    return () => clearInterval(id);
  }, [connected, publicKey, refreshBalance]);

  return { address, balanceSol, loading, error, connected, refreshBalance };
}
