import type { TransactionRecord } from '@/lib/stellar';

export interface ApiErrorShape {
  message: string;
}

export class ApiError extends Error implements ApiErrorShape {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface RatesMap {
  NGN: number;
  GHS: number;
  KES: number;
}

export interface RatesResponse {
  base: string;
  rates: RatesMap;
  updatedAt?: string;
}

export interface AccountBalance {
  xlm: string;
  usdc: string;
}

export interface AccountResponse {
  address: string;
  exists: boolean;
  balances: AccountBalance;
  sequence?: string;
  subentryCount?: number;
}

export interface TransactionsResponse {
  address: string;
  transactions: TransactionRecord[];
  nextCursor?: string | null;
}

export interface VerifyResponse {
  verified: boolean;
  hash: string;
  sender: string;
  recipient: string;
  amount: string;
  asset: string;
  memo?: string;
  createdAt: string;
  explorerUrl: string;
}

export interface FundResponse {
  funded: boolean;
  publicKey: string;
  message?: string;
}

interface TransactionsOptions {
  limit?: number;
  cursor?: string;
  filter?: 'sent' | 'received' | 'all';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

async function parseError(response: Response): Promise<ApiError> {
  let details: unknown;
  let message = `Request failed with status ${response.status}`;

  try {
    details = await response.json();
    if (isRecord(details) && typeof details.message === 'string') {
      message = details.message;
    }
  } catch {
    try {
      const text = await response.text();
      if (text) {
        message = text;
      }
    } catch {
      // Ignore secondary parse failures.
    }
  }

  return new ApiError(message, response.status, details);
}

async function requestJson<T>(input: string | URL, init?: globalThis.RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('Invalid JSON response from server', response.status);
  }
}

function normalizeRatesResponse(payload: unknown): RatesResponse {
  const record = isRecord(payload) ? payload : {};
  const rawRates = isRecord(record.rates) ? record.rates : record;

  return {
    base: getString(record.base, 'USDC'),
    rates: {
      NGN: getNumber(rawRates.NGN),
      GHS: getNumber(rawRates.GHS),
      KES: getNumber(rawRates.KES),
    },
    updatedAt: getString(record.updatedAt) || undefined,
  };
}

function normalizeAccountResponse(address: string, payload: unknown): AccountResponse {
  const record = isRecord(payload) ? payload : {};
  const balancesRecord = isRecord(record.balances) ? record.balances : record;
  const exists =
    typeof record.exists === 'boolean'
      ? record.exists
      : typeof balancesRecord.xlm === 'string' || typeof balancesRecord.usdc === 'string';

  return {
    address: getString(record.address, address),
    exists,
    balances: {
      xlm: getString(balancesRecord.xlm, '0'),
      usdc: getString(balancesRecord.usdc, '0'),
    },
    sequence: getString(record.sequence) || undefined,
    subentryCount:
      typeof record.subentryCount === 'number' ? record.subentryCount : undefined,
  };
}

function normalizeTransactionsResponse(address: string, payload: unknown): TransactionsResponse {
  const record = isRecord(payload) ? payload : {};
  const transactions = Array.isArray(record.transactions)
    ? (record.transactions as TransactionRecord[])
    : Array.isArray(record.records)
      ? (record.records as TransactionRecord[])
      : [];

  return {
    address: getString(record.address, address),
    transactions,
    nextCursor:
      typeof record.nextCursor === 'string'
        ? record.nextCursor
        : typeof record.cursor === 'string'
          ? record.cursor
          : null,
  };
}

function normalizeVerifyResponse(hash: string, payload: unknown): VerifyResponse {
  const record = isRecord(payload) ? payload : {};

  return {
    verified:
      typeof record.verified === 'boolean'
        ? record.verified
        : Boolean(record.successful ?? record.found),
    hash: getString(record.hash, hash),
    sender: getString(record.sender || record.from),
    recipient: getString(record.recipient || record.to),
    amount: getString(record.amount),
    asset: getString(record.asset, 'USDC'),
    memo: getString(record.memo) || undefined,
    createdAt: getString(record.createdAt || record.date || record.timestamp),
    explorerUrl: getString(
      record.explorerUrl,
      `https://stellar.expert/explorer/testnet/tx/${hash}`
    ),
  };
}

function normalizeFundResponse(address: string, payload: unknown): FundResponse {
  const record = isRecord(payload) ? payload : {};

  return {
    funded: Boolean(record.funded ?? record.success),
    publicKey: getString(record.publicKey || record.address, address),
    message: getString(record.message) || undefined,
  };
}

export async function getRates(): Promise<RatesResponse> {
  const payload = await requestJson<unknown>('/api/rates', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return normalizeRatesResponse(payload);
}

export async function getAccount(address: string): Promise<AccountResponse> {
  const payload = await requestJson<unknown>(`/api/account/${encodeURIComponent(address)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return normalizeAccountResponse(address, payload);
}

export async function getTransactions(
  address: string,
  options: TransactionsOptions = {}
): Promise<TransactionsResponse> {
  const params = new URLSearchParams();

  if (options.limit) params.set('limit', String(options.limit));
  if (options.cursor) params.set('cursor', options.cursor);
  if (options.filter && options.filter !== 'all') params.set('filter', options.filter);

  const query = params.toString();
  const payload = await requestJson<unknown>(
    `/api/transactions/${encodeURIComponent(address)}${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
    }
  );

  return normalizeTransactionsResponse(address, payload);
}

export async function verifyPayment(hash: string): Promise<VerifyResponse> {
  const params = new URLSearchParams({ hash });
  const payload = await requestJson<unknown>(`/api/payment/verify?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return normalizeVerifyResponse(hash, payload);
}

export async function fundTestnet(address: string): Promise<FundResponse> {
  const payload = await requestJson<unknown>('/api/fund-testnet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  return normalizeFundResponse(address, payload);
}
