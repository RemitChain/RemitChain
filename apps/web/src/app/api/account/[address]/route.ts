import { NextResponse } from 'next/server';
import { getBalance, accountExists } from '@AfriWage/sdk';

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
        { message: 'Account not found on testnet', address, exists: false },
        { status: 404 }
      );
    }

    const balances = await getBalance(address);

    return NextResponse.json({
      address,
      exists: true,
      balances,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { message: 'Failed to fetch account from Stellar network' },
      { status: 502 }
    );
  }
}
