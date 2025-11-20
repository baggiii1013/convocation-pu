# Quick Setup Guide - Email System

## 🚀 Quick Start (5 minutes)

### Step 1: Install SendGrid Package
```bash
cd apps/api
npm install @sendgrid/mail
```

### Step 2: Get SendGrid API Key
1. Go to [SendGrid](https://sendgrid.com/) and sign up (Free tier available - 100 emails/day)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it "Convocation System"
5. Select **Full Access** or **Mail Send** permission
6. Click **Create & View**
7. **Copy the API key immediately** (you won't see it again!)

### Step 3: Configure Environment
Add to `apps/api/.env`:
```env
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@yourconvocation.edu"
SENDGRID_FROM_NAME="PU Convocation"
```

### Step 4: Verify Sender Email (Required!)
1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details with the email you'll use in `SENDGRID_FROM_EMAIL`
4. Check your email and click the verification link
5. ✅ Done! You can now send emails

### Step 5: Restart Your Server
```bash
cd apps/api
npm run dev
```

## 📧 Testing

### Test 1: Check Configuration
Visit admin dashboard → Email Attendees

You should see the email composer interface. If SendGrid is configured correctly, you can proceed.

### Test 2: Send Test Email
```bash
curl -X POST http://localhost:3001/api/v1/emails/send-test \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "toEmail": "your-email@example.com",
    "subject": "Test Email from Convocation System",
    "message": "This is a test email. If you receive this, your email system is working!"
  }'
```

### Test 3: Send to Attendees
1. Go to `/admin/email`
2. Select email type (Informational)
3. Select an enclosure or "All Attendees"
4. Enter subject and message
5. Click "Preview Recipients" to see who will receive the email
6. Click "Send Email" and confirm

## 🎯 Usage Examples

### Example 1: Reminder to All Attendees
```
Type: REMINDER
Recipients: All Attendees
Subject: Convocation Day Reminder - Tomorrow!
Message: 
Dear Attendees,

This is a friendly reminder that the convocation ceremony is scheduled for tomorrow at 10:00 AM.

Please arrive by 9:30 AM for registration.

Important Details:
- Venue: Main Auditorium
- Time: 10:00 AM
- Dress Code: Formal

See you tomorrow!

Best regards,
Convocation Team
```

### Example 2: Enclosure-Specific Information
```
Type: INFORMATIONAL
Recipients: Enclosures A, B
Subject: Seating Information - Enclosures A & B
Message:
Dear Attendees,

Your seats have been allocated in Enclosures A and B.

Please check your seat assignment by logging into your dashboard.

Entry will be through the North Gate.

Best regards,
Convocation Team
```

### Example 3: Promotional Email
```
Type: PROMOTIONAL
Recipients: All Attendees
Subject: Exclusive Merchandise Available!
Message:
Dear Graduates,

Celebrate your achievement with exclusive convocation merchandise!

Available items:
- Commemorative T-shirts
- Photo frames
- Certificates holders

Visit the merchandise booth at the venue.

Congratulations!
```

## ⚠️ Important Notes

1. **Free Tier Limit**: SendGrid free tier allows 100 emails/day
2. **Sender Verification**: You MUST verify your sender email before sending
3. **Valid Emails**: Only attendees with valid email addresses will receive emails
4. **Batch Processing**: System automatically batches emails to avoid rate limits
5. **Error Handling**: Failed emails are logged and reported

## 🔧 Troubleshooting

### Problem: "Email service is not configured"
**Solution**: Add `SENDGRID_API_KEY` to your `.env` file

### Problem: "Sender address not verified"
**Solution**: Complete sender verification in SendGrid dashboard

### Problem: "No recipients found"
**Solution**: Ensure attendees have email addresses in the database

### Problem: API key not working
**Solution**: 
- Check if you copied the full API key (starts with "SG.")
- Ensure the key has Mail Send permissions
- Try creating a new API key

## 📊 SendGrid Dashboard
Monitor your email activity:
- Go to **Activity** in SendGrid dashboard
- View delivery status, opens, clicks, bounces
- Check for any errors or issues

## 💰 Pricing (as of 2024)
- **Free**: 100 emails/day forever
- **Essentials**: $15/month - 50,000 emails/month
- **Pro**: $60/month - 100,000 emails/month

For a convocation with 1000 attendees, the free tier is sufficient for testing.

## ✅ Verification Checklist
- [ ] SendGrid account created
- [ ] API key generated and copied
- [ ] Environment variables configured
- [ ] Sender email verified
- [ ] API server restarted
- [ ] Test email sent successfully
- [ ] Can access `/admin/email` page
- [ ] Can preview recipients
- [ ] Can send emails to attendees

---

**Need help?** Check the full documentation in `EMAIL-SYSTEM-IMPLEMENTATION.md`
