/**
 * WhatsApp Business API Integration for FashionCenter
 * 
 * This module handles sending notifications to customers and admins via WhatsApp.
 * It requires setting up WhatsApp Business API access through Meta or a provider like Twilio.
 */

// Types for WhatsApp notifications
interface WhatsAppRecipient {
  phoneNumber: string; // Format: Country code + number, e.g., "27712345678"
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
}

interface TrackingDetails {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  courier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

// Get the WhatsApp Business API credentials from environment variables
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_BUSINESS_API_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

// Admin phone numbers for notifications
const ADMIN_PHONE_NUMBERS = [
  process.env.ADMIN_PHONE_NUMBER_1 || '',
  process.env.ADMIN_PHONE_NUMBER_2 || '',
  process.env.ADMIN_PHONE_NUMBER_3 || ''
].filter(Boolean); // Filter out any empty values

/**
 * Sends a message via WhatsApp Business API
 */
async function sendWhatsAppMessage(to: string, messageBody: string) {
  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('WhatsApp API credentials not configured');
    return false;
  }

  try {
    // Example implementation using the WhatsApp Cloud API
    const response = await fetch(
      `https://graph.facebook.com/v15.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: messageBody }
        })
      }
    );

    const data = await response.json();
    return response.ok;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
}

/**
 * Sends a notification about a new order to admins
 */
export async function notifyAdminsAboutNewOrder(orderDetails: OrderDetails) {
  const messageBody = `
🔔 NEW ORDER ALERT 🔔
  
Order #${orderDetails.orderNumber} has been placed!

Customer: ${orderDetails.customerName}
Total: R ${orderDetails.total.toFixed(2)}

Items:
${orderDetails.items.map(item => `- ${item.name} x${item.quantity} (R${item.price.toFixed(2)})`).join('\n')}

Shipping Address:
${orderDetails.shippingAddress}

Please log into the admin dashboard to process this order.
`;

  // Send to all admin phone numbers
  const results = await Promise.all(
    ADMIN_PHONE_NUMBERS.map(phoneNumber => 
      sendWhatsAppMessage(phoneNumber, messageBody)
    )
  );

  return results.some(result => result); // Return true if at least one message was sent
}

/**
 * Sends an order confirmation to the customer
 */
export async function sendOrderConfirmation(recipient: WhatsAppRecipient, orderDetails: OrderDetails) {
  const messageBody = `
Thank you for your order with FashionCenter!

Order #${orderDetails.orderNumber} has been received and is being processed.

Order Total: R ${orderDetails.total.toFixed(2)}

We'll update you when your order ships. You can also track your order status at:
https://fashioncenter.co.za/track-order

If you have any questions, please contact us at info@fashioncenter.co.za.
`;

  return sendWhatsAppMessage(recipient.phoneNumber, messageBody);
}

/**
 * Sends an order status update to the customer
 */
export async function sendOrderStatusUpdate(recipient: WhatsAppRecipient, trackingDetails: TrackingDetails) {
  let messageBody = '';

  switch (trackingDetails.status) {
    case 'processing':
      messageBody = `
Your FashionCenter order #${trackingDetails.orderNumber} is being processed.
We'll update you when it ships!
`;
      break;

    case 'shipped':
      messageBody = `
Great news! Your FashionCenter order #${trackingDetails.orderNumber} has been shipped.

${trackingDetails.courier ? `Courier: ${trackingDetails.courier}` : ''}
${trackingDetails.trackingNumber ? `Tracking Number: ${trackingDetails.trackingNumber}` : ''}
${trackingDetails.trackingUrl ? `Track your package: ${trackingDetails.trackingUrl}` : ''}

Thank you for shopping with FashionCenter!
`;
      break;

    case 'out_for_delivery':
      messageBody = `
Your FashionCenter order #${trackingDetails.orderNumber} is out for delivery!
It should arrive at your location today.

${trackingDetails.trackingUrl ? `Track your package: ${trackingDetails.trackingUrl}` : ''}
`;
      break;

    case 'delivered':
      messageBody = `
Your FashionCenter order #${trackingDetails.orderNumber} has been delivered!
We hope you enjoy your purchase.

Please let us know if you have any questions or feedback.
Thank you for shopping with FashionCenter!
`;
      break;
  }

  return sendWhatsAppMessage(recipient.phoneNumber, messageBody);
}

export default {
  notifyAdminsAboutNewOrder,
  sendOrderConfirmation,
  sendOrderStatusUpdate
};

