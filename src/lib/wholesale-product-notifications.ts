/**
 * Wholesale Product Notifications
 * Send emails to wholesale customers about new products
 */

import * as brevo from '@getbrevo/brevo';
import { supabase } from './supabase';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

interface Product {
  id: string;
  name: string;
  description: string;
  regular_price: number;
  category: string;
  images: string[];
}

interface WholesaleCustomer {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  wholesale_code: string;
  discount_percentage: number;
  tier_name: string;
}

interface BulkPricingTier {
  min_quantity: number;
  max_quantity: number | null;
  discount_percentage: number;
  tier_name: string;
}

/**
 * Notify all wholesale customers about a new product
 */
export async function notifyWholesaleCustomersNewProduct(product: Product) {
  try {
    // Get all active wholesale customers
    const { data: customers, error: customersError } = await supabase
      .from('wholesale_customers')
      .select(`
        *,
        bulk_tiers(name, discount_percentage)
      `)
      .eq('is_active', true);

    if (customersError) throw customersError;
    if (!customers || customers.length === 0) {
      console.log('No wholesale customers to notify');
      return { success: true, count: 0 };
    }

    // Get bulk pricing tiers for this product
    const { data: bulkPricing, error: pricingError } = await supabase
      .from('product_bulk_pricing')
      .select('*')
      .eq('product_id', product.id)
      .order('min_quantity', { ascending: true });

    if (pricingError) throw pricingError;

    // Send email to each customer
    const results = await Promise.allSettled(
      customers.map(customer => 
        sendNewProductEmail(product, customer, bulkPricing || [])
      )
    );

    // Log notifications
    const notificationRecords = customers.map(customer => ({
      product_id: product.id,
      wholesale_customer_id: customer.id,
      notification_type: 'new_product',
      sent_at: new Date().toISOString()
    }));

    await supabase
      .from('wholesale_product_notifications')
      .insert(notificationRecords);

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Sent new product notifications: ${successCount}/${customers.length}`);
    return { success: true, count: successCount, total: customers.length };
  } catch (error: any) {
    console.error('Error notifying wholesale customers:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send new product email to individual customer
 */
async function sendNewProductEmail(
  product: Product,
  customer: any,
  bulkPricing: BulkPricingTier[]
) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    // Calculate prices for this customer
    const wholesalePrice = product.regular_price * (1 - customer.discount_percentage / 100);
    const savings = product.regular_price - wholesalePrice;

    // Generate bulk pricing table HTML
    const bulkPricingRows = bulkPricing.map(tier => {
      const tierDiscount = customer.discount_percentage + tier.discount_percentage;
      const tierPrice = product.regular_price * (1 - tierDiscount / 100);
      const tierSavings = product.regular_price - tierPrice;
      
      return `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; text-align: center;">
            <strong>${tier.min_quantity}${tier.max_quantity ? `-${tier.max_quantity}` : '+'} items</strong>
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="color: #059669; font-weight: bold;">${tierDiscount}% OFF</span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <strong style="font-size: 18px;">R${tierPrice.toFixed(2)}</strong><br>
            <span style="font-size: 12px; color: #666;">per item</span>
          </td>
          <td style="padding: 12px; text-align: center; color: #059669;">
            Save R${tierSavings.toFixed(2)}/item
          </td>
        </tr>
      `;
    }).join('');

    sendSmtpEmail.subject = `🆕 New Product Alert: ${product.name} - ${customer.discount_percentage}% OFF!`;
    sendSmtpEmail.to = [{ email: customer.email, name: customer.contact_person }];
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
            .product-image { width: 100%; max-width: 400px; height: 300px; object-fit: cover; border-radius: 10px; margin: 20px 0; }
            .price-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid #5680a5; }
            .bulk-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .bulk-table th { background: #2c3d50; color: white; padding: 15px; text-align: center; }
            .button { background: #5680a5; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .badge { background: #059669; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🆕 NEW PRODUCT ALERT!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Exclusive wholesale pricing just for you</p>
            </div>
            
            <div class="content">
              <p>Hi ${customer.contact_person},</p>
              
              <p><strong>Exciting news for ${customer.business_name}!</strong> We just added a new product to our store that's now available for bulk ordering with your <span class="badge">${customer.discount_percentage}% VIP DISCOUNT</span></p>
              
              <div style="text-align: center; margin: 30px 0;">
                ${product.images && product.images.length > 0 ? `
                  <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                ` : `
                  <div style="width: 100%; max-width: 400px; height: 300px; background: #f0f0f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 20px auto; color: #999;">
                    <p>Product Image</p>
                  </div>
                `}
              </div>
              
              <h2 style="color: #2c3d50; margin-top: 25px;">${product.name}</h2>
              <p style="color: #666; font-size: 16px;">${product.description || 'Premium quality fashion item'}</p>
              
              <div class="price-box">
                <p style="margin: 0; font-size: 14px; color: #666; text-decoration: line-through;">Regular Price: R${product.regular_price.toFixed(2)}</p>
                <h3 style="margin: 10px 0; font-size: 32px; color: #2c3d50;">R${wholesalePrice.toFixed(2)}</h3>
                <p style="margin: 0; color: #059669; font-weight: bold; font-size: 16px;">YOU SAVE R${savings.toFixed(2)} (${customer.discount_percentage}% OFF)</p>
                <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">Your ${customer.bulk_tiers.name} price</p>
              </div>
              
              ${bulkPricing.length > 0 ? `
                <h3 style="color: #2c3d50; margin-top: 35px; text-align: center;">💎 BULK PRICING TIERS</h3>
                <p style="text-align: center; color: #666; margin-bottom: 20px;">Save even MORE when you buy in bulk!</p>
                
                <table class="bulk-table">
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Total Discount</th>
                      <th>Price Per Item</th>
                      <th>Your Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${bulkPricingRows}
                  </tbody>
                </table>
                
                <div style="background: #e7f3ff; border-left: 4px solid #5680a5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <p style="margin: 0; font-size: 14px;"><strong>💡 Smart Tip:</strong> The more you buy, the more you save! Discounts stack with your wholesale tier.</p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://fashioncenter.co.za'}/wholesale/shop/${product.id}?code=${customer.wholesale_code}" class="button">
                  Order Now - ${customer.discount_percentage}% OFF 🛍️
                </a>
              </div>
              
              <div style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center; color: white;">
                <h3 style="margin: 0 0 10px 0;">📱 Shared in WhatsApp VIP Group!</h3>
                <p style="margin: 0; font-size: 14px;">Check your WhatsApp VIP group for quick access and discuss with other members!</p>
              </div>
              
              <div style="border-top: 2px dashed #e0e0e0; margin: 30px 0; padding-top: 20px;">
                <p style="font-size: 13px; color: #666; margin: 0;">
                  <strong>Your Wholesale Code:</strong> <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 5px; font-size: 14px;">${customer.wholesale_code}</code><br>
                  <em>Use at checkout for your ${customer.discount_percentage}% discount</em>
                </p>
              </div>
              
              <h3 style="color: #2c3d50; margin-top: 30px;">📦 Why Order Now?</h3>
              <ul style="color: #666;">
                <li>✨ <strong>First Access</strong> - You're seeing this before the public!</li>
                <li>💰 <strong>Best Prices</strong> - Your VIP wholesale discount applied</li>
                <li>📦 <strong>Bulk Quantities</strong> - Stock available in large quantities</li>
                <li>🚀 <strong>Fast Delivery</strong> - Priority processing for wholesale orders</li>
                <li>💎 <strong>Stack Savings</strong> - Combine wholesale + bulk discounts</li>
              </ul>
              
              <p style="margin-top: 30px;">Questions about this product or need custom quantities? Reply to this email or contact our wholesale team!</p>
              
              <p><strong>Happy Selling!</strong><br>
              FashionCenter Wholesale Team 💙</p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} FashionCenter Wholesale</p>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/wholesale/shop" style="color: #5680a5; text-decoration: none;">Browse All Products</a> | 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/wholesale/portal" style="color: #5680a5; text-decoration: none;">Your Portal</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`New product email sent to: ${customer.email}`);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error(`Error sending email to ${customer.email}:`, error);
    return { success: false, error: error.message };
  }
}

export default {
  notifyWholesaleCustomersNewProduct
};

