import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendShippingUpdateEmail } from '@/lib/brevo-email';
import { sendReviewRequestEmail } from '@/lib/review-emails';

/**
 * PATCH /api/orders/[orderId]/update-status
 * Update order status and trigger notifications - Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { status, trackingNumber, courierInfo } = body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    if (courierInfo) {
      updateData.courier_info = courierInfo;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send notifications based on status change
    const customerEmail = order.customer_info?.email;
    const customerName = order.customer_info?.name;

    // If order was just marked as Shipped, send shipping notification
    if (status === 'Shipped' && order.status !== 'Shipped' && trackingNumber && courierInfo) {
      try {
        await sendShippingUpdateEmail({
          id: orderId,
          customer_info: { name: customerName, email: customerEmail },
          items: order.items,
          total: order.total,
          tracking_number: trackingNumber,
          courier_info: courierInfo
        });
      } catch (emailError) {
        console.error('Error sending shipping email:', emailError);
      }
    }

    // If order was just marked as Delivered, send review request after 1 day
    if (status === 'Delivered' && order.status !== 'Delivered') {
      try {
        // Get unique products from order
        const products = order.items.map((item: any) => ({
          id: item.product_id,
          name: item.name,
          image: item.image || null
        }));

        // Create review requests in database
        for (const product of products) {
          const { error: requestError } = await supabase
            .from('review_requests')
            .insert({
              order_id: orderId,
              customer_id: order.customer_id || null,
              customer_email: customerEmail,
              product_id: product.id
            })
            .select()
            .single();

          if (requestError && requestError.code !== '23505') { // Ignore duplicate key errors
            console.error('Error creating review request:', requestError);
          }
        }

        // Schedule review request email for 1 day later
        // For now, we'll send immediately. In production, use a job queue like BullMQ or Supabase Edge Functions
        setTimeout(async () => {
          try {
            await sendReviewRequestEmail({
              customerName,
              customerEmail,
              orderNumber: orderId.substring(0, 8),
              products
            });
          } catch (reviewEmailError) {
            console.error('Error sending review request:', reviewEmailError);
          }
        }, 24 * 60 * 60 * 1000); // 24 hours

      } catch (error) {
        console.error('Error setting up review request:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error: any) {
    console.error('Error in order status update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

