import { useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

const SESSION_KEY = "qonnek_wallet_session";

interface WalletSession {
  publicKey: string;
  connectedAt: number;
}

/**
 * useWalletSession
 *
 * Persists wallet connection state in sessionStorage so that
 * a page refresh within the same tab re-connects automatically.
 *
 * - Writes session on connect
 * - Clears session on disconnect
 * - Exposes `isDevnet` flag derived from the active RPC endpoint
 * - Provides `truncatedAddress` for display
 */
export function useWalletSession() {
  const { publicKey, connected, connecting, disconnect, wallet, select, wallets } = useWallet();
  const { connection } = useConnection();

  // ---- Persist on connect ----
  useEffect(() => {
    if (connected && publicKey) {
      const session: WalletSession = {
        publicKey: publicKey.toBase58(),
        connectedAt: Date.now(),
      };
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {
        // sessionStorage not available (SSR / private mode)
      }
    }
  }, [connected, publicKey]);

  // ---- Auto-select Phantom on mount if session exists ----
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;

      // If already connected, nothing to do
      if (connected) return;

      // Try to select Phantom adapter so autoConnect picks it up
      const phantom = wallets.find(
        (w) => w.adapter.name.toLowerCase() === "phantom",
      );
      if (phantom && !wallet) {
        select(phantom.adapter.name);
      }
    } catch {
      // ignore
    }
  }, [connected, wallet, wallets, select]);

  // ---- Clear session on disconnect ----
  const handleDisconnect = useCallback(async () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    await disconnect();
  }, [disconnect]);

  // ---- Devnet check ----
  const rpcEndpoint = connection.rpcEndpoint;
  const isDevnet =
    rpcEndpoint.includes("devnet") ||
    rpcEndpoint.includes("localhost") ||
    rpcEndpoint.includes("127.0.0.1");

  // ---- Truncated address ----
  const address = publicKey?.toBase58() ?? null;
  const truncatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  // ---- Stored session (for initial render before autoConnect fires) ----
  let storedSession: WalletSession | null = null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) storedSession = JSON.parse(raw);
  } catch {
    // ignore
  }

  return {
    connected,
    connecting,
    publicKey,
    address,
    truncatedAddress,
    disconnect: handleDisconnect,
    isDevnet,
    rpcEndpoint,
    storedSession,
  };
}
