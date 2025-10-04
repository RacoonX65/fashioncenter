# Brevo (Sendinblue) Email Setup Guide

## Why Brevo?
Brevo (formerly Sendinblue) is perfect for transactional emails with:
- ✅ **300 emails per day FREE** (9,000/month)
- ✅ Professional email templates
- ✅ High deliverability rates
- ✅ Easy to set up
- ✅ Perfect for order confirmations, shipping notifications

## Step-by-Step Setup

### 1. Create a Brevo Account

1. Go to https://www.brevo.com
2. Click "Sign up free"
3. Fill in your details
4. Verify your email address

### 2. Get Your API Key

1. Log into your Brevo dashboard
2. Click your profile name (top right)
3. Go to **"SMTP & API"**
4. Click **"API Keys"** tab
5. Click **"Create a new API key"**
6. Give it a name: "FashionCenter Production"
7. Copy the API key (you'll only see it once!)

### 3. Configure Your .env.local File

Add these to your `.env.local` file:

```env
# Brevo Email Configuration
BREVO_API_KEY=your_api_key_here
BREVO_SENDER_EMAIL=noreply@fashioncenter.co.za

# Admin emails for order notifications
ADMIN_EMAIL_1=your_email@example.com
ADMIN_EMAIL_2=sister1_email@example.com
ADMIN_EMAIL_3=sister2_email@example.com
```

### 4. Verify Your Sender Email (Important!)

For emails to be sent successfully, you need to verify your sender domain:

#### Option A: Use Your Own Domain (Recommended)
1. In Brevo, go to **"Senders, Domains & Dedicated IPs"**
2. Click **"Add a domain"**
3. Enter your domain: `fashioncenter.co.za`
4. Follow the DNS verification steps (add SPF, DKIM records)
5. Wait for verification (usually 24-48 hours)

#### Option B: Use Brevo's Domain (Temporary)
1. Use `your-email@sendinblue.com` as sender email
2. This works immediately but looks less professional
3. Recommended only for testing

### 5. Test Your Email Setup

Run this test in your browser console or create a test page:

```javascript
// Test order confirmation email
const testOrderData = {
  orderNumber: 'TEST-001',
  customerName: 'Test Customer',
  customerEmail: 'your-test-email@example.com',
  total: 500.00,
  items: [
    { name: 'Test Product', quantity: 2, price: 250.00 }
  ],
  shippingAddress: '123 Test Street, Johannesburg, 2000'
};

// Send test email (you'll need to create an API endpoint for this)
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testOrderData)
});
```

## Email Types Your Store Will Send

### 1. Order Confirmation (To Customer)
- Sent immediately when order is placed
- Includes order details, items, total
- Contains order tracking link

### 2. Admin Notification (To You & Sisters)
- Sent to all admin emails when order is placed
- Includes customer details and order items
- Link to admin dashboard

### 3. Shipping Notification (To Customer)
- Sent when order is marked as shipped
- Includes tracking number and courier info
- Link to track package

### 4. Delivery Confirmation (To Customer)
- Sent when order is delivered
- Thanks customer and invites them to shop again

## Usage & Pricing

### Free Plan
- **300 emails/day** = 9,000/month
- Perfect for starting out
- Covers 100-200 orders/month easily

### Calculation Example
If you get **100 orders per month**:
- 100 order confirmations to customers
- 100 admin notifications
- 100 shipping notifications
- 100 delivery confirmations
**Total: 400 emails/month** (well under 9,000 limit!)

### Paid Plans (If You Grow)
- **Lite Plan**: $25/month for 20,000 emails
- **Premium Plan**: $65/month for 20,000 emails + marketing automation

## Email Best Practices

1. **Verify Your Domain** for better deliverability
2. **Use a Professional Sender Name**: "FashionCenter" not "noreply"
3. **Keep Subject Lines Clear**: "Order Confirmation #12345"
4. **Include Unsubscribe Link** (Brevo adds this automatically)
5. **Test Emails** before going live

## Monitoring Your Emails

In Brevo Dashboard:
1. Go to **"Statistics"** > **"Email"**
2. See:
   - Emails sent
   - Delivery rate
   - Open rate
   - Click rate

## Troubleshooting

### Emails Not Sending?
- ✅ Check API key is correct
- ✅ Verify sender email is authenticated
- ✅ Check daily limit (300/day on free plan)
- ✅ Look at Brevo logs for errors

### Emails Going to Spam?
- Verify your domain with SPF/DKIM
- Avoid spam trigger words
- Include physical address in footer
- Use consistent "From" name and email

## Alternative: Keep It Simple

If you want to start even simpler:
1. Use Gmail SMTP temporarily
2. Or manually send emails for first orders
3. Add Brevo later as you grow

## Support

- Brevo Docs: https://developers.brevo.com
- Brevo Support: support@brevo.com
- Live Chat available in dashboard

## Ready to Use!

Once configured, your FashionCenter store will automatically:
- ✅ Send order confirmations to customers
- ✅ Notify you & your sisters of new orders
- ✅ Send shipping updates with tracking
- ✅ Confirm deliveries

All emails are professionally designed with your branding! 📧✨
