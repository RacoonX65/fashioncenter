/**
 * Review Request Emails via Brevo
 * Automatically send review requests after delivery
 */

import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

interface ReviewRequestData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  products: {
    id: string;
    name: string;
    image?: string;
  }[];
}

/**
 * Send review request email to customer after delivery
 */
export async function sendReviewRequestEmail(data: ReviewRequestData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `How was your FashionCenter order? Share your review! ⭐`;
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #30465e 100%); color: #fff; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; }
            .product-box { background: #fff; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #5680a5; }
            .stars { font-size: 24px; margin: 10px 0; }
            .button { background: #5680a5; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 15px 0; font-weight: bold; }
            .button:hover { background: #43668a; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⭐ We'd Love Your Feedback!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Thank you for your recent order from FashionCenter! We hope you're loving your new items. 💙</p>
              
              <p><strong>Your opinion matters!</strong> Help other shoppers by sharing your experience with the products you purchased.</p>
              
              ${data.products.map(product => `
                <div class="product-box">
                  <h3>${product.name}</h3>
                  <p>How would you rate this product?</p>
                  <div class="stars">⭐⭐⭐⭐⭐</div>
                  <a href="https://fashioncenter.co.za/orders/${data.orderNumber}/review?product=${product.id}" class="button">Leave a Review</a>
                </div>
              `).join('')}
              
              <p style="margin-top: 20px;">📝 Your review will help us improve and assist other customers in making informed decisions.</p>
              
              <p><strong>As a thank you</strong>, we'll send you a special discount code once you submit your review!</p>
              
              <p>Thank you for being a valued FashionCenter customer!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FashionCenter. All rights reserved.</p>
              <p>If you have any questions, contact us at info@fashioncenter.co.za</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending review request email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send review request reminder (if customer hasn't left a review after 7 days)
 */
export async function sendReviewReminderEmail(data: ReviewRequestData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Quick reminder: Share your FashionCenter review 💙`;
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #30465e 100%); color: #fff; padding: 25px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 25px 20px; }
            .button { background: #5680a5; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>We Still Want to Hear From You! 💭</h2>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>We noticed you haven't left a review for your recent FashionCenter purchase yet.</p>
              
              <p>Your feedback is incredibly valuable to us and helps other customers make better shopping decisions.</p>
              
              <p>It only takes 2 minutes! ⏱️</p>
              
              <a href="https://fashioncenter.co.za/orders/${data.orderNumber}/review" class="button">Leave Your Review Now</a>
              
              <p style="margin-top: 20px;"><strong>🎁 Bonus:</strong> Get a 10% discount code after submitting your review!</p>
              
              <p>Thank you for shopping with FashionCenter! 💙</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FashionCenter</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending review reminder email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Admin request for review (manual trigger)
 */
export async function sendAdminReviewRequest(data: ReviewRequestData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `We'd love to hear about your FashionCenter experience!`;
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #30465e 100%); color: #fff; padding: 25px 20px; text-align: center; }
            .content { background: #fff; padding: 25px; }
            .button { background: #5680a5; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>💙 Your Opinion Matters to Us!</h2>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>We hope you're enjoying your purchase from FashionCenter!</p>
              
              <p>As a valued customer, we'd really appreciate it if you could take a moment to share your thoughts about the products you ordered.</p>
              
              <p><strong>Why leave a review?</strong></p>
              <ul>
                <li>✨ Help other shoppers make informed decisions</li>
                <li>💬 Share your honest feedback with us</li>
                <li>🎁 Get a special discount code as a thank you!</li>
              </ul>
              
              <a href="https://fashioncenter.co.za/orders/${data.orderNumber}/review" class="button">Share Your Review</a>
              
              <p>Thank you for being part of the FashionCenter family! 🙏</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending admin review request:', error);
    return { success: false, error: error.message };
  }
}

export default {
  sendReviewRequestEmail,
  sendReviewReminderEmail,
  sendAdminReviewRequest,
};
