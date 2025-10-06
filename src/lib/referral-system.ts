/**
 * Referral Program System
 * Allow customers to refer friends and earn rewards
 */

import { supabase } from './supabase';
import { createReferralCodes, generateDiscountCode } from './discount-codes';
import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

/**
 * Create a referral code for a customer
 */
export async function createReferralLink(customerEmail: string, customerId?: string) {
  // Generate unique referral code
  const referralCode = generateDiscountCode('', 8);
  
  // Create referral entry
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: customerId || null,
      referrer_email: customerEmail,
      referrer_code: referralCode,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating referral:', error);
    throw new Error('Failed to create referral code');
  }

  // Generate referral link
  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://apparelcast.shop'}/ref/${referralCode}`;

  return {
    referralCode,
    referralLink,
    referral: data
  };
}

/**
 * Track when someone uses a referral link
 */
export async function trackReferral(referralCode: string, refereeEmail: string) {
  // Find the referral
  const { data: referral, error: findError } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_code', referralCode)
    .single();

  if (findError || !referral) {
    return { success: false, message: 'Invalid referral code' };
  }

  // Check if referee already has an account (can't refer existing customers)
  const { data: existingCustomer } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_info->>email', refereeEmail)
    .limit(1);

  if (existingCustomer && existingCustomer.length > 0) {
    return { success: false, message: 'This customer already exists' };
  }

  // Generate discount codes for both parties
  const { refereeCode, referrerCode } = await createReferralCodes(
    referral.referrer_email,
    refereeEmail
  );

  // Update referral with referee info
  const { error: updateError } = await supabase
    .from('referrals')
    .update({
      referee_email: refereeEmail,
      referee_discount_code: refereeCode,
      referrer_discount_code: referrerCode,
      status: 'completed'
    })
    .eq('id', referral.id);

  if (updateError) {
    console.error('Error updating referral:', updateError);
    return { success: false, message: 'Failed to process referral' };
  }

  // Send welcome email to referee with their discount code
  await sendRefereeWelcomeEmail(refereeEmail, refereeCode, referral.referrer_email);

  // Send reward email to referrer
  await sendReferrerRewardEmail(referral.referrer_email, referrerCode);

  return {
    success: true,
    message: 'Referral successful! Check your email for discount codes.',
    refereeCode,
    referrerCode
  };
}

/**
 * Complete referral when referee makes first purchase
 */
export async function completeReferral(refereeEmail: string, orderId: string) {
  const { data: referral, error } = await supabase
    .from('referrals')
    .update({
      completed_at: new Date().toISOString(),
      status: 'rewarded'
    })
    .eq('referee_email', refereeEmail)
    .eq('status', 'completed')
    .select()
    .single();

  if (error || !referral) {
    console.log('No referral to complete for:', refereeEmail);
    return;
  }

  console.log('Referral completed:', referral);
}

/**
 * Send welcome email to person who was referred
 */
async function sendRefereeWelcomeEmail(
  refereeEmail: string,
  discountCode: string,
  referrerEmail: string
) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Welcome to FashionCenter! Here's your 15% discount! 🎁`;
    sendSmtpEmail.to = [{ email: refereeEmail }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #5680a5 100%); color: #fff; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 40px 30px; }
            .code-box { background: #fff; border: 3px dashed #5680a5; padding: 20px; margin: 25px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #2c3d50; letter-spacing: 3px; }
            .button { background: #5680a5; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to FashionCenter!</h1>
              <p style="font-size: 18px; margin-top: 10px;">Your friend ${referrerEmail} invited you!</p>
            </div>
            <div class="content">
              <p>Hi there! 👋</p>
              
              <p>Welcome to FashionCenter! We're thrilled to have you join our fashion family.</p>
              
              <p><strong>As a special welcome gift, we're giving you 15% OFF your first order!</strong></p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">YOUR DISCOUNT CODE:</p>
                <div class="code">${discountCode}</div>
                <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">Valid for 60 days • Minimum R500 purchase</p>
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://apparelcast.shop'}/products" class="button">
                  Start Shopping Now! 🛍️
                </a>
              </p>
              
              <p><strong>Why shop with FashionCenter?</strong></p>
              <ul>
                <li>✨ Latest fashion trends</li>
                <li>🚚 Fast shipping across South Africa</li>
                <li>💯 Quality guaranteed</li>
                <li>❤️ Easy returns & exchanges</li>
              </ul>
              
              <p>Don't forget to use your code <strong>${discountCode}</strong> at checkout!</p>
              
              <p>Happy shopping! 💙</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Welcome email sent to referee:', refereeEmail);
  } catch (error: any) {
    console.error('Error sending referee welcome email:', error);
  }
}

/**
 * Send reward email to person who referred
 */
async function sendReferrerRewardEmail(referrerEmail: string, discountCode: string) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Thanks for referring a friend! Here's your reward! 🎁`;
    sendSmtpEmail.to = [{ email: referrerEmail }];
    sendSmtpEmail.sender = {
      name: 'FashionCenter',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@apparelcast.shop'
    };
    
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2c3d50 0%, #5680a5 100%); color: #fff; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 40px 30px; }
            .code-box { background: #fff; border: 3px dashed #5680a5; padding: 20px; margin: 25px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #2c3d50; letter-spacing: 3px; }
            .button { background: #5680a5; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Thank You for Sharing FashionCenter!</h1>
            </div>
            <div class="content">
              <p>Hi there! 👋</p>
              
              <p><strong>Your friend just signed up using your referral link!</strong> 🎊</p>
              
              <p>As a thank you for spreading the word about FashionCenter, here's a special 10% discount code just for you:</p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">YOUR REWARD CODE:</p>
                <div class="code">${discountCode}</div>
                <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">Valid for 60 days</p>
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://apparelcast.shop'}/products" class="button">
                  Treat Yourself! 🛍️
                </a>
              </p>
              
              <p><strong>Keep sharing and keep earning!</strong></p>
              <p>Every friend you refer gets 15% off, and you get 10% off! There's no limit to how many people you can refer. 💰</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://apparelcast.shop'}/account/referrals" style="color: #5680a5; text-decoration: none;">
                  View Your Referral Dashboard →
                </a>
              </p>
              
              <p>Thank you for being an amazing FashionCenter customer! 💙</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Reward email sent to referrer:', referrerEmail);
  } catch (error: any) {
    console.error('Error sending referrer reward email:', error);
  }
}

/**
 * Get referral stats for a customer
 */
export async function getReferralStats(customerEmail: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_email', customerEmail)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referral stats:', error);
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      referrals: []
    };
  }

  return {
    totalReferrals: data.length,
    completedReferrals: data.filter(r => r.status === 'completed' || r.status === 'rewarded').length,
    pendingReferrals: data.filter(r => r.status === 'pending').length,
    referrals: data
  };
}

export default {
  createReferralLink,
  trackReferral,
  completeReferral,
  getReferralStats
};

