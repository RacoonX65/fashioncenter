import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/reviews/[productId]
 * Fetch all approved reviews for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    // Fetch approved reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Calculate rating statistics
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const ratingBreakdown = {
      5: reviews?.filter(r => r.rating === 5).length || 0,
      4: reviews?.filter(r => r.rating === 4).length || 0,
      3: reviews?.filter(r => r.rating === 3).length || 0,
      2: reviews?.filter(r => r.rating === 2).length || 0,
      1: reviews?.filter(r => r.rating === 1).length || 0,
    };

    return NextResponse.json({
      reviews: reviews || [],
      stats: {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingBreakdown
      }
    });

  } catch (error: any) {
    console.error('Error in reviews fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

