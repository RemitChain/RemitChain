'use client';

import {
  getAddress,
  isConnected as freighterIsConnected,
  requestAccess,
  signTransaction as freighterSignTransaction,
  getNetworkDetails as freighterGetNetworkDetails,
} from '@stellar/freighter-api';

/**
 * Requests wallet access and returns the public key.
 * - On first visit: triggers the Freighter popup to approve the site
 * - On subsequent visits: returns the address directly if already approved
 */
export async function getPublicKey(): Promise<string> {
  // First check: is Freighter running in this browser at all?
  const { isConnected, error: connErr } = await freighterIsConnected();

  if (connErr || !isConnected) {
    throw new Error('NOT_INSTALLED');
  }

  // Ask Freighter to approve this site and return the address
  const { address, error } = await requestAccess();

  if (error) {
    // User rejected the connection
    throw new Error(error.toString());
  }

  if (!address) {
    throw new Error('No Stellar account found. Create or import an account in Freighter first.');
  }

  return address;
}

/**
 * Gets the address that is already connected (no popup).
 * Use this to silently restore an existing session.
 */
export async function getConnectedAddress(): Promise<string | null> {
  try {
    const { isConnected } = await freighterIsConnected();
    if (!isConnected) return null;

    const { address, error } = await getAddress();
    if (error || !address) return null;

    return address;
  } catch {
    return null;
  }
}

/**
 * Signs a Stellar transaction XDR string using Freighter.
 */
export async function signTransaction(xdr: string): Promise<string> {
  const { signedTxXdr, error } = await freighterSignTransaction(xdr, {
    networkPassphrase: 'Test SDF Network ; September 2015',
  });

  if (error) throw new Error(error.toString());
  if (!signedTxXdr) throw new Error('Transaction signing failed or was rejected.');

  return signedTxXdr;
}

/**
 * Gets the current network details from Freighter.
 */
export async function getNetworkDetails(): Promise<{
  network: string;
  networkPassphrase: string;
}> {
  const result = await freighterGetNetworkDetails();
  if (result.error) throw new Error(result.error.toString());
  return { network: result.network, networkPassphrase: result.networkPassphrase };
}
