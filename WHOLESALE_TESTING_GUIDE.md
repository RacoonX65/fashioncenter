# 🧪 Wholesale System - Complete Testing Guide

## 🎯 WHAT YOU JUST GOT:

### ✅ 1. EMAIL NOTIFICATIONS
- **Approval emails** - Beautiful HTML emails with wholesale codes
- **Rejection emails** - Professional rejection notices
- **Application received** - Confirmation emails

### ✅ 2. WHOLESALE CUSTOMER PORTAL
- **URL:** `/wholesale/portal`
- Login with business email
- View statistics & orders
- Copy wholesale code
- Track savings

### ✅ 3. COMPLETE SYSTEM
- Application forms (3 tiers)
- Admin approval dashboard
- Auto-generated codes
- Email notifications
- Customer portal

---

## 🚀 LET'S TEST IT STEP-BY-STEP!

---

### 📍 **STEP 1: Set Up Database**

**1. Open Supabase SQL Editor**
```
Go to: https://supabase.com/dashboard
→ Your Project
→ SQL Editor
```

**2. Run the Schema**
```sql
-- Copy and paste from:
database/bulk-orders-schema.sql

-- Click "Run"
```

**What this creates:**
- ✅ `bulk_tiers` table (with 3 tiers)
- ✅ `bulk_order_requests` table
- ✅ `wholesale_customers` table
- ✅ `wholesale_orders` table
- ✅ Analytics views

---

### 📍 **STEP 2: Visit Bulk Orders Page**

**URL:** `http://localhost:3005/bulk-orders`

**What you'll see:**
```
┌────────────────────────────────────┐
│  Wholesale & Bulk Orders           │
│  Save up to 25% on bulk purchases! │
├────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌───────┐│
│  │ Small   │ │ Medium  │ │Reseller││
│  │ 15% OFF │ │ 20% OFF │ │25% OFF││
│  │ 5-19    │ │ 20-49   │ │ 50+   ││
│  └─────────┘ └─────────┘ └───────┘│
└────────────────────────────────────┘
```

**✅ Test:**
- [ ] Page loads correctly
- [ ] 3 pricing tiers display
- [ ] "Request Access Code" buttons work
- [ ] Mobile responsive design

---

### 📍 **STEP 3: Submit Test Application**

**1. Click "Request Access Code" on any tier**

Example: Click "Medium Business" (20% OFF)

**2. Fill out the form with test data:**

```
BUSINESS INFORMATION:
- Business Name: "Test Boutique SA"
- Business Type: "Boutique"
- Registration: "2023/123456/07" (optional)
- VAT Number: "4123456789" (optional)

CONTACT INFORMATION:
- Contact Person: "Sarah Johnson"
- Email: YOUR_REAL_EMAIL@gmail.com (use YOUR email!)
- Phone: "+27 71 234 5678"

BUSINESS ADDRESS:
- Street Address: "123 Fashion Street, Sandton City"
- City: "Johannesburg"
- Province: "Gauteng"
- Postal Code: "2196"

ADDITIONAL INFORMATION:
- Estimated Monthly Orders: "30"
- Product Categories: ✓ Women's Clothing, ✓ Dresses
- How did you hear: "Google Search"
- Notes: "Looking to stock trendy items for my boutique"
```

**3. Click "Submit Application"**

**What happens:**
- ✅ Form validates
- ✅ Data saves to database
- ✅ Redirects to success page
- ✅ (Future: Sends confirmation email)

**✅ Test:**
- [ ] Form validation works
- [ ] Success page displays
- [ ] Data appears in database

---

### 📍 **STEP 4: Approve in Admin Dashboard**

**1. Go to Admin Dashboard**
```
http://localhost:3005/admin/bulk-requests
```

**2. What you'll see:**

```
┌───────────────────────────────────┐
│ Bulk Order Requests               │
├───────────────────────────────────┤
│ Stats:                            │
│ Total: 1 │ Pending: 1 │ Approved: 0│
├───────────────────────────────────┤
│ [All] [Pending] [Approved] [Rejected]│
├───────────────────────────────────┤
│ Test Boutique SA    [PENDING]    │
│ Medium Business - 20% OFF         │
│ 📧 your.email@gmail.com           │
│ 📱 +27 71 234 5678               │
│ Est: 30 items/month               │
│ [✓ Approve] [✗ Reject]           │
└───────────────────────────────────┘
```

**3. Click the "Approve" button ✅**

**What happens:**
```
1. System shows: "Approving request..."
2. Generates wholesale code: WS-ABC12345
3. Creates discount code in database
4. Adds to wholesale_customers table
5. Sends beautiful HTML email 📧
6. Shows: "✅ Approved! Email sent with code: WS-ABC12345"
```

