import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * PATCH /api/admin/reviews/[reviewId]
 * Approve or reject a review - Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved, rejected, or pending' },
        { status: 400 }
      );
    }

    // Update review status
    const { data: review, error } = await supabase
      .from('reviews')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // TODO: If approved, send thank you email with discount code
    // if (status === 'approved') {
    //   await sendReviewThankYouEmail({
    //     customerName: review.customer_name,
    //     customerEmail: review.customer_email
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: `Review ${status} successfully`,
      review
    });

  } catch (error: any) {
    console.error('Error in review update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[reviewId]
 * Delete a review - Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error: any) {
    console.error('Error in review deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

