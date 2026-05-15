'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Home,
  Loader2,
  Users,
  Wallet2,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { DashboardShell, SurfaceCard } from '@/components/dashboard-shell';
import { WalletConnect } from '@/components/WalletConnect';
import type { Balance } from '@/lib/stellar';
import { fundTestnetAccount, getBalance } from '@/lib/stellar';
import { formatAmount, truncatePublicKey } from '@/lib/stellar-format';
import { cn, copyToClipboard } from '@/lib/utils';

/* ─── SKELETON ─────────────────────────────────────────── */

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-white/10', className)} />;
}

/* ─── PAGE ─────────────────────────────────────────────── */

export default function WalletPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleConnect = useCallback((pk: string) => {
    setPublicKey(pk);
  }, []);

  const handleDisconnect = useCallback(() => {
    setPublicKey(null);
  }, []);

  return (
    <DashboardShell
      title="Wallet"
      description="Manage your Stellar wallet and view balances."
      actions={<WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />}
    >
      <div className="space-y-6">
        {!publicKey ? (
          <DisconnectedState onConnect={handleConnect} onDisconnect={handleDisconnect} />
        ) : (
          <ConnectedWallet publicKey={publicKey} queryClient={queryClient} />
        )}
      </div>
    </DashboardShell>
  );
}

/* ─── DISCONNECTED STATE ───────────────────────────────── */

function DisconnectedState({
  onConnect,
  onDisconnect,
}: {
  onConnect: (pk: string) => void;
  onDisconnect: () => void;
}) {
  return (
    <SurfaceCard>
      <div className="flex min-h-[40vh] flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-[#f3ecdf] p-6">
          <Wallet2 className="h-12 w-12 text-[#8c7760]" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#102033]">Connect your wallet</h2>

        <p className="mx-auto mt-3 max-w-sm text-[#637085]">
          Connect Freighter to view your real XLM and USDC balances.
        </p>

        <div className="mt-8">
          <WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />
        </div>

        <a
          href="https://www.freighter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1f8f55] hover:text-[#14A800]"
        >
          Get Freighter
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </SurfaceCard>
  );
}

/* ─── CONNECTED WALLET ─────────────────────────────────── */

function ConnectedWallet({
  publicKey,
  queryClient,
}: {
  publicKey: string;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [addressCopied, setAddressCopied] = useState(false);

  const {
    data: balance,
    isLoading,
    error,
  } = useQuery<Balance>({
    queryKey: ['account', publicKey],
    queryFn: () => getBalance(publicKey),
    enabled: !!publicKey,
    refetchInterval: 30000,
  });

  const fundMutation = useMutation({
    mutationFn: () => fundTestnetAccount(publicKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', publicKey] });
    },
  });

  const accountActive = balance && balance.xlm !== '0' && balance.xlm !== '0.0000000';

  const handleCopyAddress = async () => {
    const ok = await copyToClipboard(publicKey);
    if (ok) {
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── PAGE HEADER ───────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <div className="mt-1 flex items-center gap-2">
          <p className="font-mono text-sm text-[#6B7280]">{truncatePublicKey(publicKey, 6)}</p>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-[#6B7280] transition-colors hover:text-white"
            aria-label="Copy wallet address"
          >
            {addressCopied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#14A800]" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── BALANCE CARDS ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-44 bg-white/5" />
            <Skeleton className="h-44 bg-white/5" />
            <Skeleton className="h-44 bg-white/5" />
          </>
        ) : error ? (
          <div className="col-span-full rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to load balances. The account may not exist on testnet.
            </div>
          </div>
        ) : balance ? (
          <>
            {/* USDC Balance */}
            <div className="rounded-xl bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                USDC Balance
              </p>
              <p className="mt-2 text-4xl font-bold text-white">{formatAmount(balance.usdc, '')}</p>
              <p className="mt-2 text-sm text-white/40">USD Coin · Stellar testnet</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#14A800]/20 px-3 py-1 text-xs text-[#14A800]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
                Live
              </span>
            </div>

            {/* XLM Balance */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                XLM Balance
              </p>
              <p className="mt-2 text-4xl font-bold text-white">{formatAmount(balance.xlm, '')}</p>
              <p className="mt-2 text-sm text-white/40">Stellar Lumens · Gas fees</p>
            </div>

            {/* Account Status */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Account Status
              </p>
              <p
                className={cn(
                  'mt-2 text-2xl font-bold',
                  accountActive ? 'text-[#14A800]' : 'text-[#E24B4A]'
                )}
              >
                {accountActive ? 'Active' : 'Not funded'}
              </p>
              <p className="mt-2 text-sm text-white/40">Stellar testnet account</p>
              {!accountActive && (
                <button
                  type="button"
                  onClick={() => fundMutation.mutate()}
                  disabled={fundMutation.isPending}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-[#14A800] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#108A00] disabled:opacity-50"
                >
                  {fundMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Fund with Friendbot
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* ── FUND FEEDBACK ─────────────────────────── */}
      {fundMutation.isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          Funding failed:{' '}
          {fundMutation.error instanceof Error ? fundMutation.error.message : 'Unknown error'}
        </div>
      )}

      {fundMutation.isSuccess && (
        <div className="rounded-xl border border-[#BBF7D0]/30 bg-[#14A800]/10 p-4 text-sm text-[#14A800]">
          <CheckCircle2 className="mr-2 inline h-4 w-4" />
          Account funded successfully! Balances will refresh shortly.
        </div>
      )}

      {/* ── QUICK ACTIONS ─────────────────────────── */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/send"
            className="flex items-center gap-2 rounded-lg bg-[#14A800] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#108A00]"
          >
            Send Payment
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
          >
            View Transactions
          </Link>
        </div>
      </div>

      {/* ── WALLET ADDRESS CARD ───────────────────── */}
      <WalletAddressCard publicKey={publicKey} />
    </div>
  );
}

/* ─── WALLET ADDRESS CARD ──────────────────────────────── */

function WalletAddressCard({ publicKey }: { publicKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(publicKey);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
        YOUR STELLAR ADDRESS
      </p>
      <p className="break-all font-mono text-sm text-white">{publicKey}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#14A800]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy address
            </>
          )}
        </button>
        <a
          href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View on Explorer →
        </a>
      </div>
    </div>
  );
}