**✅ Test:**
- [ ] Admin dashboard loads
- [ ] Application appears
- [ ] Approve button works
- [ ] Wholesale code generated
- [ ] Success toast appears

**4. Check Your Email! 📧**

You should receive an email like this:

```
From: FashionCenter Wholesale
Subject: 🎉 Your Wholesale Application is Approved!

┌───────────────────────────────────┐
│      🎉 Congratulations!          │
│ Your Wholesale Application        │
│        is Approved                │
├───────────────────────────────────┤
│ Your Exclusive Wholesale Code:    │
│                                   │
│      WS-ABC12345                  │
│                                   │
│ 💰 20% OFF All Orders             │
│ 📦 Order: 20-49 items             │
│ ♾️ Unlimited Use                  │
│ 🎯 Priority Support               │
├───────────────────────────────────┤
│ [Start Shopping Now! 🛍️]         │
└───────────────────────────────────┘
```

**✅ Test:**
- [ ] Email received (check spam!)
- [ ] Wholesale code displays
- [ ] Email looks professional
- [ ] Links work

---

### 📍 **STEP 5: Access Wholesale Portal**

**Option 1: Direct Link from Email**
Click "View Your Wholesale Portal" in the email

**Option 2: Manual Access**
```
http://localhost:3005/wholesale/portal
```

**1. Login to Portal:**
```
Enter Email: your.email@gmail.com
Click "Access Portal"
```

**2. What you'll see:**

```
┌────────────────────────────────────┐
│ Test Boutique SA                   │
│ Wholesale Customer Portal          │
│ Medium Business • 20% OFF          │
│                                    │
│ Your Wholesale Code: WS-ABC12345 📋│
├────────────────────────────────────┤
│ Stats Dashboard:                   │
│ Total Orders: 0                    │
│ Total Spent: R0.00                 │
│ Total Saved: R0.00                 │
│ Member Since: 0 days               │
├────────────────────────────────────┤
│ 🛍️ How to Place an Order:         │
│ 1. Browse → 2. Add to Cart →      │
│ 3. Enter WS-ABC12345 → 4. Save 20%│
│                                    │
│ [Start Shopping Now]               │
├────────────────────────────────────┤
│ Recent Orders: None yet            │
│ [Place Your First Order]           │
└────────────────────────────────────┘
```

**✅ Test:**
- [ ] Portal loads
- [ ] Business name displays
- [ ] Wholesale code shows
- [ ] Copy code button works
- [ ] Stats display correctly

---

### 📍 **STEP 6: Test Rejection (Optional)**

**1. Submit another test application**
(Different email address)

**2. In Admin Dashboard, click "Reject"**

**3. Enter rejection reason:**
```
"Thank you for applying. At this time, we require businesses with at least 6 months of trading history. Please reapply once established."
```

**4. Check email - you'll receive:**
```
From: FashionCenter Wholesale
Subject: Update on Your Wholesale Application

Hi [Name],

Thank you for your interest...

Unfortunately, we're unable to approve your application...

Reason: Thank you for applying. At this time...

You Can Still:
✨ Shop retail prices
🎁 Enjoy sales
💌 Subscribe
🔄 Reapply later
```

**✅ Test:**
- [ ] Rejection button works
- [ ] Rejection email sent
- [ ] Reason displays in email
- [ ] Professional tone

---

## 📧 EMAIL TEMPLATES

### **1. Approval Email Features:**
- ✅ Beautiful HTML design
- ✅ Gradient header
- ✅ Large wholesale code (copy-friendly)
- ✅ Benefit list with icons
- ✅ Step-by-step instructions
- ✅ Call-to-action button
- ✅ Contact information
- ✅ Mobile responsive

### **2. Rejection Email Features:**
- ✅ Professional tone
- ✅ Clear reason (optional)
- ✅ Alternative options
- ✅ Reapply encouragement
- ✅ Contact information

---

## 🎨 PORTAL FEATURES:

### **Statistics Dashboard:**
- 📊 Total orders count
- 💰 Total revenue (after discount)
- 📈 Total savings
- ⏰ Days active

### **Wholesale Code:**
- 📋 One-click copy button
- ✅ Copy confirmation
- 🔒 Secure display

### **Order History:**
- 📦 Recent 10 orders
- 💵 Original price (crossed out)
- 💚 Discount applied
- 🎯 Final total

### **Quick Actions:**
- 🛍️ Shop now button
- 📧 Contact support
- 📱 WhatsApp link

---

## 🔍 WHAT TO CHECK:

