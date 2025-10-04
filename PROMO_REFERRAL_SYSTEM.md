# 🎁 Promos & Referral System - Complete Guide

## 🎉 FULLY IMPLEMENTED! YOUR COMPLETE MARKETING SYSTEM!

---

## 🚀 WHAT YOU NOW HAVE:

### **1. Discount Code System** ✅
- Create unlimited discount codes
- Percentage off (e.g., 10%, 25%)
- Fixed amount off (e.g., R50 off)
- Free shipping codes
- Usage limits & expiry dates
- Minimum purchase requirements
- Auto-generated codes for reviews & referrals

### **2. Referral Program** ✅
- Customers refer friends = both get discounts!
- Unique referral links for each customer
- **Referee gets 15% off first order**
- **Referrer gets 10% off** when friend buys
- Unlimited referrals (more friends = more discounts!)
- Automatic email notifications
- Referral tracking dashboard

### **3. Review Image Uploads** ✅
- Customers can upload photos with reviews
- Max 5 images per review
- Image size limit: 5MB each
- Stored in Supabase Storage
- Visible on product pages

### **4. Automated Review Reminders** ✅
- Auto-send reminder after 7 days
- Only to customers who haven't reviewed yet
- Runs daily via cron job
- Increases review completion rate

### **5. Promo Campaign Manager** ✅
- Create flash sales
- Seasonal promotions
- Clearance events
- Bundle deals
- Banner campaigns
- Track campaign performance

---

## 💰 DISCOUNT CODE TYPES:

### **1. Percentage Discount**
```
Code: SUMMER25
Type: percentage
Value: 25
Effect: 25% off entire order
```

### **2. Fixed Amount Discount**
```
Code: SAVE50
Type: fixed_amount
Value: 50
Effect: R50 off order
```

### **3. Free Shipping**
```
Code: FREESHIP
Type: free_shipping
Value: 0
Effect: Free shipping (no shipping cost)
```

---

## 🔄 REFERRAL PROGRAM FLOW:

```
1. Customer A joins your store
   ↓
2. Customer A gets unique referral link
   Example: fashioncenter.co.za/ref/ABC12345
   ↓
3. Customer A shares link with Friend B
   ↓
4. Friend B clicks link & signs up
   ↓
5. 🎁 Friend B gets 15% OFF code (REF-XXXXXX)
   ↓
6. 🎁 Customer A gets 10% OFF code (THANKS-XXXXXX)
   ↓
7. Both get email with their codes
   ↓
8. Friend B makes first purchase
   ↓
9. Referral marked as "completed"
   ↓
10. Customer A can refer more friends!
```

---

## 📊 DISCOUNT CODE FEATURES:

### **Usage Limits:**
- **Total usage limit**: Max times code can be used (e.g., first 100 customers)
- **Per-customer limit**: Max times ONE customer can use it (usually 1)
- **No limits**: Set to NULL for unlimited use

### **Requirements:**
- **Minimum purchase**: e.g., "R500 minimum"
- **Applicable to**: all products, specific products, or categories
- **Date range**: Start date & expiry date

### **Tracking:**
- Who used the code
- When it was used
- How much discount was given
- Which order it was used on

---

## 🎨 PROMO CAMPAIGN TYPES:

### **1. Flash Sale** ⚡
```
Name: Weekend Flash Sale
Type: flash_sale
Discount: 25% off everything
Duration: 48 hours
Code: FLASH25
Banner: Show on homepage
```

### **2. Seasonal Sale** 🌸
```
Name: Spring Collection
Type: seasonal
Discount: 20% off spring items
Duration: 30 days
Code: SPRING20
Categories: spring-dresses, spring-jackets
```

### **3. Clearance** 🔥
```
Name: Winter Clearance
Type: clearance
Discount: 50% off
Duration: Until stock lasts
Code: CLEAR50
Products: [specific winter items]
```

### **4. BOGO (Buy One Get One)** 🎁
```
Name: BOGO Jeans
Type: bogo
Discount: 50% on 2nd item
Duration: 7 days
Code: BOGOJEANS
```

---

## 📧 AUTOMATIC EMAILS SENT:

### **1. Review Reward Email**
**When:** After admin approves review
**Content:**
```
Subject: Thank You for Your Review! Here's 10% OFF! 🎁

Your Code: REV-ABC123
Valid: 30 days
Minimum: R300
```

