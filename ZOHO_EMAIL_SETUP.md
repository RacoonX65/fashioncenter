# Zoho Mail Integration for ApparelCast

## Overview
This guide will help you set up Zoho Mail for sending transactional emails from your ApparelCast store using your custom domain `apparelcast.shop`.

---

## Prerequisites

- ✅ Domain: `apparelcast.shop` (Purchased)
- ✅ Zoho Mail account created
- ✅ Domain verified in Zoho
- ⚠️ Email address created (e.g., `info@apparelcast.shop`)

---

## Option 1: Zoho Mail API (Recommended)

Zoho provides a transactional email API called **Zoho ZeptoMail** specifically for automated emails.

### Step 1: Set Up ZeptoMail

1. **Go to ZeptoMail**:
   - Visit: https://www.zoho.com/zeptomail/
   - Sign up or log in with your Zoho account

2. **Add Your Domain**:
   - Go to "Mail Agents" → "Add Mail Agent"
   - Choose "Transactional" type
   - Add domain: `apparelcast.shop`
   - Verify domain with provided DNS records

3. **Get API Key**:
   - Go to "Settings" → "SMTP"
   - Or go to "Setup" → "API"
   - Generate an API key
   - Copy and save securely

4. **Create From Address**:
   - Add: `noreply@apparelcast.shop`
   - Or: `orders@apparelcast.shop`
   - Verify the email address

### Step 2: Install Required Package

```bash
npm install nodemailer
```

### Step 3: Environment Variables

Add to your `.env.local`:

```env
# Zoho ZeptoMail
ZOHO_ZEPTOMAIL_API_KEY=your_api_key_here
ZOHO_SENDER_EMAIL=noreply@apparelcast.shop
ZOHO_SENDER_NAME=ApparelCast

# Or use SMTP
ZOHO_SMTP_HOST=smtp.zeptomail.com
ZOHO_SMTP_PORT=587
ZOHO_SMTP_USER=your_smtp_username
ZOHO_SMTP_PASS=your_smtp_password
```

---

## Option 2: Zoho Mail SMTP (Alternative)

If you prefer SMTP over API, use Zoho Mail's SMTP server.

### SMTP Settings:

```
Server: smtp.zoho.com
Port: 465 (SSL) or 587 (TLS)
Username: info@apparelcast.shop
Password: your_zoho_mail_password
Security: SSL/TLS
```

### Environment Variables:

```env
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=587
ZOHO_SMTP_USER=info@apparelcast.shop
ZOHO_SMTP_PASS=your_password
ZOHO_SMTP_SECURE=true
ZOHO_SENDER_EMAIL=info@apparelcast.shop
ZOHO_SENDER_NAME=ApparelCast
```

---

## DNS Configuration

### Required DNS Records:

Add these to your domain registrar (where you bought apparelcast.shop):

#### 1. SPF Record (Prevents spam):
```
Type: TXT
Host: @
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

#### 2. DKIM Record (Email authentication):
Zoho will provide you with DKIM values. Add them:
```
Type: TXT
Host: zoho._domainkey
Value: [Provided by Zoho]
TTL: 3600
```

#### 3. DMARC Record (Email policy):
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@apparelcast.shop
TTL: 3600
```

#### 4. MX Records (For receiving emails):
```
Priority 10: mx.zoho.com
Priority 20: mx2.zoho.com
Priority 50: mx3.zoho.com
```

---

## Email Addresses to Create

### Essential Email Addresses:

1. **info@apparelcast.shop**
   - Main contact email
   - Customer inquiries
   - General communication

2. **noreply@apparelcast.shop**
   - Automated emails
   - Order confirmations
   - Transactional emails

3. **orders@apparelcast.shop**
   - Order notifications
   - Admin alerts
   - Internal notifications

4. **support@apparelcast.shop**
   - Customer support
   - Returns/refunds
   - Help requests

5. **admin@apparelcast.shop** (Optional)
   - System notifications
   - Technical alerts

---

## Setting Up Email Forwarding

### Forward all emails to one inbox:

In Zoho Mail:
1. Go to Settings → Email Forwarding
2. Forward `noreply@` to `info@`
3. Forward `orders@` to `info@`
4. Keep everything in one inbox for management

---

## Testing Your Setup

### 1. Test DNS Records:
- Use MXToolbox: https://mxtoolbox.com/
- Enter: `apparelcast.shop`
- Verify SPF, DKIM, DMARC, and MX records

### 2. Send Test Email:
```bash
# From your terminal in project directory
node test-email.js
```

### 3. Check Deliverability:
- Send to Gmail
- Send to Outlook
- Check spam folder
- Verify email headers

