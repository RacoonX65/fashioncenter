import { NextRequest, NextResponse } from 'next/server';
import { validateDiscountCode } from '@/lib/discount-codes';

/**
 * POST /api/discount/validate
 * Validate a discount code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, customerEmail, orderTotal, productIds } = body;

    if (!code || !customerEmail || orderTotal === undefined) {
      return NextResponse.json(
        { error: 'Code, customer email, and order total are required' },
        { status: 400 }
      );
    }

    const result = await validateDiscountCode(code, customerEmail, orderTotal, productIds);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}