### **2. Referral Welcome Email (to Friend)**
**When:** Friend signs up via referral link
**Content:**
```
Subject: Welcome to FashionCenter! Here's 15% OFF! 🎉

Your Code: REF-XYZ789
Valid: 60 days
Minimum: R500

Your friend [name] invited you!
```

### **3. Referral Reward Email (to Referrer)**
**When:** Friend completes sign-up
**Content:**
```
Subject: Thanks for Referring! Here's 10% OFF! 🎁

Your Code: THANKS-ABC456
Valid: 60 days

Your friend just joined FashionCenter!
Keep referring, keep earning!
```

### **4. Review Reminder**
**When:** 7 days after review request (if not completed)
**Content:**
```
Subject: We Still Want to Hear From You! 💭

Quick reminder to review your recent purchase.
Get 10% OFF after submitting your review!
```

---

## 🗄️ DATABASE TABLES:

### **discount_codes**
```sql
- id
- code (unique, e.g., "SUMMER25")
- type (percentage, fixed_amount, free_shipping)
- value (10 = 10% or R10)
- usage_limit (null = unlimited)
- usage_count (auto-increments)
- per_customer_limit (default: 1)
- minimum_purchase (optional)
- applicable_to (all, specific_products, category)
- starts_at / expires_at
- is_active (true/false)
- source (review, referral, campaign, manual)
```

### **discount_code_usage**
```sql
- id
- discount_code_id
- order_id
- customer_email
- discount_amount
- used_at
```

### **referrals**
```sql
- id
- referrer_email (who refers)
- referrer_code (unique link code)
- referee_email (who was referred)
- referrer_discount_code
- referee_discount_code
- status (pending, completed, rewarded)
- referred_at
- completed_at
- rewarded_at
```

### **campaigns**
```sql
- id
- name (e.g., "Summer Sale")
- type (flash_sale, seasonal, clearance, etc.)
- discount_type & discount_value
- applies_to (all, category, specific products)
- starts_at / ends_at
- is_active
- banner_image
- show_on_homepage
- auto_code
```

### **review_images**
```sql
- id
- review_id
- image_url
- uploaded_at
```

### **review_rewards**
```sql
- id
- review_id
- customer_email
- discount_code
- sent_at
- used (true/false)
```

---

## 🔧 API ENDPOINTS CREATED:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/discount/validate` | POST | Validate discount code at checkout |
| `/api/referrals/create` | POST | Create referral link for customer |
| `/api/referrals/track` | POST | Track when someone uses referral link |
| `/api/reviews/upload-image` | POST | Upload image with review |
| `/api/cron/review-reminders` | GET | Daily cron job for reminders |

---

## 💻 HOW TO USE:

### **1. Create a Promo Campaign:**

```typescript
// In admin panel or via API
const campaign = await createCampaignCode(
  'SUMMER25',           // code
  'percentage',         // type
  25,                   // 25% off
  'Summer Sale - 25% OFF Everything!',
  30,                   // valid for 30 days
  500                   // minimum R500 purchase
);
```

### **2. Customer Gets Referral Link:**

```typescript
// API call from customer account page
POST /api/referrals/create
{
  "customerEmail": "john@example.com",
  "customerId": "uuid"
}

// Returns:
{
  "referralCode": "ABC12345",
  "referralLink": "https://fashioncenter.co.za/ref/ABC12345"
}
```

### **3. Validate Code at Checkout:**

```typescript
POST /api/discount/validate
{
  "code": "SUMMER25",
  "customerEmail": "customer@example.com",
  "orderTotal": 1500,
  "productIds": ["uuid1", "uuid2"]
}

// Returns:
{
  "valid": true,
  "message": "25% discount applied!",
  "discount": 375,  // R375 off R1500
  "code": { ... }
}
```

### **4. Upload Review Image:**

```typescript
POST /api/reviews/upload-image
FormData:
  - file: [image file]
  - reviewId: "uuid"

// Returns:
{
  "success": true,
  "image": {
    "id": "uuid",
    "image_url": "https://..."
  }
}
```

---

## ⚙️ SETUP CHECKLIST:

### **Step 1: Database Setup**
```sql
-- Run these in Supabase SQL editor:
-- 1. Main promotions schema
RUN: database/promotions-schema.sql

-- 2. Review images support
RUN: database/review-images-schema.sql
```

