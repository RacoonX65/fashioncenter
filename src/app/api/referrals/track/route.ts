import { NextRequest, NextResponse } from 'next/server';
import { trackReferral } from '@/lib/referral-system';

/**
 * POST /api/referrals/track
 * Track when someone uses a referral link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, refereeEmail } = body;

    if (!referralCode || !refereeEmail) {
      return NextResponse.json(
        { error: 'Referral code and referee email are required' },
        { status: 400 }
      );
    }

    const result = await trackReferral(referralCode, refereeEmail);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track referral' },
      { status: 500 }
    );
  }
}

