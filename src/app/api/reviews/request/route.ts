import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendReviewRequestEmail } from '@/lib/review-emails';

/**
 * POST /api/reviews/request
 * Send review request email to customer (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, items')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered
    if (order.status !== 'Delivered') {
      return NextResponse.json(
        { error: 'Can only request reviews for delivered orders' },
        { status: 400 }
      );
    }

    // Get unique products from order
    const products = order.items.map((item: any) => ({
      id: item.product_id,
      name: item.name,
      image: item.image || null
    }));

    // Create review requests in database
    for (const product of products) {
      // Check if request already exists
      const { data: existing } = await supabase
        .from('review_requests')
        .select('id')
        .eq('order_id', orderId)
        .eq('product_id', product.id)
        .single();

      if (!existing) {
        await supabase
          .from('review_requests')
          .insert({
            order_id: orderId,
            customer_id: order.customer_id || null,
            customer_email: order.customer_info.email,
            product_id: product.id
          });
      }
    }

    // Send review request email
    const emailResult = await sendReviewRequestEmail({
      customerName: order.customer_info.name,
      customerEmail: order.customer_info.email,
      orderNumber: orderId.substring(0, 8),
      products
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send review request email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review request sent successfully',
      sentTo: order.customer_info.email
    });

  } catch (error: any) {
    console.error('Error sending review request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

