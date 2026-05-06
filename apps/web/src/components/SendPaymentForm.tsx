'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { StrKey } from '@stellar/stellar-sdk';
import { Send, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { sendPayment } from '@/lib/stellar';
import { cn } from '@/lib/utils';

interface SendPaymentFormProps {
  senderSecret?: string;
  senderPublicKey?: string;
  className?: string;
}

interface FormValues {
  recipientPublicKey: string;
  amount: string;
  memo: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function SendPaymentForm({ senderSecret, className }: SendPaymentFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      recipientPublicKey: '',
      amount: '',
      memo: '',
    },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!senderSecret) {
        setErrorMessage('Please connect your wallet before sending a payment.');
        setStatus('error');
        return;
      }

      setStatus('loading');
      setErrorMessage(null);
      setTxHash(null);

      try {
        const result = await sendPayment(
          senderSecret,
          data.recipientPublicKey,
          data.amount,
          data.memo || undefined
        );

        setTxHash(result.hash);
        setStatus('success');
        reset();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Payment failed. Please check your balance and try again.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [senderSecret, reset]
  );

  const handleReset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setErrorMessage(null);
  }, []);

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
      <h2 className="mb-6 text-xl font-semibold text-white">Send USDC Payment</h2>

      {status === 'success' && txHash ? (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-400" />
            <div>
              <p className="font-semibold text-green-400">Payment Sent Successfully!</p>
              <p className="text-sm text-slate-400">Your USDC has been delivered on the Stellar network.</p>
            </div>
          </div>

          <div className="rounded-xl bg-black/20 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
              Transaction Hash
            </p>
            <p className="break-all font-mono text-xs text-slate-300">{txHash}</p>
          </div>

          <div className="flex gap-3">
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </a>
            <button
              onClick={handleReset}
              className="flex-1 rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              Send Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Recipient Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="recipientPublicKey"
              className="block text-sm font-medium text-slate-300"
            >
              Recipient Address <span className="text-red-400">*</span>
            </label>
            <input
              id="recipientPublicKey"
              type="text"
              placeholder="G... Stellar public key"
              className={cn(
                'w-full rounded-xl border bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-brand-500/50',
                errors.recipientPublicKey
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-white/10 focus:border-brand-500/50'
              )}
              {...register('recipientPublicKey', {
                required: 'Recipient address is required',
                validate: (value) =>
                  StrKey.isValidEd25519PublicKey(value) ||
                  'Invalid Stellar address — must be a valid G... public key',
              })}
              aria-describedby={errors.recipientPublicKey ? 'recipient-error' : undefined}
              aria-invalid={!!errors.recipientPublicKey}
            />
            {errors.recipientPublicKey && (
              <p id="recipient-error" className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.recipientPublicKey.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label htmlFor="amount" className="block text-sm font-medium text-slate-300">
              Amount (USDC) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={cn(
                  'w-full rounded-xl border bg-white/5 py-3 pl-4 pr-16 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-brand-500/50',
                  errors.amount
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-brand-500/50'
                )}
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Minimum amount is 0.01 USDC' },
                  pattern: {
                    value: /^\d+(\.\d{1,7})?$/,
                    message: 'Invalid amount format',
                  },
                })}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
                aria-invalid={!!errors.amount}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-400">
                USDC
              </span>
            </div>
            {errors.amount && (
              <p id="amount-error" className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Memo (optional) */}
          <div className="space-y-1.5">
            <label htmlFor="memo" className="block text-sm font-medium text-slate-300">
              Memo{' '}
              <span className="text-slate-500">(optional, max 28 chars)</span>
            </label>
            <input
              id="memo"
              type="text"
              placeholder="e.g. Invoice #42, July salary"
              maxLength={28}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/50"
              {...register('memo', {
                maxLength: {
                  value: 28,
                  message: 'Memo must be 28 characters or fewer',
                },
              })}
            />
            {errors.memo && (
              <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.memo.message}
              </p>
            )}
          </div>

          {/* Error display */}
          {status === 'error' && errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading' || !senderSecret}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200',
              status === 'loading' || !senderSecret
                ? 'cursor-not-allowed bg-white/10 text-slate-500'
                : 'bg-brand-gradient shadow-brand-glow hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
            )}
            aria-label={
              !senderSecret
                ? 'Connect wallet to send payment'
                : status === 'loading'
                ? 'Processing payment...'
                : 'Send USDC payment'
            }
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Payment...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {!senderSecret ? 'Connect Wallet to Send' : 'Send USDC'}
              </>
            )}
          </button>

          {!senderSecret && (
            <p className="text-center text-xs text-slate-500">
              Connect your Freighter wallet to enable payments
            </p>
          )}
        </form>
      )}
    </div>
  );
}
