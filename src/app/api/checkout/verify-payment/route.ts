import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_reference', reference)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If already verified, return success
    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        order,
        message: 'Payment already verified'
      });
    }

    // Verify payment with PayStack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecretKey) {
      console.error('PayStack secret key not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`
        }
      }
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyResult.status) {
      console.error('PayStack verification error:', verifyResult);
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = verifyResult.data;

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return NextResponse.json(
        { 
          error: 'Payment was not successful',
          payment_status: paymentData.status
        },
        { status: 400 }
      );
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        paid_at: new Date().toISOString(),
        paystack_payment_data: paymentData
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      payment: {
        amount: paymentData.amount / 100, // Convert from kobo to ZAR
        paid_at: paymentData.paid_at,
        channel: paymentData.channel
      }
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