---

## Comparison: ZeptoMail vs Regular Zoho Mail

| Feature | ZeptoMail | Zoho Mail SMTP |
|---------|-----------|----------------|
| **Purpose** | Transactional emails | Regular email + transactional |
| **Pricing** | Free: 10,000/month | Free: 5,000/day |
| **API** | Yes (RESTful) | No (SMTP only) |
| **Deliverability** | Optimized for transactional | Good |
| **Analytics** | Built-in tracking | Basic |
| **Setup** | Slightly more complex | Simple |
| **Recommended for** | High volume | Low-medium volume |

**Recommendation**: Start with **Zoho Mail SMTP** (simpler), upgrade to ZeptoMail if you send >1000 emails/day.

---

## Free Tier Limits

### Zoho Mail (Free Plan):
- 5 users
- 5 GB per user
- 25 MB attachment size
- 500 emails per day per user

### ZeptoMail (Free Plan):
- 10,000 emails per month
- No daily limit
- Unlimited emails after paid upgrade

---

## Common Issues & Solutions

### Issue 1: Emails go to spam
**Solution:**
- Verify SPF, DKIM, DMARC records
- Use your domain email (not free email)
- Warm up your domain (start with small volume)
- Avoid spammy words in subject lines

### Issue 2: Authentication failed
**Solution:**
- Double-check username/password
- Enable "Less secure apps" if using SMTP
- Use app-specific password
- Verify SMTP settings

### Issue 3: Cannot receive emails
**Solution:**
- Check MX records are correct
- Wait 24-48 hours for DNS propagation
- Test with mail-tester.com

### Issue 4: SSL/TLS errors
**Solution:**
- Use port 587 with TLS (not 465)
- Or use port 465 with SSL
- Update Node.js if too old

---

## Security Best Practices

1. **Use App-Specific Passwords**:
   - Don't use your main Zoho password
   - Generate app password in Zoho settings
   
2. **Environment Variables**:
   - Never commit credentials to Git
   - Use `.env.local` (gitignored)
   
3. **Limit Access**:
   - Only give API keys to necessary services
   - Rotate keys periodically
   
4. **Monitor Usage**:
   - Check Zoho dashboard regularly
   - Set up alerts for unusual activity

---

## Monitoring & Analytics

### Zoho Mail Dashboard:
- Track sent emails
- Monitor bounces
- Check spam reports
- View open rates (with tracking)

### Set Up Alerts:
1. High bounce rate
2. Spam complaints
3. Daily sending limit reached
4. Authentication failures

---

## Migration from Brevo

If you have existing Brevo setup:

1. **Keep both temporarily**:
   - Test Zoho first
   - Ensure everything works
   - Then remove Brevo

2. **Update code**:
   - Replace Brevo imports
   - Update email templates
   - Test all email types

3. **DNS records**:
   - Update SPF to include Zoho
   - Remove Brevo DNS records (after testing)

---

## Cost Comparison

### Zoho Mail:
- **Free**: 5 users, 5GB/user
- **Mail Lite**: R30/user/month (5GB)
- **Mail Premium**: R60/user/month (50GB)

### ZeptoMail:
- **Free**: 10,000 emails/month
- **Pay-as-you-go**: From R0.80/1000 emails
- **Volume**: R580/month for 100k emails

### Brevo (for comparison):
- **Free**: 300 emails/day
- **Starter**: R475/month for 20k emails

**Winner**: Zoho Mail is more cost-effective for most small businesses!

---

## Support Resources

### Zoho Support:
- Help: https://help.zoho.com/portal/en/home
- Community: https://help.zoho.com/portal/community
- Email: support@zohocorp.com

### ZeptoMail Support:
- Docs: https://www.zoho.com/zeptomail/help/
- API Reference: https://www.zoho.com/zeptomail/help/api/
- Email: support@zeptomail.com

---

## Quick Start Checklist

- [ ] Create Zoho Mail account
- [ ] Add domain: `apparelcast.shop`
- [ ] Create email: `noreply@apparelcast.shop`
- [ ] Add DNS records (SPF, DKIM, DMARC, MX)
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Get SMTP credentials or API key
- [ ] Add to `.env.local`
- [ ] Update email integration code
- [ ] Test email sending
- [ ] Verify deliverability
- [ ] Monitor for 24 hours
- [ ] Go live!

---

## Next Steps

1. **Read**: `ZOHO_INTEGRATION_COMPLETE.md` for implementation details
2. **Update**: Environment variables
3. **Test**: Send test emails
4. **Deploy**: To production with Zoho

---

**Your professional email setup is almost ready! Follow the implementation guide next.** 📧✨

