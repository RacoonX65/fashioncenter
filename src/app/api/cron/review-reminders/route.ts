import { NextRequest, NextResponse } from 'next/server';
import { processReviewReminders } from '@/lib/review-reminders';

/**
 * GET /api/cron/review-reminders
 * Cron job to send review reminders
 * 
 * Set up in Vercel Cron Jobs:
 * Schedule: 0 10 * * * (Every day at 10 AM)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional security measure)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await processReviewReminders();

    return NextResponse.json({
      success: true,
      message: 'Review reminders processed successfully'
    });

  } catch (error: any) {
    console.error('Error in review reminders cron:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process review reminders' },
      { status: 500 }
    );
  }
}

