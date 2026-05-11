import { NextResponse } from 'next/server';
import { getTransactionHistory, accountExists } from '@AfriWage/sdk';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || address.length !== 56 || !address.startsWith('G')) {
    return NextResponse.json(
      { message: 'Invalid Stellar public key' },
      { status: 400 }
    );
  }

  try {
    const exists = await accountExists(address);

    if (!exists) {
      return NextResponse.json(
        { message: 'Account not found on testnet', address, transactions: [] },
        { status: 404 }
      );
    }

    const transactions = await getTransactionHistory(address);

    return NextResponse.json({
      address,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch transactions from Stellar network' },
      { status: 502 }
    );
  }
}
