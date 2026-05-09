'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Search,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError, getAccount, getTransactions } from '@/lib/api';
import { truncatePublicKey } from '@/lib/stellar-format';
import { formatDate } from '@/lib/utils';
import { SUPPORTED_COUNTRIES } from '@/types';

export default function WorkerPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [lookupKey, setLookupKey] = useState('');
  const [viewingKey, setViewingKey] = useState<string | null>(null);

  const handleConnect = useCallback((pk: string) => {
    setPublicKey(pk);
    setViewingKey(pk);
  }, []);

  const handleDisconnect = useCallback(() => {
    setPublicKey(null);
    setViewingKey(null);
  }, []);

  const handleLookup = useCallback(() => {
    if (lookupKey.trim().length >= 56) {
      setViewingKey(lookupKey.trim());
    }
  }, [lookupKey]);

  const accountQuery = useQuery({
    queryKey: ['worker-account', viewingKey],
    queryFn: () => getAccount(viewingKey ?? ''),
    enabled: Boolean(viewingKey),
  });

  const transactionsQuery = useQuery({
    queryKey: ['worker-transactions', viewingKey],
    queryFn: () => getTransactions(viewingKey ?? '', { limit: 10 }),
    enabled: Boolean(viewingKey),
  });

  const transactions = useMemo(
    () => transactionsQuery.data?.transactions ?? [],
    [transactionsQuery.data]
  );
  const isLoadingProfile = accountQuery.isLoading || transactionsQuery.isLoading;
  const isNotFound =
    (accountQuery.error instanceof ApiError && accountQuery.error.status === 404) ||
    (accountQuery.data && !accountQuery.data.exists);

  return (
    <div className="min-h-screen bg-brand-surface selection:bg-brand-primary/10 selection:text-brand-primary">
      <nav className="sticky top-0 z-50 border-b border-brand-outline-variant bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-brand-secondary transition-colors hover:text-brand-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy">
                <span className="font-mono text-xs font-black text-white">A</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-brand-navy">Worker Portal</span>
            </div>
          </div>
          <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary shadow-2xl shadow-brand-primary/30">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-brand-navy">Professional Passport</h1>
          <p className="mt-4 text-lg font-medium text-brand-secondary">
            Your on-chain verified payment history and proof of international work.
          </p>
        </div>

        {!viewingKey ? (
          <div className="space-y-8">
            <div className="tonal-card rounded-[32px] border-2 border-dashed border-brand-outline-variant bg-white p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface">
                <Wallet className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="mb-3 text-2xl font-black text-brand-navy">Connect Identity</h2>
              <p className="mx-auto mb-8 max-w-sm font-medium text-brand-secondary">
                Securely connect your wallet to view your personal payment history and generate your shareable passport.
              </p>
              <div className="flex justify-center">
                <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
              </div>
            </div>

            <div className="relative flex items-center gap-6">
              <div className="flex-1 border-t border-brand-outline-variant" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary opacity-40">
                Verification Lookup
              </span>
              <div className="flex-1 border-t border-brand-outline-variant" />
            </div>

            <div className="tonal-card rounded-[32px] p-10">
              <label
                htmlFor="lookup-address"
                className="mb-4 block text-xs font-black uppercase tracking-widest text-brand-secondary"
              >
                Stellar Public Key
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-secondary opacity-40" />
                  <input
                    id="lookup-address"
                    type="text"
                    placeholder="G... Stellar address"
                    value={lookupKey}
                    onChange={(e) => setLookupKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    className="w-full rounded-2xl border border-brand-outline-variant bg-brand-surface py-4 pl-12 pr-4 font-mono text-sm font-bold text-brand-navy placeholder-brand-secondary/40 outline-none transition-all focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={lookupKey.trim().length < 56}
                  className="rounded-2xl bg-brand-navy px-8 py-4 text-sm font-black text-white shadow-xl shadow-brand-navy/20 transition-all hover:scale-105 disabled:opacity-30 active:scale-95"
                >
                  Verify Key
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            {isNotFound ? (
              <div className="rounded-[32px] border border-red-100 bg-red-50 p-8 text-center">
                <p className="text-2xl font-black text-red-600">Address not found</p>
                <p className="mt-3 text-sm font-medium text-red-500">
                  This Stellar testnet account could not be loaded.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setViewingKey(null);
                    setLookupKey('');
                  }}
                  className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-black text-red-600"
                >
                  Try another address
                </button>
              </div>
            ) : (
              <>
                <div className="tonal-card relative overflow-hidden rounded-[32px] bg-brand-navy p-10 text-white">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                          Verified Professional
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                            <Users className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <p className="font-mono text-lg font-bold leading-none text-white/90">
                              {truncatePublicKey(viewingKey, 16)}
                            </p>
                            {publicKey === viewingKey && (
                              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40">
                                Owner Identity Connected
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                          <TrendingUp className="h-4 w-4 text-brand-primary" />
                          <span className="text-xs font-black uppercase tracking-widest">
                            Active
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingKey(null);
                            setLookupKey('');
                          }}
                          className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/5 pt-8 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          XLM Balance
                        </p>
                        {isLoadingProfile ? (
                          <Skeleton className="mt-3 h-5 w-24 bg-white/10" />
                        ) : (
                          <p className="mt-2 font-mono text-sm font-bold text-white">
                            {accountQuery.data?.balances.xlm ?? '0'} XLM
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          USDC Balance
                        </p>
                        {isLoadingProfile ? (
                          <Skeleton className="mt-3 h-5 w-24 bg-white/10" />
                        ) : (
                          <p className="mt-2 font-mono text-sm font-bold text-white">
                            {accountQuery.data?.balances.usdc ?? '0'} USDC
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Recent Payments
                        </p>
                        {isLoadingProfile ? (
                          <Skeleton className="mt-3 h-5 w-20 bg-white/10" />
                        ) : (
                          <p className="mt-2 font-mono text-sm font-bold text-white">
                            {transactions.length}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tonal-card rounded-[32px] p-10">
                  <h2 className="mb-6 flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-brand-navy">
                    <MapPin className="h-5 w-5 text-brand-primary" />
                    Active Off-Ramp Corridors
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {SUPPORTED_COUNTRIES.map((country) => (
                      <div
                        key={country.code}
                        className="flex flex-col items-center gap-3 rounded-2xl border border-brand-outline-variant bg-brand-surface p-6 text-center transition-all hover:border-brand-primary/20 hover:bg-white"
                      >
                        <span className="text-4xl grayscale transition-all hover:grayscale-0">
                          {country.flag}
                        </span>
                        <div>
                          <p className="text-xs font-black text-brand-navy">{country.name}</p>
                          <p className="mt-1 font-mono text-[10px] font-bold uppercase text-brand-primary">
                            {country.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-center text-xs font-medium italic leading-relaxed text-brand-secondary">
                    Automated local currency delivery is live in these regions via Stellar protocol SEP-24 anchors.
                  </p>
                </div>

                <div className="tonal-card rounded-[32px] bg-white p-10">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-navy">
                        Payment History
                      </h2>
                      <p className="mt-2 text-sm text-brand-secondary">
                        Public proof of recent payouts for this worker wallet.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void accountQuery.refetch();
                        void transactionsQuery.refetch();
                      }}
                      className="rounded-2xl border border-brand-outline-variant px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-secondary"
                    >
                      Refresh
                    </button>
                  </div>

                  {isLoadingProfile ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : transactionsQuery.isError ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                      {transactionsQuery.error instanceof Error
                        ? transactionsQuery.error.message
                        : 'Failed to load payment history'}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="rounded-2xl border border-brand-outline-variant bg-brand-surface p-8 text-center text-sm font-medium text-brand-secondary">
                      No transactions yet
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[24px] border border-brand-outline-variant">
                      <table className="w-full table-fixed text-left">
                        <thead className="bg-brand-surface">
                          <tr className="text-xs uppercase tracking-widest text-brand-secondary">
                            <th className="px-4 py-4 font-black">Date</th>
                            <th className="px-4 py-4 font-black">Direction</th>
                            <th className="px-4 py-4 font-black">Amount</th>
                            <th className="px-4 py-4 font-black">Hash</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => {
                            const incoming = tx.to === viewingKey;

                            return (
                              <tr key={tx.id} className="border-t border-brand-outline-variant bg-white">
                                <td className="px-4 py-4 text-sm text-brand-secondary">
                                  {formatDate(tx.createdAt)}
                                </td>
                                <td className="px-4 py-4 text-sm font-bold text-brand-navy">
                                  {incoming ? 'Received' : 'Sent'}
                                </td>
                                <td className="px-4 py-4 font-mono text-sm text-brand-navy">
                                  {incoming ? '+' : '-'}
                                  {tx.amount} {tx.asset}
                                </td>
                                <td className="px-4 py-4">
                                  <a
                                    href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-mono text-sm text-brand-primary"
                                  >
                                    {truncatePublicKey(tx.hash, 6)}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-brand-outline-variant bg-white px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-navy">
              <span className="font-mono text-[10px] font-black text-white">A</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-tight text-brand-navy">
              AfriWage Protocol
            </span>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-brand-secondary">
            <Link href="/dashboard" className="transition-colors hover:text-brand-primary">
              Overview
            </Link>
            <Link href="/worker" className="transition-colors hover:text-brand-primary">
              Worker Portal
            </Link>
            <a
              href="https://github.com/AfriWage/AfriWage"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
