'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Home, Send as SendIcon } from 'lucide-react';
import { WalletConnect } from '@/components/WalletConnect';
import { SendPaymentForm } from '@/components/SendPaymentForm';

export default function SendPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = useCallback((pk: string) => setPublicKey(pk), []);
  const handleDisconnect = useCallback(() => setPublicKey(null), []);

  return (
    <div className="min-h-screen bg-hero-gradient">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-stellar-blue/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient">
                <SendIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">Send Payment</span>
            </div>
          </div>
          <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Send USDC Payment</h1>
          <p className="mt-2 text-slate-400">
            Instantly send USDC to any Stellar address on the testnet
          </p>
        </div>
        <SendPaymentForm
          senderPublicKey={publicKey ?? undefined}
          senderSecret={undefined}
        />
      </main>
    </div>
  );
}
