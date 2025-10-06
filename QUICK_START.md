# ⚡ Quick Start Guide

Get your FashionCenter store running in **15 minutes**!

---

## 🚀 Fast Setup (5 Steps)

### **Step 1: Database** (5 min)
1. Go to [supabase.com](https://supabase.com) → Create free account
2. Create new project (choose nearest region)
3. Go to **SQL Editor** → Run these files **in order**:
   - `database/schema.sql`
   - `database/reviews-schema.sql`
   - `database/promotions-schema.sql`
   - `database/seed-products.sql` (sample products)
4. Go to **Storage** → Create public buckets:
   - `product-images`
   - `banners`
   - `review-images`

### **Step 2: Get Your Keys** (2 min)
In Supabase:
1. **Settings** → **API**
2. Copy:
   - Project URL
   - `anon public` key
   - `service_role` key

### **Step 3: Configure Environment** (3 min)
```bash
# Copy template
copy .env.example .env.local

# Edit .env.local - Add your Supabase keys:
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### **Step 4: Install & Run** (3 min)
```bash
npm install
npm run dev
```

### **Step 5: Test It** (2 min)
1. Open [http://localhost:3000](http://localhost:3000)
2. See products (from seed file)
3. Click product → See detail page
4. Sign up → Create account
5. Add to cart → Test cart

✅ **Done! Your store works!**

---

## 🎯 What Works Now

- ✅ Product catalog (real database)
- ✅ Product pages (dynamic)
- ✅ Shopping cart
- ✅ User signup/login
- ✅ Wishlist
- ✅ Stock tracking

---

## 💳 Add Payments (Optional - 5 min)

### PayStack Setup:
1. Go to [paystack.com](https://paystack.com) → Sign up
2. Get **Test Keys** from dashboard
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_SECRET_KEY=sk_test_xxx
   ```
4. Restart dev server
5. Test checkout with [test cards](https://paystack.com/docs/payments/test-payments)

---

## 📧 Add Emails (Optional - 5 min)

### Brevo Setup:
1. Go to [brevo.com](https://www.brevo.com) → Sign up (free)
2. **Settings** → **SMTP & API** → Create API key
3. Add to `.env.local`:
   ```env
   BREVO_API_KEY=your_key
   BREVO_SENDER_EMAIL=your@email.com
   ```
4. Verify sender email in Brevo dashboard

---

## 📦 Add Your Products

### Option A: Use Supabase Dashboard
1. Go to Supabase → **Table Editor** → `products`
2. Click **Insert** → **Insert row**
3. Fill in:
   - name
   - description
   - category (Women/Men/Kids/Accessories)
   - price
   - stock
4. Save

### Option B: Keep Sample Products
- We seeded 12 sample products
- Just replace names/prices in Supabase dashboard

---

## 🎨 Customize Branding

### Change Colors:
Edit `tailwind.config.js`:
```js
primary: {
  50: '#your-color',
  // ... change all
  600: '#your-main-color',
}
```

### Change Site Name:
1. `src/app/layout.tsx` - Update `<title>`
2. `src/components/Header.tsx` - Update logo text
3. Replace throughout codebase

---

## 🚀 Deploy to Vercel (10 min)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add all environment variables from `.env.local`
4. Deploy!
5. Your store is live! 🎉

---

## 📚 Full Documentation

- **Detailed Setup**: `SETUP_GUIDE.md`
- **Complete Features**: `COMPLETE_STORE_SUMMARY.md`
- **What's Built**: `PRIORITY_1_COMPLETE.md`
- **Project Overview**: `README.md`

---

## 🆘 Troubleshooting

**Nothing shows up**
- Did you run `seed-products.sql`?
- Check Supabase table has data
- Check browser console for errors

**Can't connect to database**
- Check `.env.local` has correct keys
- Restart dev server: `npm run dev`

**TypeScript errors**
- Run: `npm install`
- Delete `.next` folder
- Restart dev server

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database schema loaded
- [ ] Sample products seeded
- [ ] Storage buckets created
- [ ] `.env.local` configured
- [ ] `npm install` completed
- [ ] Dev server running
- [ ] Products showing on site
- [ ] Can sign up/in
- [ ] Can add to cart

**All checked? You're ready to sell!** 🎊

---

## 🎯 Next Steps

1. **Add your real products** (or keep samples)
2. **Upload product images** (Supabase Storage)
3. **Test complete checkout flow**
4. **Deploy to Vercel**
5. **Go live!** 🚀

---

## 💙 Need Help?

Ask me anything! I'm here to help you succeed.

**Your professional e-commerce store is ready!** 🎉

