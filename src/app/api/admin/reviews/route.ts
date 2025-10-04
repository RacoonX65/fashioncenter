import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/admin/reviews
 * Fetch all reviews (pending, approved, rejected) - Admin only
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('reviews')
      .select('*, products(name, images)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if specified
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching admin reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error: any) {
    console.error('Error in admin reviews fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

