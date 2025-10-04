# Product Reviews System - FashionCenter

## Overview
A complete review system that helps build trust and increase conversions by showing authentic customer feedback.

## ✨ Features

### Customer Features:
- ✅ **Leave Reviews** - Only for purchased products
- ✅ **Star Ratings** - 1-5 star rating system
- ✅ **Verified Purchase Badge** - Shows authentic reviews
- ✅ **Helpful Votes** - Mark reviews as helpful
- ✅ **Review Incentive** - Get 10% discount code after reviewing

### Admin Features:
- ✅ **Review Moderation** - Approve/reject reviews
- ✅ **Request Reviews** - Send requests to customers
- ✅ **Automated Reminders** - Follow-up emails after 7 days
- ✅ **Analytics** - View rating distribution

## 📊 How It Works

### 1. Automatic Review Requests
After order is marked as **"Delivered"**:
1. System waits 2 days for customer to receive & try product
2. Automatic email sent: "How was your order? Leave a review!"
3. Email includes link to review page
4. Customer can rate & review each product

### 2. Review Submission
Customer can:
- Rate product 1-5 stars ⭐
- Write review title (optional)
- Write detailed comment (minimum 10 characters)
- Submit review

### 3. Review Moderation (Admin)
You & your sisters can:
- View all pending reviews
- **Approve** - Publish review on product page
- **Reject** - Hide inappropriate reviews
- Reviews appear on product pages once approved

### 4. Manual Review Requests (Admin)
Send review requests manually:
- Go to Admin → Reviews → Request Reviews tab
- See customers who haven't left reviews
- Click "Send Reminder" to request review
- Customer receives email with review link

## 🗄️ Database Setup

Run this SQL in your Supabase dashboard:

```sql
-- Copy contents from database/reviews-schema.sql
```

This creates:
- **reviews** table - Stores customer reviews
- **review_requests** table - Tracks review requests
- **product_ratings** view - Aggregates ratings per product

## 📧 Email Integration

### Automatic Emails Sent:

1. **Review Request** (2 days after delivery)
   - Subject: "How was your FashionCenter order? ⭐"
   - Contains: Product details, review link, incentive

2. **Review Reminder** (7 days after first request)
   - Subject: "Quick reminder: Share your review 💙"
   - Contains: Quick review link, 10% discount offer

3. **Admin Manual Request**
   - Subject: "We'd love to hear about your experience!"
   - Personalized message from you

### Email Setup:
All emails sent via Brevo (already configured!)
- Uses your existing Brevo account
- Professional HTML templates
- Automatic delivery after order status changes

## 📍 Where Reviews Appear

### Product Page:
- Average rating (e.g., 4.8 ⭐)
- Total review count
- Rating distribution chart
- Individual reviews with:
  - Customer name
  - Star rating
  - Review title & comment
  - Verified purchase badge
  - Helpful count
  - Date posted

### Product Listings:
- Star rating shown on product cards
- Helps customers make decisions

## 🎯 Review Workflow

```
Order Delivered
    ↓
Wait 2 Days
    ↓
Send Review Request Email
    ↓
Customer Clicks Link
    ↓
Fill Review Form
    ↓
Submit Review
    ↓
Admin Reviews (Pending)
    ↓
Approve ✅ or Reject ❌
    ↓
Published on Product Page
    ↓
Customer Gets 10% Code 🎁
```

## 🎁 Review Incentive System

**Why give discounts?**
- Increases review submission rate by 50%+
- Encourages repeat purchases
- Builds customer loyalty

**How it works:**
1. Customer submits review
2. System sends thank you email
3. Email includes unique 10% discount code
4. Code valid for 30 days

## 💡 Best Practices

### For Getting More Reviews:

1. **Timing Matters**
   - Send requests 2-3 days after delivery
   - Gives customers time to try product
   - Don't wait too long (max 7 days)

2. **Incentivize**
   - Offer discount code
   - Enter into monthly prize draw
   - Show appreciation

3. **Make It Easy**
   - One-click review link in email
   - Simple form (rating + comment)
   - Mobile-friendly

4. **Follow Up**
   - Send one reminder after 7 days
   - Don't spam (max 2 emails)
   - Use friendly tone

### For Managing Reviews:

1. **Respond Promptly**
   - Review pending reviews daily
   - Approve legitimate reviews quickly
   - Shows you're actively engaged

2. **Handle Negative Reviews Well**
   - Approve honest negative reviews (shows authenticity)
   - Respond professionally
   - Offer to resolve issues
   - Turn negatives into positives

