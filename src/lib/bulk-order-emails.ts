/**
 * Bulk Order / Wholesale Email Notifications
 */

import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

interface ApprovalEmailData {
  businessName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  wholesaleCode: string;
  tierName: string;
  discountPercentage: number;
  minItems: number;
  maxItems?: number;
}

interface RejectionEmailData {
  businessName: string;
  contactPerson: string;
  email: string;
  tierName: string;
  rejectionReason?: string;
}

interface ApplicationReceivedEmailData {
  businessName: string;
  contactPerson: string;
  email: string;
  tierName: string;
}

/**
 * Send wholesale application approval email
 */
export async function sendWholesaleApprovalEmail(data: ApprovalEmailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `🎉 Your Wholesale Application is Approved!`;
    sendSmtpEmail.to = [{ email: data.email, name: data.contactPerson }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter Wholesale',
      email: process.env.BREVO_SENDER_EMAIL || 'wholesale@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #5680a5 100%); color: #fff; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; }
            .code-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 3px dashed #5680a5; padding: 25px; margin: 25px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #2c3d50; letter-spacing: 3px; font-family: 'Courier New', monospace; }
            .button { background: #5680a5; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .benefit { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #5680a5; border-radius: 5px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Your Wholesale Application is Approved</p>
            </div>
            <div class="content">
              <p>Hi ${data.contactPerson},</p>
              
              <p><strong>Great news!</strong> We're thrilled to welcome <strong>${data.businessName}</strong> to our wholesale program!</p>
              
              <p>You've been approved for our <strong>${data.tierName}</strong> tier with <strong>${data.discountPercentage}% OFF</strong> all orders!</p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Your Exclusive Wholesale Code</p>
                <div class="code">${data.wholesaleCode}</div>
                <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">Save this code - you'll use it at checkout!</p>
              </div>
              
              <h3 style="color: #2c3d50; margin-top: 30px;">📦 Your Wholesale Benefits:</h3>
              
              <div class="benefit">
                <strong>💰 ${data.discountPercentage}% OFF All Orders</strong><br>
                Exclusive wholesale pricing on every purchase
              </div>
              
              <div class="benefit">
                <strong>📈 Order Requirement:</strong><br>
                ${data.minItems}${data.maxItems ? `-${data.maxItems}` : '+'} items per order
              </div>
              
              <div class="benefit">
                <strong>♾️ Unlimited Use</strong><br>
                Use your code as many times as you want - no expiry!
              </div>
              
              <div class="benefit">
                <strong>🎯 Priority Support</strong><br>
                Dedicated support for all your wholesale needs
              </div>
              
              <h3 style="color: #2c3d50; margin-top: 30px;">🛍️ How to Place Your First Order:</h3>
              <ol style="padding-left: 20px;">
                <li><strong>Browse our collection</strong> - Choose products you want to stock</li>
                <li><strong>Add to cart</strong> - Select quantities (minimum ${data.minItems} items)</li>
                <li><strong>Enter your code</strong> - Use <code style="background: #f8f9fa; padding: 2px 8px; border-radius: 3px;">${data.wholesaleCode}</code> at checkout</li>
                <li><strong>Enjoy ${data.discountPercentage}% OFF!</strong> - Your discount applies automatically</li>
              </ol>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://fashioncenter.co.za'}/products" class="button">
                  Start Shopping Now! 🛍️
                </a>
              </p>
              
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Bookmark your wholesale portal to track orders and manage your account:</p>
                <p style="margin: 10px 0 0 0;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://fashioncenter.co.za'}/wholesale/portal" style="color: #856404;">View Your Wholesale Portal →</a></p>
              </div>
              
              <div style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; color: white;">
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">🎉 Exclusive WhatsApp VIP Group!</h3>
                <p style="margin: 0 0 20px 0; font-size: 16px; color: rgba(255,255,255,0.95);">
                  You'll be added to our <strong>Wholesale VIP WhatsApp Group</strong> where you'll get:
                </p>
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                  <div style="margin: 12px 0; padding: 10px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                    ✨ <strong>First Access</strong> to exclusive bulk deals
                  </div>
                  <div style="margin: 12px 0; padding: 10px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                    🆕 <strong>New Arrivals</strong> in bulk quantities FIRST
                  </div>
                  <div style="margin: 12px 0; padding: 10px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                    💎 <strong>VIP-Only Promotions</strong> not available to public
                  </div>
                  <div style="margin: 12px 0; padding: 10px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                    🚀 <strong>Priority Stock Alerts</strong> before they sell out
                  </div>
                  <div style="margin: 12px 0; padding: 10px; background: rgba(255,255,255,0.15); border-radius: 8px;">
                    👥 <strong>Network</strong> with other wholesale customers
                  </div>
                </div>
                <p style="margin: 20px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                  📱 <strong>We'll add you within 24 hours!</strong><br>
                  Make sure your WhatsApp number is: <strong>${data.phone || 'on file'}</strong>
                </p>
              </div>
              
              <h3 style="color: #2c3d50; margin-top: 30px;">📞 Need Help?</h3>
              <p>Our wholesale team is here for you:</p>
              <ul style="list-style: none; padding: 0;">
                <li>📧 Email: <a href="mailto:wholesale@fashioncenter.co.za" style="color: #5680a5;">wholesale@fashioncenter.co.za</a></li>
                <li>📱 WhatsApp: +27 (0) 12 345 6789</li>
                <li>⏰ Support Hours: Mon-Fri, 8am-5pm SAST</li>
              </ul>
              
              <p style="margin-top: 30px;">We're excited to partner with you and help grow your business!</p>
              
              <p><strong>Welcome to the FashionCenter Wholesale Family! 💙</strong></p>
              
              <p>Best regards,<br>
              <strong>FashionCenter Wholesale Team</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} FashionCenter. All rights reserved.</p>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">This is an automated email. Your wholesale code: <strong>${data.wholesaleCode}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Wholesale approval email sent to:', data.email);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending wholesale approval email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send wholesale application rejection email
 */
export async function sendWholesaleRejectionEmail(data: RejectionEmailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Update on Your Wholesale Application`;
    sendSmtpEmail.to = [{ email: data.email, name: data.contactPerson }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter Wholesale',
      email: process.env.BREVO_SENDER_EMAIL || 'wholesale@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: #fff; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { background: #5680a5; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 15px 0; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Update on Your Wholesale Application</h2>
            </div>
            <div class="content">
              <p>Hi ${data.contactPerson},</p>
              
              <p>Thank you for your interest in the FashionCenter wholesale program.</p>
              
              <p>After careful review, we're unable to approve your wholesale application for the <strong>${data.tierName}</strong> tier at this time.</p>
              
              ${data.rejectionReason ? `
                <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #6c757d; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Reason:</strong> ${data.rejectionReason}</p>
                </div>
              ` : ''}
              
              <h3 style="color: #2c3d50; margin-top: 25px;">You Can Still:</h3>
              <ul>
                <li>✨ Shop our retail collection at regular prices</li>
                <li>🎁 Enjoy our regular sales and promotions</li>
                <li>💌 Subscribe to our newsletter for exclusive deals</li>
                <li>🔄 Reapply in the future as your business grows</li>
              </ul>
              
              <p style="text-align: center; margin: 25px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://fashioncenter.co.za'}/products" class="button">
                  Browse Our Collection
                </a>
              </p>
              
              <div style="background: #e7f3ff; border: 1px solid #5680a5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💡 Tip:</strong> Consider starting with smaller retail orders. Once you establish a track record with us, you're welcome to reapply for wholesale pricing!</p>
              </div>
              
              <p style="margin-top: 25px;">If you have any questions or would like to discuss this decision, please don't hesitate to reach out.</p>
              
              <p><strong>Contact us:</strong><br>
              📧 wholesale@fashioncenter.co.za<br>
              📱 WhatsApp: +27 (0) XX XXX XXXX</p>
              
              <p>Thank you for your understanding.</p>
              
              <p>Best regards,<br>
              <strong>FashionCenter Wholesale Team</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} FashionCenter. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Wholesale rejection email sent to:', data.email);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Error sending wholesale rejection email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send application received confirmation
 */
export async function sendApplicationReceivedEmail(data: ApplicationReceivedEmailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `✅ Wholesale Application Received - ${data.businessName}`;
    sendSmtpEmail.to = [{ email: data.email, name: data.contactPerson }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter Wholesale',
      email: process.env.BREVO_SENDER_EMAIL || 'wholesale@fashioncenter.co.za'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #5680a5 100%); color: #fff; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">✅ Application Received!</h2>
            </div>
            <div class="content">
              <p>Hi ${data.contactPerson},</p>
              
              <p>Thank you for applying to the FashionCenter wholesale program!</p>
              
              <p>We've received your application for the <strong>${data.tierName}</strong> tier.</p>
              
              <h3 style="color: #2c3d50;">What Happens Next?</h3>
              <ol>
                <li><strong>Review (24-48 hours)</strong> - Our team will review your application</li>
                <li><strong>Email Notification</strong> - You'll receive an email with our decision</li>
                <li><strong>Start Ordering</strong> - If approved, you'll get your exclusive wholesale code!</li>
              </ol>
              
              <div style="background: #e7f3ff; border-left: 4px solid #5680a5; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Check your spam/junk folder if you don't hear from us within 48 hours!</p>
              </div>
              
              <p>Questions? Contact us at <a href="mailto:wholesale@fashioncenter.co.za">wholesale@fashioncenter.co.za</a></p>
              
              <p>Best regards,<br>
              <strong>FashionCenter Wholesale Team</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} FashionCenter</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Application received email sent to:', data.email);
  } catch (error: any) {
    console.error('Error sending application received email:', error);
  }
}

export default {
  sendWholesaleApprovalEmail,
  sendWholesaleRejectionEmail,
  sendApplicationReceivedEmail
};

