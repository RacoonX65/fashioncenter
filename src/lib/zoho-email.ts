import nodemailer from 'nodemailer';

/**
 * Zoho Mail Integration for ApparelCast
 * Sends transactional emails using Zoho SMTP
 */

// Email configuration
const ZOHO_CONFIG = {
  host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.ZOHO_SMTP_PORT || '587'),
  secure: process.env.ZOHO_SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.ZOHO_SMTP_USER || '',
    pass: process.env.ZOHO_SMTP_PASS || '',
  },
};

const SENDER = {
  email: process.env.ZOHO_SENDER_EMAIL || 'noreply@apparelcast.shop',
  name: process.env.ZOHO_SENDER_NAME || 'ApparelCast',
};

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!ZOHO_CONFIG.auth.user || !ZOHO_CONFIG.auth.pass) {
      console.warn('Zoho SMTP credentials not configured. Emails will not be sent.');
      return null;
    }
    
    transporter = nodemailer.createTransport(ZOHO_CONFIG);
  }
  return transporter;
}

// Email data types
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
}

export interface ShippingEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: `${SENDER.name} <${SENDER.email}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a56db; color: #fff; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px 20px; }
              .order-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between; }
              .item:last-child { border-bottom: none; }
              .total { font-size: 20px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #1a56db; }
              .button { display: inline-block; background: #1a56db; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .address { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Order Confirmed!</h1>
                <p style="margin: 10px 0 0; font-size: 18px;">Thank you for shopping with ApparelCast</p>
              </div>
              
              <div class="content">
                <p>Hi ${orderData.customerName},</p>
                <p>Great news! Your order has been confirmed and is being prepared for shipment.</p>

                <div class="order-details">
                  <h2 style="margin-top: 0; color: #1a56db;">Order #${orderData.orderNumber}</h2>

                  <h3 style="color: #555;">Items Ordered:</h3>
                  ${orderData.items.map(item => `
                    <div class="item">
                      <div>
                        <strong>${item.name}</strong><br>
                        <span style="color: #666;">Quantity: ${item.quantity}</span>
                      </div>
                      <div style="text-align: right;">
                        <strong>R ${(item.quantity * item.price).toFixed(2)}</strong><br>
                        <span style="color: #666; font-size: 14px;">R ${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                  `).join('')}

                  <div class="total">
                    Total: R ${orderData.total.toFixed(2)}
                  </div>

                  <h3 style="color: #555; margin-top: 30px;">Shipping Address:</h3>
                  <div class="address">
                    ${orderData.shippingAddress.replace(/\n/g, '<br>')}
                  </div>
                </div>

                <p>We'll send you another email with tracking information once your order ships.</p>

                <div style="text-align: center;">
                  <a href="https://apparelcast.shop/track-order?ref=${orderData.orderNumber}" class="button">
                    Track Your Order
                  </a>
                </div>

                <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us at <a href="mailto:info@apparelcast.shop">info@apparelcast.shop</a></p>
              </div>

              <div class="footer">
                <p><strong>ApparelCast</strong></p>
                <p>Quality clothing delivered across South Africa</p>
                <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
                <p style="margin-top: 15px;">
                  <a href="https://apparelcast.shop" style="color: #1a56db; text-decoration: none;">Visit Our Store</a> |
                  <a href="https://apparelcast.shop/track-order" style="color: #1a56db; text-decoration: none;">Track Order</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(shippingData: ShippingEmailData) {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: `${SENDER.name} <${SENDER.email}>`,
      to: shippingData.customerEmail,
      subject: `Your Order is on the Way! - ${shippingData.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #16a34a; color: #fff; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px 20px; }
              .tracking-box { background: #fff; padding: 25px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
              .tracking-number { font-size: 24px; font-weight: bold; color: #1a56db; margin: 15px 0; font-family: monospace; background: #f0f7ff; padding: 15px; border-radius: 5px; }
              .button { display: inline-block; background: #16a34a; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .icon { font-size: 50px; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="icon">📦</div>
                <h1>Your Order Has Shipped!</h1>
              </div>
              
              <div class="content">
                <p>Hi ${shippingData.customerName},</p>
                <p>Exciting news! Your order <strong>#${shippingData.orderNumber}</strong> has been shipped and is on its way to you.</p>

                <div class="tracking-box">
                  <h3 style="margin-top: 0; color: #555;">Tracking Information</h3>
                  <p style="color: #666; margin: 10px 0;">Carrier: <strong>${shippingData.carrier}</strong></p>
                  <div class="tracking-number">
                    ${shippingData.trackingNumber}
                  </div>
                  ${shippingData.estimatedDelivery ? `
                    <p style="color: #666; margin-top: 20px;">
                      <strong>Estimated Delivery:</strong><br>
                      ${shippingData.estimatedDelivery}
                    </p>
                  ` : ''}
                  
                  <a href="https://apparelcast.shop/track-order?ref=${shippingData.orderNumber}" class="button">
                    Track Your Package
                  </a>
                </div>

                <p><strong>What happens next?</strong></p>
                <ul style="line-height: 2;">
                  <li>📦 Your package is in transit</li>
                  <li>🚚 Track it using the number above</li>
                  <li>📬 Sign for delivery when it arrives</li>
                  <li>😊 Enjoy your new items!</li>
                </ul>

                <p style="margin-top: 30px;">If you have any questions about your delivery, please contact us at <a href="mailto:info@apparelcast.shop">info@apparelcast.shop</a></p>
              </div>

              <div class="footer">
                <p><strong>ApparelCast</strong></p>
                <p>© ${new Date().getFullYear()} ApparelCast. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Shipping notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send admin notification for new order
 */
export async function sendAdminOrderNotification(orderData: OrderEmailData) {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email service not configured' };
  }

  const adminEmail = process.env.ADMIN_CONTACT_EMAIL || 'orders@apparelcast.shop';

  try {
    const mailOptions = {
      from: `${SENDER.name} <${SENDER.email}>`,
      to: adminEmail,
      subject: `🛍️ New Order Received - ${orderData.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: #fff; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .order-details { background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; }
              .item { padding: 10px 0; border-bottom: 1px solid #eee; }
              .total { font-size: 18px; font-weight: bold; margin-top: 15px; color: #dc2626; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🎉 New Order Alert!</h2>
              </div>
              
              <div class="content">
                <p><strong>A new order has been placed on ApparelCast!</strong></p>

                <div class="order-details">
                  <p><strong>Order #:</strong> ${orderData.orderNumber}</p>
                  <p><strong>Customer:</strong> ${orderData.customerName}</p>
                  <p><strong>Email:</strong> ${orderData.customerEmail}</p>
                  <p><strong>Total:</strong> R ${orderData.total.toFixed(2)}</p>

                  <h3>Items:</h3>
                  ${orderData.items.map(item => `
                    <div class="item">
                      ${item.name} - Qty: ${item.quantity} × R ${item.price.toFixed(2)}
                    </div>
                  `).join('')}

                  <h3>Shipping Address:</h3>
                  <p style="white-space: pre-line;">${orderData.shippingAddress}</p>
                </div>

                <p><strong>Action Required:</strong> Please process this order in the admin dashboard.</p>
                <p><a href="https://apparelcast.shop/admin" style="color: #dc2626;">Go to Admin Dashboard →</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(testEmail: string) {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: `${SENDER.name} <${SENDER.email}>`,
      to: testEmail,
      subject: 'ApparelCast Email Test',
      html: `
        <h2>✓ Email Configuration Successful!</h2>
        <p>If you're reading this, your Zoho email integration is working correctly.</p>
        <p><strong>Sender:</strong> ${SENDER.name} &lt;${SENDER.email}&gt;</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Next steps:</strong> You can now send transactional emails from your ApparelCast store!</p>
      `,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Test email failed:', error);
    return { success: false, error: error.message };
  }
}

export default {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendAdminOrderNotification,
  testEmailConfiguration,
};

