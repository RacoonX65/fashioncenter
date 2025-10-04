import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/reviews/submit
 * Submit a new product review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      productId, 
      customerId, 
      customerName, 
      customerEmail,
      rating, 
      title,
      comment 
    } = body;

    // Validate required fields
    if (!orderId || !productId || !rating || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if customer already reviewed this product for this order
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Verify the order exists and belongs to this customer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_info, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered (only delivered orders can be reviewed)
    if (order.status !== 'Delivered') {
      return NextResponse.json(
        { error: 'You can only review delivered orders' },
        { status: 403 }
      );
    }

    // Verify email matches order
    if (order.customer_info.email !== customerEmail) {
      return NextResponse.json(
        { error: 'Email does not match order' },
        { status: 403 }
      );
    }

    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        order_id: orderId,
        product_id: productId,
        customer_id: customerId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        rating,
        title: title || null,
        comment: comment || null,
        verified_purchase: true,
        status: 'pending' // Reviews need approval before showing
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Error inserting review:', reviewError);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    // Mark review request as completed
    await supabase
      .from('review_requests')
      .update({ completed: true })
      .eq('order_id', orderId)
      .eq('product_id', productId);

    // TODO: Send thank you email with discount code
    // await sendReviewThankYouEmail({ customerName, customerEmail });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! It will appear after approval.',
      review
    });

  } catch (error: any) {
    console.error('Error in review submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

