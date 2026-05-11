import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import DevnetGuard from "@/components/DevnetGuard";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Treasury from "@/pages/Treasury";
import Transactions from "@/pages/Transactions";
import ActivityFeed from "@/pages/ActivityFeed";
import NotFound from "@/pages/NotFound";

import "@solana/wallet-adapter-react-ui/styles.css";

const App: React.FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <DevnetGuard>
          <Routes>
            {/* Landing - full screen, no sidebar */}
            <Route path="/" element={<Landing />} />

            {/* App shell with sidebar */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/treasury" element={<Treasury />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/activity" element={<ActivityFeed />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          </DevnetGuard>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
