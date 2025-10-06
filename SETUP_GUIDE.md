# 🚀 FashionCenter Setup Guide - Priority 1

This guide walks you through setting up your FashionCenter store to make it fully functional.

## ✅ What We Just Completed

1. ✅ **Product API Routes** - Created CRUD endpoints for products
2. ✅ **Dynamic Product Pages** - Product detail page now fetches real data from Supabase
3. ✅ **Environment Variables Template** - Ready for your configuration
4. ✅ **Database Seed Script** - Sample products to get started

---

## 📋 Setup Steps

### **Step 1: Set Up Supabase** 🗄️

#### 1.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for free account
3. Create a new project (choose region closest to South Africa - ideally "eu-west")

#### 1.2 Run Database Schema
In your Supabase project:
1. Go to **SQL Editor** in the sidebar
2. Run these scripts **in order**:
   ```sql
   -- 1. Main schema (creates tables)
   database/schema.sql
   
   -- 2. Reviews system
   database/reviews-schema.sql
   database/review-images-schema.sql
   
   -- 3. Promotions & marketing
   database/promotions-schema.sql
   
   -- 4. Bulk orders
   database/bulk-orders-schema.sql
   database/bulk-pricing-tiers-schema.sql
   
   -- 5. Sample products (optional but recommended)
   database/seed-products.sql
   
   -- 6. Sample campaigns (optional)
   database/sample-campaigns.sql
   ```

#### 1.3 Create Storage Buckets
In Supabase, go to **Storage** and create these **public** buckets:
- `product-images` (for product photos)
- `banners` (for homepage banners)
- `review-images` (for customer review photos)

#### 1.4 Get Your Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

---

### **Step 2: Configure Environment Variables** 🔐

1. Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:

```env
# ===== SUPABASE (Required) =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ===== PAYSTACK (Required for payments) =====
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx

# ===== BREVO EMAIL (Required for emails) =====
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# ===== WHATSAPP (Optional - for notifications) =====
WHATSAPP_BUSINESS_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# ===== ADMIN CONTACTS =====
ADMIN_PHONE_NUMBER_1=27712345678
ADMIN_PHONE_NUMBER_2=27723456789
ADMIN_EMAIL_1=your_email@example.com
ADMIN_EMAIL_2=sister1@example.com

# ===== SITE URL =====
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===== SECURITY =====
CRON_SECRET=generate_random_string_here
```

---

### **Step 3: Set Up PayStack** 💳

#### 3.1 Create PayStack Account
1. Go to [https://paystack.com](https://paystack.com)
2. Sign up (supports South African businesses!)
3. Complete verification (bank details, business info)

#### 3.2 Get API Keys
1. Log in to PayStack Dashboard
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy:
   - **Test Public Key** (starts with `pk_test_`)
   - **Test Secret Key** (starts with `sk_test_`)
4. Add to `.env.local`

#### 3.3 Test Mode
- Start with **Test Mode** to ensure everything works
- Use test cards from [PayStack Test Cards](https://paystack.com/docs/payments/test-payments)
- Switch to **Live Mode** when ready to accept real payments

---

### **Step 4: Set Up Brevo (Email Service)** 📧

#### 4.1 Create Brevo Account
1. Go to [https://www.brevo.com](https://www.brevo.com) (formerly Sendinblue)
2. Sign up for FREE plan (300 emails/day)
3. Verify your email address

#### 4.2 Get API Key
1. Go to **Settings** → **SMTP & API**
2. Click **Create a new API key**
3. Name it "FashionCenter"
4. Copy the key and add to `.env.local`

#### 4.3 Configure Sender Email
1. In Brevo, go to **Senders**
2. Add your email (e.g., `noreply@yourdomain.com`)
3. Verify it (click link in email)
4. Update `BREVO_SENDER_EMAIL` in `.env.local`

---

### **Step 5: Test Your Setup** 🧪

#### 5.1 Install Dependencies
```bash
npm install
```

#### 5.2 Start Development Server
```bash
npm run dev
```

#### 5.3 Test These Features
- [ ] Visit `http://localhost:3000` - Homepage loads
- [ ] Go to `/products` - See products (from database seed)
- [ ] Click on a product - Product detail page loads with real data
- [ ] Add to cart - Cart state works
- [ ] Sign up - Authentication works
- [ ] Sign in - Can log in

---

## 🎯 What's Working Now

### ✅ Fully Functional:
- **Product Catalog** - Displays real products from Supabase
- **Product Detail Pages** - Dynamic data fetching
- **Shopping Cart** - Add/remove items (Zustand state)
- **Wishlist** - Save favorite items
- **User Authentication** - Sign up/sign in (Supabase Auth)
- **Database Schema** - All tables created
- **API Routes** - Products CRUD endpoints

### ⚠️ Needs Configuration:
- **PayStack Integration** - Add your keys to `.env.local`
- **Email Sending** - Add Brevo API key to `.env.local`
- **WhatsApp Notifications** - Optional, add credentials
- **Image Uploads** - Works once Supabase storage buckets are created

---

## 🔧 Next Steps (Priority 2 & 3)

After completing this setup, you'll need to:

### Priority 2 - Data & Content:
1. **Add Real Products** - Use Supabase dashboard or create admin UI
2. **Upload Product Images** - Add photos to Supabase Storage
3. **Create Banners** - Design and upload homepage banners
4. **Test Checkout** - Complete order flow with PayStack test mode
5. **Test Emails** - Ensure Brevo sends order confirmations

### Priority 3 - Polish:
1. **Error Handling** - Add better error messages
2. **Loading States** - Improve UX during data fetching
3. **Mobile Testing** - Test on actual mobile devices
4. **SEO** - Add metadata and Open Graph tags
5. **Analytics** - Set up Google Analytics or similar

---

## 📚 Helpful Resources

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **PayStack Docs**: [https://paystack.com/docs](https://paystack.com/docs)
- **Brevo Docs**: [https://developers.brevo.com](https://developers.brevo.com)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check your URL and keys in `.env.local`
- Restart dev server after changing env variables
- Ensure you've run the database schema

### "No products showing"
- Run `database/seed-products.sql` in Supabase SQL Editor
- Check Supabase table in dashboard has data
- Check browser console for API errors

### "PayStack not working"
- Verify you're using TEST keys (start with `pk_test_` and `sk_test_`)
- Ensure keys are in `.env.local`
- Check PayStack dashboard for errors

### "Emails not sending"
- Verify Brevo API key is correct
- Check sender email is verified in Brevo
- Look at Brevo dashboard for send logs

---

## ✅ Setup Checklist

- [ ] Supabase account created
- [ ] Database schema executed
- [ ] Storage buckets created
- [ ] Sample products seeded
- [ ] `.env.local` configured with all keys
- [ ] PayStack account created and keys added
- [ ] Brevo account created and API key added
- [ ] Development server runs without errors
- [ ] Products display on website
- [ ] Product detail pages load
- [ ] Can sign up / sign in
- [ ] Can add items to cart

Once all checked, you're ready to move to **Priority 2**!

---

## 💙 Need Help?

If you get stuck on any step, let me know and I'll help you troubleshoot!

**Your store is almost live! 🎉**

