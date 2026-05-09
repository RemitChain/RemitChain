/**
 * Truncates a Stellar public key for display.
 * Example: GABCD...WXYZ
 */
export function truncatePublicKey(publicKey: string, chars = 4): string {
  if (publicKey.length <= chars * 2 + 3) return publicKey;
  return `${publicKey.slice(0, chars)}...${publicKey.slice(-chars)}`;
}

/**
 * Formats a Stellar amount to a human-readable string.
 */
export function formatAmount(amount: string, asset: string): string {
  const num = Number.parseFloat(amount);
  if (Number.isNaN(num)) return `0 ${asset}`;
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${asset}`;
}
