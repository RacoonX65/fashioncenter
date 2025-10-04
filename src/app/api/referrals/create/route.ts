import { NextRequest, NextResponse } from 'next/server';
import { createReferralLink } from '@/lib/referral-system';

/**
 * POST /api/referrals/create
 * Create a referral link for a customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerId } = body;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const result = await createReferralLink(customerEmail, customerId);

    return NextResponse.json({
      success: true,
      message: 'Referral link created successfully!',
      ...result
    });

  } catch (error: any) {
    console.error('Error creating referral link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create referral link' },
      { status: 500 }
    );
  }
}

