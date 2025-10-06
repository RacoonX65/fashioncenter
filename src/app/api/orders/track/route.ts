import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/orders/track
 * Track an order by reference and optionally email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const email = searchParams.get('email');

    if (!reference) {
      return NextResponse.json(
        { error: 'Order reference is required' },
        { status: 400 }
      );
    }

    // Query for order by reference
    let query = supabase
      .from('orders')
      .select('*')
      .eq('order_reference', reference);

    // If email provided, also filter by email for security
    if (email) {
      query = query.eq('customer_email', email);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found. Please check your order reference and try again.' },
        { status: 404 }
      );
    }

    // Return order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_reference: order.order_reference,
        status: order.status,
        payment_status: order.payment_status,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        order_items: order.order_items,
        subtotal: order.subtotal,
        shipping_fee: order.shipping_fee,
        tax: order.tax,
        total: order.total,
        delivery_method: order.delivery_method,
        tracking_number: order.tracking_number,
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    });
  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'An error occurred while tracking your order' },
      { status: 500 }
    );
  }
}

