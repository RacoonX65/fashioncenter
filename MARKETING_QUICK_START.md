# 🎯 Marketing System - Quick Start

## 🎉 EVERYTHING IS READY!

---

## ✅ WHAT YOU NOW HAVE:

### **1. DISCOUNT CODES** 💰
Create codes for:
- Percentage off (10%, 25%, 50%)
- Fixed amount off (R50, R100)
- Free shipping
- Flash sales
- Welcome discounts

### **2. REFERRAL PROGRAM** 🤝
- **Customers refer friends**
- Friend gets 15% OFF
- Referrer gets 10% OFF
- Unlimited referrals!
- Automatic rewards

### **3. REVIEW REWARDS** ⭐
- Customer leaves review
- Gets 10% OFF code
- Can upload photos
- Auto-reminder after 7 days

### **4. PROMO CAMPAIGNS** 🎪
- Flash sales
- Seasonal promos
- Clearance events
- Homepage banners
- Time-limited offers

---

## 🚀 QUICK EXAMPLES:

### **Create Welcome Discount:**
```sql
-- Run in Supabase SQL editor
INSERT INTO discount_codes (code, type, value, description, per_customer_limit, minimum_purchase, expires_at, source)
VALUES ('WELCOME10', 'percentage', 10, 'Welcome! 10% OFF first order', 1, 500, NOW() + INTERVAL '1 year', 'campaign');
```

### **Create Flash Sale:**
```sql
INSERT INTO campaigns (name, type, discount_type, discount_value, starts_at, ends_at, show_on_homepage, auto_code)
VALUES ('Weekend Flash Sale', 'flash_sale', 'percentage', 25, NOW(), NOW() + INTERVAL '2 days', true, 'WEEKEND25');
```

### **Customer Referral Flow:**
```
1. Customer signs up
2. Gets referral link: fashioncenter.co.za/ref/ABC123
3. Shares with friend
4. Friend signs up → gets 15% OFF
5. Customer gets 10% OFF
6. Both get emails with codes!
```

---

## 💻 API CALLS:

### **Validate Discount at Checkout:**
```javascript
const response = await fetch('/api/discount/validate', {
  method: 'POST',
  body: JSON.stringify({
    code: 'SUMMER25',
    customerEmail: 'customer@example.com',
    orderTotal: 1000
  })
});

// Returns: { valid: true, discount: 250 }
```

### **Create Referral Link:**
```javascript
const response = await fetch('/api/referrals/create', {
  method: 'POST',
  body: JSON.stringify({
    customerEmail: 'john@example.com'
  })
});

// Returns: { referralLink: 'fashioncenter.co.za/ref/ABC123' }
```

---

## 📊 FEATURES MATRIX:

| Feature | Status | Auto | Manual |
|---------|--------|------|--------|
| **Discount Codes** | ✅ | ✅ | ✅ |
| **Referral Program** | ✅ | ✅ | ✅ |
| **Review Rewards** | ✅ | ✅ | ❌ |
| **Review Reminders** | ✅ | ✅ | ❌ |
| **Review Images** | ✅ | ❌ | ✅ |
| **Flash Sales** | ✅ | ❌ | ✅ |
| **Campaign Banners** | ✅ | ❌ | ✅ |
| **Usage Tracking** | ✅ | ✅ | ❌ |
| **Email Notifications** | ✅ | ✅ | ✅ |

---

## 🗄️ DATABASE SETUP:

### **Step 1: Run SQL Scripts**
```bash
# In Supabase SQL Editor, run these files:
1. database/promotions-schema.sql
2. database/review-images-schema.sql
```

### **Step 2: Create Storage Bucket**
```
1. Go to Supabase → Storage
2. Create bucket: "review-images"
3. Set to Public
4. Allow uploads from authenticated users
```

### **Step 3: Set Environment Variables**
```env
NEXT_PUBLIC_SITE_URL=https://fashioncenter.co.za
CRON_SECRET=random_secret_key
```

---

## 📧 EMAILS SENT AUTOMATICALLY:

