import { NextResponse } from 'next/server';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');

  if (!hash) {
    return NextResponse.json(
      { message: 'Transaction hash is required' },
      { status: 400 }
    );
  }

  try {
    const tx = await server.transactions().transaction(hash).call();

    // Fetch operations to extract payment details
    const opsPage = await server.operations().forTransaction(hash).call();
    const ops = opsPage.records;

    let sender = tx.source_account;
    let recipient = '';
    let amount = '0';
    let asset = 'XLM';

    for (const op of ops) {
      if (op.type === 'payment') {
        const payOp = op as Horizon.HorizonApi.PaymentOperationResponse;
        sender = payOp.from;
        recipient = payOp.to;
        amount = payOp.amount;
        asset = payOp.asset_type === 'native'
          ? 'XLM'
          : `${(payOp as { asset_code?: string }).asset_code ?? 'UNKNOWN'}`;
        break;
      }
    }

    return NextResponse.json({
      verified: tx.successful,
      hash: tx.hash,
      sender,
      recipient,
      amount,
      asset,
      memo: tx.memo_type === 'text' ? tx.memo : undefined,
      createdAt: tx.created_at,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { message: 'Transaction not found', verified: false },
      { status: 404 }
    );
  }
}
