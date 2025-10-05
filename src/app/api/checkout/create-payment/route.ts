import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.customer || !orderData.shipping || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Generate order reference
    const orderRef = `FC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Save order to Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_reference: orderRef,
        customer_email: orderData.customer.email,
        customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        customer_phone: orderData.customer.phone,
        shipping_address: `${orderData.shipping.address}${orderData.shipping.apartment ? ', ' + orderData.shipping.apartment : ''}, ${orderData.shipping.city}, ${orderData.shipping.province}, ${orderData.shipping.postalCode}`,
        delivery_method: orderData.delivery.method,
        order_items: orderData.items,
        subtotal: orderData.pricing.subtotal,
        shipping_fee: orderData.pricing.shipping,
        tax: orderData.pricing.tax,
        total: orderData.pricing.total,
        order_notes: orderData.notes || null,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error saving order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Initialize PayStack payment
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecretKey) {
      console.error('PayStack secret key not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const paystackData = {
      email: orderData.customer.email,
      amount: Math.round(orderData.pricing.total * 100), // PayStack expects amount in cents/kobo
      reference: orderRef,
      currency: 'ZAR',
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?reference=${orderRef}`,
      metadata: {
        order_id: order.id,
        customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        customer_phone: orderData.customer.phone,
        items_count: orderData.items.length
      }
    };

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paystackData)
    });

    const paystackResult = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackResult.status) {
      console.error('PayStack error:', paystackResult);
      return NextResponse.json(
        { error: paystackResult.message || 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    // Update order with PayStack reference
    await supabase
      .from('orders')
      .update({ 
        paystack_reference: paystackResult.data.reference,
        paystack_access_code: paystackResult.data.access_code
      })
      .eq('id', order.id);

    // Send notifications (async, don't wait)
    sendOrderNotifications(order, orderData).catch(err => 
      console.error('Error sending notifications:', err)
    );

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_reference: orderRef,
      authorization_url: paystackResult.data.authorization_url,
      access_code: paystackResult.data.access_code
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to send notifications
async function sendOrderNotifications(order: any, orderData: any) {
  try {
    // Send WhatsApp notifications (to user and admin sisters)
    const whatsappPromises = [];
    
    // Customer notification
    if (orderData.customer.phone && process.env.WHATSAPP_BUSINESS_API_TOKEN) {
      whatsappPromises.push(
        sendWhatsAppMessage(
          orderData.customer.phone,
          `🎉 Order Confirmed!\n\nThank you for your order!\n\nOrder #: ${order.order_reference}\nTotal: R ${orderData.pricing.total.toFixed(2)}\n\nWe'll send you tracking details once your order ships.\n\n- FashionCenter Team`
        )
      );
    }

    // Admin notifications (sisters)
    const adminPhones = [
      process.env.ADMIN_PHONE_NUMBER_1,
      process.env.ADMIN_PHONE_NUMBER_2,
      process.env.ADMIN_PHONE_NUMBER_3
    ].filter(Boolean);

    adminPhones.forEach(phone => {
      whatsappPromises.push(
        sendWhatsAppMessage(
          phone!,
          `🛍️ NEW ORDER RECEIVED!\n\nOrder #: ${order.order_reference}\nCustomer: ${orderData.customer.firstName} ${orderData.customer.lastName}\nTotal: R ${orderData.pricing.total.toFixed(2)}\nItems: ${orderData.items.length}\n\nCheck admin dashboard for details.`
        )
      );
    });

    await Promise.allSettled(whatsappPromises);

    // Send email confirmation (Brevo)
    if (process.env.BREVO_API_KEY) {
      await sendOrderConfirmationEmail(order, orderData);
    }

  } catch (error) {
    console.error('Notification error:', error);
    // Don't throw - notifications are non-critical
  }
}

async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn('WhatsApp not configured');
    return;
  }

  const cleanNumber = to.replace(/\D/g, '');
  const formattedNumber = cleanNumber.startsWith('27') ? cleanNumber : '27' + cleanNumber.substring(1);

  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedNumber,
      type: 'text',
      text: { body: message }
    })
  });
}

async function sendOrderConfirmationEmail(order: any, orderData: any) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!brevoApiKey || !senderEmail) {
    console.warn('Brevo not configured');
    return;
  }

  const itemsList = orderData.items
    .map((item: any) => `<li>${item.name} - ${item.size} - ${item.color} - Qty: ${item.quantity} - R ${(item.price * item.quantity).toFixed(2)}</li>`)
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #14b8a6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px 0; border-bottom: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hi ${orderData.customer.firstName},</p>
          <p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>
          
          <div class="order-details">
            <h2>Order #${order.order_reference}</h2>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
            
            <h3>Items:</h3>
            <ul>${itemsList}</ul>
            
            <hr>
            <p><strong>Subtotal:</strong> R ${orderData.pricing.subtotal.toFixed(2)}</p>
            <p><strong>Delivery:</strong> R ${orderData.pricing.shipping.toFixed(2)}</p>
            <p><strong>VAT:</strong> R ${orderData.pricing.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> R ${orderData.pricing.total.toFixed(2)}</p>
            
            <h3>Shipping Address:</h3>
            <p>
              ${orderData.shipping.address}${orderData.shipping.apartment ? ', ' + orderData.shipping.apartment : ''}<br>
              ${orderData.shipping.city}, ${orderData.shipping.province}<br>
              ${orderData.shipping.postalCode}
            </p>
            
            <h3>Delivery Method:</h3>
            <p>${orderData.delivery.method === 'courierGuy' ? 'CourierGuy' : 'PEP Pexie'}</p>
          </div>
          
          <p>We'll send you tracking details once your order ships.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Thanks for shopping with us!</p>
          <p><strong>- The FashionCenter Team</strong></p>
        </div>
        <div class="footer">
          <p>FashionCenter | South Africa's Premier Fashion Destination</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': brevoApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'FashionCenter' },
      to: [{ email: orderData.customer.email, name: `${orderData.customer.firstName} ${orderData.customer.lastName}` }],
      subject: `Order Confirmation - ${order.order_reference}`,
      htmlContent
    })
  });
}