### **Step 2: Supabase Storage**
1. Go to Supabase Dashboard → Storage
2. Create bucket: `review-images`
3. Set bucket to **Public**
4. Set policies:
   - INSERT: authenticated users
   - SELECT: public

### **Step 3: Environment Variables**
Add to `.env`:
```env
NEXT_PUBLIC_SITE_URL=https://fashioncenter.co.za
CRON_SECRET=your_secret_key_here
```

### **Step 4: Vercel Cron Jobs** (for reminders)
1. Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/review-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```
2. Deploy to Vercel
3. Cron runs daily at 10 AM

---

## 📈 ANALYTICS & TRACKING:

### **Views Created:**

**1. discount_performance**
```sql
SELECT * FROM discount_performance;
-- Shows: code usage, total discounts given, effectiveness
```

**2. referral_stats**
```sql
SELECT * FROM referral_stats;
-- Shows: pending/completed/rewarded referrals per customer
```

**3. campaign_performance**
```sql
SELECT * FROM campaign_performance;
-- Shows: orders & revenue during campaign period
```

---

## 🎯 MARKETING STRATEGIES:

### **1. Welcome Discount**
```
Code: WELCOME10
Value: 10% off
Limit: 1 per customer
Minimum: R500
Show: On homepage banner
```

### **2. Abandoned Cart Recovery**
```
Code: COMEBACK15
Value: 15% off
Sent: via email after 24 hours
Expires: 48 hours
```

### **3. VIP Customer Rewards**
```
Code: VIP20
Value: 20% off
For: Customers with 5+ orders
Limit: 1 per month
```

### **4. Social Media Promos**
```
Code: INSTA25
Value: 25% off
Share: On Instagram story
Limit: First 50 customers
Expires: 24 hours
```

### **5. Birthday Discounts**
```
Code: BDAY-[CUSTOMERNAME]
Value: 15% off
Sent: On customer's birthday
Expires: 7 days
```

---

## 🎁 REWARD TIERS:

### **Review Rewards:**
- ⭐⭐⭐⭐⭐ (5 stars + photo) = 15% off
- ⭐⭐⭐⭐⭐ (5 stars) = 10% off
- ⭐⭐⭐⭐ (4 stars) = 5% off

### **Referral Rewards:**
- 1-2 referrals = 10% off per referral
- 3-5 referrals = 15% off per referral
- 5+ referrals = VIP status (20% always)

---

## ✅ COMPLETE FEATURES:

- [x] Discount code generation
- [x] Code validation at checkout
- [x] Usage tracking & limits
- [x] Referral program
- [x] Unique referral links
- [x] Automatic email notifications
- [x] Review image uploads
- [x] Review reminders (automated)
- [x] Campaign manager
- [x] Performance analytics
- [x] Expiry date handling
- [x] Minimum purchase requirements
- [x] Per-customer limits
- [x] Category/product restrictions

---

## 🚀 READY TO USE!

Your store now has a **PROFESSIONAL marketing system** like:
- ✅ **Amazon** (referral program)
- ✅ **Shein** (flash sales & promos)
- ✅ **Uber** (referral rewards)
- ✅ **Airbnb** (review incentives)

**Start growing your business TODAY!** 🎉💰

---

## 📞 EXAMPLES:

### **Create Welcome Discount:**
```sql
INSERT INTO discount_codes (code, type, value, description, per_customer_limit, minimum_purchase, expires_at, source)
VALUES ('WELCOME10', 'percentage', 10, 'Welcome to FashionCenter!', 1, 500, NOW() + INTERVAL '1 year', 'campaign');
```

### **Create Flash Sale:**
```sql
INSERT INTO campaigns (name, type, discount_type, discount_value, starts_at, ends_at, show_on_homepage, auto_code)
VALUES ('48 Hour Flash Sale', 'flash_sale', 'percentage', 30, NOW(), NOW() + INTERVAL '2 days', true, 'FLASH30');
```

---

**YOUR MARKETING SYSTEM IS COMPLETE!** 🎊🚀

Want me to help you:
1. ✅ Set up your first campaign?
2. ✅ Create custom discount codes?
3. ✅ Design email templates?
4. ✅ Build admin dashboard for promos?

Let me know! 💙

