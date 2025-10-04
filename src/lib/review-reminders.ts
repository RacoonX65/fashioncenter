/**
 * Automated Review Reminders
 * Send reminders to customers who haven't left reviews
 */

import { supabase } from './supabase';
import { sendReviewReminderEmail } from './review-emails';

/**
 * Find customers who need review reminders
 * (requested 7+ days ago, not yet completed)
 */
export async function findCustomersNeedingReminders() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const { data: requests, error } = await supabase
    .from('review_requests')
    .select(`
      *,
      orders(customer_info, items)
    `)
    .eq('completed', false)
    .is('reminded_at', null)
    .lte('requested_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Error finding review requests:', error);
    return [];
  }

  return requests || [];
}

/**
 * Send review reminder to a customer
 */
export async function sendReviewReminder(reviewRequest: any) {
  try {
    const order = reviewRequest.orders;
    if (!order) {
      console.error('Order not found for review request:', reviewRequest.id);
      return;
    }

    // Get product details
    const product = order.items.find((item: any) => item.product_id === reviewRequest.product_id);
    if (!product) {
      console.error('Product not found in order items');
      return;
    }

    // Send reminder email
    await sendReviewReminderEmail({
      customerName: order.customer_info.name,
      customerEmail: reviewRequest.customer_email,
      orderNumber: reviewRequest.order_id.substring(0, 8),
      products: [{
        id: product.product_id,
        name: product.name,
        image: product.image
      }]
    });

    // Mark as reminded
    await supabase
      .from('review_requests')
      .update({ reminded_at: new Date().toISOString() })
      .eq('id', reviewRequest.id);

    console.log('Review reminder sent to:', reviewRequest.customer_email);
  } catch (error) {
    console.error('Error sending review reminder:', error);
  }
}

/**
 * Process all pending review reminders
 * (This should be run as a cron job daily)
 */
export async function processReviewReminders() {
  console.log('Processing review reminders...');

  const requests = await findCustomersNeedingReminders();
  console.log(`Found ${requests.length} customers needing reminders`);

  for (const request of requests) {
    await sendReviewReminder(request);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Review reminders processed successfully');
}

export default {
  findCustomersNeedingReminders,
  sendReviewReminder,
  processReviewReminders
};

