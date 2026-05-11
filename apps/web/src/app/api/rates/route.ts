import { NextResponse } from 'next/server';

// Approximate USDC → local currency rates for demo purposes
// In production, these would come from a live exchange rate API
const DEMO_RATES = {
  NGN: 1580.0,
  GHS: 15.2,
  KES: 153.5,
};

export async function GET() {
  return NextResponse.json({
    base: 'USDC',
    rates: DEMO_RATES,
    updatedAt: new Date().toISOString(),
  });
}
