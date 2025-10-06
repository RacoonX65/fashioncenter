/**
 * Brevo (Sendinblue) Email Integration for ApparelCast
 * 
 * Handles all transactional emails including:
 * - Order confirmations
 * - Shipping notifications
 * - Admin order notifications
 */

import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

// Types
interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
}

interface ShippingEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  courier: string;
  trackingNumber: string;
  trackingUrl: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Order Confirmation - ${orderData.orderNumber}`;
    sendSmtpEmail.to = [
      { email: orderData.customerEmail, name: orderData.customerName }
    ];
    sendSmtpEmail.sender = {
      name: 'ApparelCast',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    // HTML email template
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .order-details { background: #fff; padding: 15px; margin: 20px 0; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Hi ${orderData.customerName},</p>
              <p>Thank you for shopping with ApparelCast! Your order has been received and is being processed.</p>
              
              <div class="order-details">
                <h2>Order #${orderData.orderNumber}</h2>
                
                <h3>Items Ordered:</h3>
                ${orderData.items.map(item => `
                  <div class="item">
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity} × R ${item.price.toFixed(2)}<br>
                    Subtotal: R ${(item.quantity * item.price).toFixed(2)}
                  </div>
                `).join('')}
                
                <div class="total">
                  Total: R ${orderData.total.toFixed(2)}
                </div>
                
                <h3>Shipping Address:</h3>
                <p>${orderData.shippingAddress.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p>We'll send you another email when your order ships with tracking information.</p>
              
              <p>You can track your order anytime at:<br>
              <a href="https://apparelcast.shop/orders/${orderData.orderNumber}">Track Your Order</a></p>
              
              <p>If you have any questions, please contact us at info@apparelcast.shop</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
              <p>Johannesburg, South Africa</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(shippingData: ShippingEmailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Your Order Has Shipped! - ${shippingData.orderNumber}`;
    sendSmtpEmail.to = [
      { email: shippingData.customerEmail, name: shippingData.customerName }
    ];
    sendSmtpEmail.sender = {
      name: 'ApparelCast',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .tracking-box { background: #fff; padding: 20px; margin: 20px 0; text-align: center; }
            .tracking-number { font-size: 24px; font-weight: bold; color: #000; margin: 15px 0; }
            .button { background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Your Order is On Its Way!</h1>
            </div>
            <div class="content">
              <p>Hi ${shippingData.customerName},</p>
              <p>Great news! Your order #${shippingData.orderNumber} has been shipped and is on its way to you.</p>
              
              <div class="tracking-box">
                <h2>Tracking Information</h2>
                <p><strong>Courier:</strong> ${shippingData.courier}</p>
                <div class="tracking-number">${shippingData.trackingNumber}</div>
                <a href="${shippingData.trackingUrl}" class="button">Track Your Package</a>
              </div>
              
              <p>You can also track your order on our website:<br>
              <a href="https://apparelcast.shop/orders/${shippingData.orderNumber}">View Order Status</a></p>
              
              <p>Your package should arrive within 2-4 business days for standard shipping.</p>
              
              <p>If you have any questions, please contact us at info@apparelcast.shop</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order notification to admins (you and your sisters)
 */
export async function sendAdminOrderNotification(orderData: OrderEmailData) {
  try {
    const adminEmails = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3,
    ].filter(Boolean); // Remove empty values
    
    if (adminEmails.length === 0) {
      console.warn('No admin emails configured');
      return { success: false, error: 'No admin emails configured' };
    }
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `🔔 New Order: ${orderData.orderNumber}`;
    sendSmtpEmail.to = adminEmails.map(email => ({ email: email! }));
    sendSmtpEmail.sender = {
      name: 'ApparelCast System',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; }
            .content { background: #f9f9f9; padding: 20px; }
            .order-box { background: #fff; padding: 15px; margin: 15px 0; }
            .item { border-bottom: 1px solid #eee; padding: 8px 0; }
            .total { font-size: 20px; font-weight: bold; color: #000; margin-top: 15px; }
            .button { background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Order Received!</h1>
            </div>
            <div class="content">
              <div class="order-box">
                <h2>Order #${orderData.orderNumber}</h2>
                
                <p><strong>Customer:</strong> ${orderData.customerName}<br>
                <strong>Email:</strong> ${orderData.customerEmail}</p>
                
                <h3>Items:</h3>
                ${orderData.items.map(item => `
                  <div class="item">
                    ${item.name} - Qty: ${item.quantity} × R ${item.price.toFixed(2)} = R ${(item.quantity * item.price).toFixed(2)}
                  </div>
                `).join('')}
                
                <div class="total">Total: R ${orderData.total.toFixed(2)}</div>
                
                <h3>Shipping Address:</h3>
                <p>${orderData.shippingAddress.replace(/\n/g, '<br>')}</p>
                
                <a href="https://apparelcast.shop/admin" class="button">View in Admin Dashboard</a>
              </div>
              
              <p><strong>Action Required:</strong> Please process this order in the admin dashboard.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send delivery confirmation email
 */
export async function sendDeliveryConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string
) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Your Order Has Been Delivered! - ${orderNumber}`;
    sendSmtpEmail.to = [{ email: customerEmail, name: customerName }];
    sendSmtpEmail.sender = {
      name: 'ApparelCast',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; text-align: center; }
            .success-icon { font-size: 48px; margin: 20px 0; }
            .button { background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Delivery Confirmed!</h1>
            </div>
            <div class="content">
              <div class="success-icon">📦✨</div>
              <h2>Your order has been delivered!</h2>
              <p>Hi ${customerName},</p>
              <p>Your order #${orderNumber} has been successfully delivered.</p>
              <p>We hope you love your new items from ApparelCast!</p>
              
              <a href="https://apparelcast.shop/products" class="button">Shop Again</a>
              
              <p>Have feedback? We'd love to hear from you!<br>
              Email us at info@apparelcast.shop</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending delivery confirmation email:', error);
    return { success: false, error: error.message };
  }
}

export default {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendAdminOrderNotification,
  sendDeliveryConfirmationEmail,
};