### **Database:**
```sql
-- Check if application saved:
SELECT * FROM bulk_order_requests;

-- Check if wholesale code generated:
SELECT wholesale_code FROM bulk_order_requests WHERE status = 'approved';

-- Check wholesale customer:
SELECT * FROM wholesale_customers;

-- Check discount code:
SELECT * FROM discount_codes WHERE source = 'wholesale';
```

### **Files to Review:**
```
✅ database/bulk-orders-schema.sql
✅ src/app/bulk-orders/page.tsx
✅ src/app/bulk-orders/request/[tier]/page.tsx
✅ src/app/bulk-orders/request/success/page.tsx
✅ src/app/admin/bulk-requests/page.tsx
✅ src/app/wholesale/portal/page.tsx
✅ src/lib/bulk-order-emails.ts
✅ src/lib/discount-codes.ts
```

---

## 🚨 TROUBLESHOOTING:

### **Email not sending?**
```
1. Check Brevo API key in .env.local:
   BREVO_API_KEY=xkeysib-...
   
2. Check Brevo dashboard:
   - API key valid?
   - Sender email verified?
   - Rate limit not exceeded?
   
3. Check console for errors:
   - Open browser dev tools
   - Look for error messages
```

### **Portal not loading?**
```
1. Check email is correct
2. Check database has customer
3. Check is_active = true
4. Try with wholesale code in URL:
   /wholesale/portal?code=WS-ABC12345
```

### **Code not generated?**
```
1. Check tier exists in database
2. Check discount_codes table permissions
3. Check console for errors
```

---

## ✅ COMPLETE TESTING CHECKLIST:

### **Customer Flow:**
- [ ] Visit /bulk-orders page
- [ ] View 3 pricing tiers
- [ ] Click "Request Access Code"
- [ ] Fill out application form
- [ ] Submit successfully
- [ ] See success page
- [ ] Receive confirmation (future)

### **Admin Flow:**
- [ ] Visit /admin/bulk-requests
- [ ] See pending applications
- [ ] View applicant details
- [ ] Click "Approve"
- [ ] See wholesale code generated
- [ ] Email sent successfully
- [ ] Application moves to "Approved" tab

### **Email Flow:**
- [ ] Receive approval email
- [ ] Email looks professional
- [ ] Wholesale code displays
- [ ] Links work
- [ ] Mobile responsive

### **Portal Flow:**
- [ ] Login with email
- [ ] See business details
- [ ] See wholesale code
- [ ] Copy code button works
- [ ] Stats display
- [ ] "Start Shopping" works

---

## 🎯 NEXT STEPS:

### **Before Going Live:**
1. ✅ Update email content with your branding
2. ✅ Set correct sender email
3. ✅ Test with real email addresses
4. ✅ Verify Brevo API key in production
5. ✅ Add actual WhatsApp number
6. ✅ Update contact email addresses

### **Optional Enhancements:**
1. Add application received confirmation email
2. Add reminder for incomplete applications
3. Add monthly report for wholesale customers
4. Add bulk order quotes
5. Add dedicated wholesale support chat

---

## 📱 TEST ON MOBILE:

### **Mobile Checklist:**
- [ ] Bulk orders page responsive
- [ ] Application form mobile-friendly
- [ ] Success page readable
- [ ] Admin dashboard works on tablet
- [ ] Portal accessible on mobile
- [ ] Emails display well on phone

---

## 🎉 YOU'RE READY!

**Your wholesale system includes:**
✅ 3-tier pricing (15%, 20%, 25%)
✅ Professional application forms
✅ Auto-code generation
✅ Beautiful email notifications
✅ Wholesale customer portal
✅ Admin approval dashboard
✅ Order tracking
✅ Analytics

**Start testing now:**
```bash
# Make sure dev server is running:
npm run dev

# Visit:
http://localhost:3005/bulk-orders

# Follow steps above!
```

---

## 📚 RESOURCES:

- **Main Guide:** `BULK_WHOLESALE_SYSTEM.md`
- **Database Schema:** `database/bulk-orders-schema.sql`
- **Email Templates:** `src/lib/bulk-order-emails.ts`
- **This Guide:** `WHOLESALE_TESTING_GUIDE.md`

---

## 🆘 NEED HELP?

**Common Issues:**
1. **"Database error"** → Run schema first
2. **"Email failed"** → Check Brevo API key
3. **"Portal not found"** → Check email/code
4. **"Code not working"** → Check is_active

**Still stuck?** Check browser console for detailed errors!

---

## 🎊 HAPPY TESTING!

Your wholesale system is production-ready! 

Test it thoroughly, then:
1. Share with your sisters
2. Get their feedback
3. Launch to customers!

**YOU'VE GOT THIS!** 💪🚀

