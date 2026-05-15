'use client';

import { useCallback, useState } from 'react';
import { DashboardShell, SurfaceCard } from '@/components/dashboard-shell';
import { SendPaymentForm } from '@/components/SendPaymentForm';
import { WalletConnect } from '@/components/WalletConnect';

export default function SendPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = useCallback((pk: string) => setPublicKey(pk), []);
  const handleDisconnect = useCallback(() => setPublicKey(null), []);

  return (
    <DashboardShell
      title="Send Payment"
      description="Send USDC instantly to any Stellar address on testnet."
      actions={<WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />}
    >
      <div className="space-y-6">
        <SurfaceCard>
          <SendPaymentForm senderPublicKey={publicKey ?? undefined} />
        </SurfaceCard>
      </div>
    </DashboardShell>
  );
}