3. **Showcase Reviews**
   - Feature best reviews on homepage
   - Use in social media
   - Include in product descriptions

4. **Monitor Trends**
   - Watch for common complaints
   - Identify popular products
   - Improve based on feedback

## 📈 Review Statistics

Track in Admin Dashboard:
- Average rating per product
- Total reviews count
- Review submission rate
- Most helpful reviews
- Products needing reviews

## 🚀 Implementation Steps

### 1. Set Up Database
```sql
-- Run reviews-schema.sql in Supabase
```

### 2. Configure Brevo Email
Already done! ✅ Uses existing Brevo account

### 3. Test Review Flow
1. Place test order
2. Mark as delivered
3. Check for review request email
4. Submit test review
5. Verify in admin panel

### 4. Train Your Sisters
Show them how to:
- View pending reviews
- Approve/reject reviews
- Send manual review requests
- Respond to reviews

## ⚙️ Configuration Options

### Timing Settings (in your code):
```typescript
// When to send first review request
REVIEW_REQUEST_DELAY = 2 days after delivery

// When to send reminder
REVIEW_REMINDER_DELAY = 7 days after first request

// Discount code validity
DISCOUNT_CODE_VALIDITY = 30 days
```

### Review Requirements:
- Minimum comment length: 10 characters
- Must have purchased product
- One review per product per customer
- Rating required (1-5 stars)

## 🛡️ Spam Prevention

- ✅ Verified purchase only
- ✅ One review per product
- ✅ Manual admin approval
- ✅ Minimum comment length
- ✅ Email verification

## 📱 Mobile Responsive
- Review form works on phone
- Easy to tap stars
- Large text areas
- One-handed use

## 🎨 Display Customization

Reviews display includes:
- Star ratings (yellow)
- Verified badge (green)
- Customer name
- Review date
- Helpful votes
- Rating distribution chart

Match your store's color scheme! 💙

## 💬 Example Review Request Email

```
Subject: How was your FashionCenter order? Share your review! ⭐

Hi [Customer Name],

Thank you for your recent order from FashionCenter! 
We hope you're loving your new items. 💙

Your opinion matters! Help other shoppers by sharing 
your experience with the products you purchased.

[Leave a Review Button]

As a thank you, we'll send you a special 10% discount 
code once you submit your review!

Thank you for being a valued FashionCenter customer!
```

## 🔗 Important Links

**Admin:**
- Review Management: /admin/reviews
- Pending Reviews: /admin/reviews?tab=pending
- Request Reviews: /admin/reviews?tab=requests

**Customer:**
- Leave Review: /orders/[orderNumber]/review
- View Reviews: /products/[productId] (scroll to reviews)

## 📊 Success Metrics

Track these KPIs:
- **Review Rate**: % of delivered orders with reviews
- **Average Rating**: Overall store rating
- **Response Time**: How quickly you approve reviews
- **Conversion Impact**: Do reviews increase sales?

**Target Goals:**
- 20-30% review rate (industry average)
- 4.0+ average rating
- Approve reviews within 24 hours

## 🚨 Troubleshooting

**Reviews not sending?**
- Check Brevo API key in .env.local
- Verify email templates are set up
- Check order status is "Delivered"

**Can't approve reviews?**
- Verify admin permissions
- Check database connection
- Refresh admin dashboard

**Customer can't leave review?**
- Verify order was delivered
- Check they haven't already reviewed
- Ensure product ID is correct

## 🎉 Launch Checklist

Before going live:
- [ ] Run database migrations
- [ ] Test review submission
- [ ] Test email sending
- [ ] Configure review settings
- [ ] Train admins on moderation
- [ ] Add reviews section to product pages
- [ ] Test on mobile devices
- [ ] Set up review reminders

## 💡 Pro Tips

1. **Respond to Reviews**
   - Thank customers for positive reviews
   - Address concerns in negative reviews
   - Shows you care!

2. **Feature Reviews**
   - Screenshot best reviews for Instagram
   - Use in ads & marketing
   - Show on homepage

3. **Learn & Improve**
   - Read all reviews weekly
   - Identify product issues
   - Improve based on feedback

4. **Gamify Reviews**
   - Monthly "Reviewer of the Month"
   - Feature helpful reviewers
   - Build community

---

## Need Help?

Questions about the review system? Check:
- BREVO_SETUP.md for email configuration
- SUPABASE_SETUP.md for database setup
- Contact support if needed

Happy reviewing! ⭐⭐⭐⭐⭐
