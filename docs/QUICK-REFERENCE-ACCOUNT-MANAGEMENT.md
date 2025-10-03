# Quick Reference: Account Management Changes

## 🎯 What Changed?

### ❌ Removed:
- Public registration page at `/register`
- "Register Now" buttons from homepage and header
- Self-service account creation

### ✅ Added:
- Admin-only account creation at `/admin/create-account`
- Secure account creation API endpoint
- Role-based account creation (Student, Admin, Super Admin)

---

## 🔐 How to Create New Accounts (Admins Only)

### Step 1: Login as Admin
Navigate to your convocation portal and login with admin credentials.

### Step 2: Access Account Creation
Go to: **Dashboard → Admin → Create Account**
Or directly: `https://your-domain.com/admin/create-account`

### Step 3: Fill Account Details
- First Name & Last Name
- Email Address (must be unique)
- Password & Confirm Password
- Select Role:
  - **Student**: Standard user access
  - **Admin**: Can manage system and create accounts
  - **Super Admin**: Full system access

### Step 4: Create Account
Click "Create Account" button. User will be notified and can login immediately.

---

## 📊 Excel Upload - Student Records

### ✅ Confirmed: Data Goes to Attendee Collection

When you upload student data via Excel:

**Upload Location:** `/admin/upload-students`

**What Happens:**
1. Excel file is parsed
2. Data is validated
3. Records are stored in **Attendee** MongoDB collection
4. Upload summary is displayed

**Fields Stored:**
- enrollmentId (unique identifier)
- name, email, phone
- school, course, degree
- crr, enclosure
- convocationEligible, convocationRegistered

**Important:** Excel upload creates **Attendee records** (student data), NOT user accounts. To create login accounts, use the Create Account page.

---

## 🔑 API Endpoints

### Create Account (Admin Only)
```bash
POST /api/v1/auth/admin/create-account
Authorization: Bearer <admin-token>

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "STUDENT"
}
```

### Upload Students (Admin Only)
```bash
POST /api/v1/attendees/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

Body:
- file: Excel file
- skipDuplicates: true/false
- updateExisting: true/false
```

---

## 📝 Quick FAQ

### Q: Can students still register?
**A:** No, public registration is disabled. Admins must create accounts.

### Q: How do new students get accounts?
**A:** Admins create accounts using the "Create Account" page in the admin dashboard.

### Q: Does Excel upload create user accounts?
**A:** No, Excel upload creates **Attendee records** (student data) only. User accounts must be created separately via "Create Account" page.

### Q: Can I link an account to an attendee record?
**A:** Yes, the Account and Attendee models have a relationship via `accountId`. You can link them by setting the `accountId` field in the Attendee record.

### Q: Who can access the Create Account page?
**A:** Only users with ADMIN or SUPER_ADMIN roles.

### Q: What happens to existing accounts?
**A:** All existing accounts remain unchanged and functional.

---

## 🚀 Next Steps for Admins

1. **Review Existing Accounts**
   - Check current user accounts in database
   - Identify which attendees need login accounts

2. **Create Necessary Accounts**
   - Create accounts for users who need portal access
   - Assign appropriate roles

3. **Upload Student Data**
   - Prepare Excel file with student details
   - Upload via `/admin/upload-students`
   - Review upload results

4. **Link Accounts to Attendees** (if needed)
   - Update Attendee records with `accountId`
   - This connects login accounts to student data

---

## 📞 Support

For questions or issues:
- Check the detailed documentation: `docs/ACCOUNT-MANAGEMENT-UPDATE.md`
- Review API logs for error details
- Contact system administrator

---

**Last Updated:** 2025-01-04
