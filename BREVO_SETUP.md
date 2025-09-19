# Brevo SMTP Setup Guide

This guide will help you set up Brevo (formerly Sendinblue) SMTP for sending certificate emails.

## 🚀 Why Brevo?

- **✅ Reliable Delivery:** High deliverability rates
- **✅ Free Tier:** 300 emails/day for free
- **✅ Easy Setup:** Simple SMTP configuration
- **✅ Professional:** Dedicated IP options available
- **✅ Analytics:** Email tracking and statistics

## 📋 Prerequisites

1. **Brevo Account:** Sign up at [brevo.com](https://www.brevo.com)
2. **Verified Domain:** Add and verify your sending domain
3. **SMTP API Key:** Generate SMTP credentials

## 🔧 Step-by-Step Setup

### Step 1: Create Brevo Account
1. Go to [brevo.com](https://www.brevo.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Verify Your Domain
1. Go to **Senders & IP** → **Domains**
2. Click **Add a domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the required DNS records:
   - **SPF Record:** `v=spf1 include:spf.brevo.com mx ~all`
   - **DKIM Record:** Provided by Brevo
   - **DMARC Record:** `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`

### Step 3: Create Sender Identity
1. Go to **Senders & IP** → **Senders**
2. Click **Add a sender**
3. Enter your sender email (e.g., `certificates@yourdomain.com`)
4. Verify the sender email

### Step 4: Generate SMTP API Key
1. Go to **SMTP & API** → **SMTP**
2. Click **Generate a new SMTP key**
3. Copy the generated API key
4. Note the SMTP settings:
   - **Host:** `smtp-relay.brevo.com`
   - **Port:** `587` (STARTTLS)
   - **Username:** Your verified sender email
   - **Password:** Your SMTP API key

## ⚙️ Configuration

### Option 1: Environment Variables
Add to your `.env` file:
```bash
BREVO_API_KEY=your-brevo-smtp-api-key
BREVO_FROM_EMAIL=certificates@yourdomain.com
```

### Option 2: UI Configuration
Use the email configuration form in the app:
```json
{
  "provider": "brevo",
  "brevo": {
    "apiKey": "your-brevo-smtp-api-key",
    "fromEmail": "certificates@yourdomain.com"
  },
  "subject": "Your Certificate of Completion"
}
```

## 🧪 Testing Configuration

### API Test Endpoint
```bash
POST /api/email/test-config
Content-Type: application/json

{
  "emailConfig": {
    "provider": "brevo",
    "brevo": {
      "apiKey": "your-brevo-smtp-api-key",
      "fromEmail": "certificates@yourdomain.com"
    }
  },
  "testEmail": "test@example.com"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Email configuration test successful",
  "provider": "Brevo SMTP",
  "testEmail": "test@example.com",
  "timestamp": "2025-09-18T15:30:00.000Z"
}
```

## 📧 Email Sending

### Bulk Certificate Sending
```bash
POST /api/email/send
Content-Type: application/json

{
  "recipients": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "emailConfig": {
    "provider": "brevo",
    "brevo": {
      "apiKey": "your-brevo-smtp-api-key",
      "fromEmail": "certificates@yourdomain.com"
    },
    "subject": "Your Certificate of Completion"
  },
  "certificates": [
    {
      "name": "John Doe",
      "filename": "certificate_John_Doe_123456.png"
    }
  ]
}
```

## 🔒 Security Best Practices

1. **Environment Variables:** Store API keys in environment variables
2. **Domain Verification:** Always verify your sending domain
3. **SPF/DKIM/DMARC:** Implement proper email authentication
4. **Rate Limiting:** Respect Brevo's sending limits
5. **Monitoring:** Monitor bounce rates and deliverability

## 📊 Brevo Limits

### Free Plan
- **300 emails/day**
- **Unlimited contacts**
- **Email support**

### Paid Plans
- **Starting at $25/month**
- **20,000+ emails/month**
- **No daily sending limit**
- **Advanced features**

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Failed
- **Cause:** Invalid API key or sender email
- **Solution:** Verify API key and ensure sender email is verified

#### 2. Domain Not Verified
- **Cause:** Sending from unverified domain
- **Solution:** Complete domain verification process

#### 3. Rate Limit Exceeded
- **Cause:** Exceeded daily/hourly limits
- **Solution:** Upgrade plan or implement rate limiting

#### 4. High Bounce Rate
- **Cause:** Invalid recipient emails
- **Solution:** Validate email addresses before sending

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📞 Support

- **Brevo Documentation:** [developers.brevo.com](https://developers.brevo.com)
- **Brevo Support:** Available through your Brevo dashboard
- **SMTP Settings:** Always use `smtp-relay.brevo.com:587`

## 🎯 Production Checklist

- [ ] Domain verified in Brevo
- [ ] Sender email verified
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC policy configured
- [ ] API key generated and secured
- [ ] Test email sent successfully
- [ ] Rate limiting implemented
- [ ] Monitoring set up

Your certificate generator is now ready to send professional emails through Brevo SMTP! 🚀
