# 🚀 Zoho Email - Quick Start Guide

## Your Domain: **apparelcast.shop** ✅

---

## 3-Step Setup

### Step 1: Configure Zoho (5 minutes)

1. **Log in**: https://mail.zoho.com
2. **Create email**: `noreply@apparelcast.shop`
3. **Get password**: Use your Zoho password or create app-specific password

### Step 2: Update Environment Variables (2 minutes)

Create `.env.local`:

```env
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=587
ZOHO_SMTP_SECURE=false
ZOHO_SMTP_USER=noreply@apparelcast.shop
ZOHO_SMTP_PASS=your_password_here
ZOHO_SENDER_EMAIL=noreply@apparelcast.shop
ZOHO_SENDER_NAME=ApparelCast
ADMIN_CONTACT_EMAIL=orders@apparelcast.shop
NEXT_PUBLIC_BASE_URL=https://apparelcast.shop
```

### Step 3: Test Email (1 minute)

```bash
node test-email.js
```

Enter your email when prompted. Check your inbox!

---

## That's It! ✅

Your store can now send:
- ✅ Order confirmations
- ✅ Shipping notifications  
- ✅ Admin alerts

---

## Email Addresses to Create in Zoho:

1. **noreply@apparelcast.shop** (Required - for automated emails)
2. **info@apparelcast.shop** (Recommended - for customer inquiries)
3. **orders@apparelcast.shop** (Optional - for order notifications)

---

## DNS Records (Add to Your Domain Registrar):

After creating emails, add these DNS records (get exact values from Zoho):

**SPF**: `v=spf1 include:zoho.com ~all`  
**MX**: Point to Zoho mail servers  
**DKIM**: Get from Zoho settings  

Wait 24-48 hours for DNS propagation.

---

## Troubleshooting:

**Test fails?**
1. Check password is correct
2. Try app-specific password
3. Wait for DNS to propagate

**Need help?** Read `ZOHO_EMAIL_SETUP.md` for detailed instructions.

---

## Free Tier Limits:

- **5,000 emails per day** per user
- **5 users** free
- **5 GB** storage per user

More than enough for your store! 🎉

---

**Ready? Run `node test-email.js` to get started!**