| Email | When | Code Type |
|-------|------|-----------|
| **Review Reward** | After admin approves review | 10% OFF (REV-XXX) |
| **Referee Welcome** | Friend signs up via referral | 15% OFF (REF-XXX) |
| **Referrer Reward** | Friend completes sign-up | 10% OFF (THANKS-XXX) |
| **Review Reminder** | 7 days after request | None (reminder only) |

---

## 🎁 DISCOUNT CODE EXAMPLES:

### **Welcome Discount:**
```
Code: WELCOME10
Type: 10% off
Limit: 1 per customer
Min: R500
Valid: 1 year
```

### **Flash Sale:**
```
Code: FLASH30
Type: 30% off
Limit: Unlimited
Min: None
Valid: 24 hours
```

### **Free Shipping:**
```
Code: FREESHIP
Type: Free shipping
Limit: Unlimited
Min: R1000
Valid: 6 months
```

### **Bulk Order:**
```
Code: BULK20
Type: 20% off
Limit: Unlimited
Min: R5000
Valid: Ongoing
```

---

## 🎯 MARKETING IDEAS:

### **1. New Customer Funnel:**
```
1. Sign up → WELCOME10 (10% off)
2. First purchase → Review request
3. Leave review → REV-XXX (10% off)
4. Get referral link → Share with friends
5. Friend signs up → Both get discounts!
```

### **2. Social Media Promos:**
```
Instagram: INSTA25 (25% off - 24hrs)
Facebook: FB20 (20% off - 48hrs)
TikTok: TIKTOK30 (30% off - weekend)
```

### **3. Seasonal Campaigns:**
```
Valentine's Day: LOVE25 (25% off couples sets)
Women's Day: QUEEN30 (30% off women's)
Black Friday: BLACKFRI50 (50% off everything)
Christmas: XMAS35 (35% off gifts)
```

### **4. VIP Customer Rewards:**
```
5+ orders → VIP10 (10% always)
10+ orders → VIP15 (15% always)
20+ orders → VIP20 (20% always + early access)
```

---

## 📈 ANALYTICS QUERIES:

### **Top Performing Codes:**
```sql
SELECT code, usage_count, SUM(discount_amount) as total_discount
FROM discount_codes
JOIN discount_code_usage ON discount_codes.id = discount_code_id
GROUP BY code
ORDER BY usage_count DESC;
```

### **Referral Leaderboard:**
```sql
SELECT referrer_email, COUNT(*) as total_referrals
FROM referrals
WHERE status = 'rewarded'
GROUP BY referrer_email
ORDER BY total_referrals DESC
LIMIT 10;
```

### **Campaign ROI:**
```sql
SELECT * FROM campaign_performance
ORDER BY total_revenue DESC;
```

---

## ✅ COMPLETE CHECKLIST:

Setup:
- [ ] Run database/promotions-schema.sql
- [ ] Run database/review-images-schema.sql
- [ ] Create "review-images" storage bucket
- [ ] Set environment variables
- [ ] Deploy to Vercel (for cron jobs)

First Campaigns:
- [ ] Create WELCOME10 code
- [ ] Set up referral program
- [ ] Create first flash sale
- [ ] Test discount validation
- [ ] Test referral flow
- [ ] Test review rewards

Marketing:
- [ ] Design campaign banners
- [ ] Share on social media
- [ ] Email existing customers
- [ ] Create promotional content
- [ ] Track performance

---

## 🎉 YOU'RE READY!

Your store now has:
✅ **Professional discount system**
✅ **Viral referral program**
✅ **Review incentives**
✅ **Automated reminders**
✅ **Campaign tracking**
✅ **Performance analytics**

**Start growing your sales TODAY!** 🚀💰

---

## 📚 DOCUMENTATION:

Full guides:
- `PROMO_REFERRAL_SYSTEM.md` - Complete system guide
- `REVIEWS_TRACKING_SYSTEM.md` - Review system
- `database/promotions-schema.sql` - Database setup

---

**Questions? Let me know!** 💙

