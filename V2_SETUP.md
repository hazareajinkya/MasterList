# Master List V2 Setup Guide

## Overview

V2 is an enhanced version of Master List with exclusive features for authorized users:
- Full senior profiles with complete details
- LinkedIn integration
- Direct connection requests
- Enhanced search and filtering
- And more features coming soon!

---

## Access V2

**URL:** `https://your-app.vercel.app/v2`

Users will need:
- **Admin ID** (set in environment variable)
- **Password** (set in environment variable)

---

## Setup Instructions

### Step 1: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these two variables:

   **Variable 1:**
   - **Name**: `V2_ADMIN_ID`
   - **Value**: Your desired admin ID (e.g., `admin123`)
   - **Environment**: All (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `V2_PASSWORD`
   - **Value**: Your desired password (e.g., `SecurePass456`)
   - **Environment**: All (Production, Preview, Development)

3. Click **"Save"** for each variable

### Step 2: Set Environment Variables Locally

Add to your `.env` file:

```bash
V2_ADMIN_ID=admin123
V2_PASSWORD=SecurePass456
```

### Step 3: Redeploy (If Already Deployed)

After adding environment variables:
1. Go to **Deployments** → Latest deployment
2. Click **"Redeploy"**
3. Wait for deployment to complete

---

## V2 Features

### Current Features:
1. ✅ **Secure Authentication** - Admin ID + Password
2. ✅ **Full Senior Profiles** - Complete academic and professional details
3. ✅ **LinkedIn Integration** - Direct links to senior LinkedIn profiles
4. ✅ **Enhanced Search** - Search by name, university, college, course, branch
5. ✅ **Profile View** - Detailed view of each senior's profile
6. ✅ **Connection Requests** - Request to connect with seniors (UI ready)

### Coming Soon:
- Direct messaging with seniors
- Email notifications
- Advanced filtering
- Analytics dashboard
- Export profiles
- And more!

---

## How It Works

1. **Access Control:**
   - V2 is only accessible via `/v2` URL
   - Requires authentication (Admin ID + Password)
   - Session-based authentication (stored in browser)

2. **Data Access:**
   - V2 has access to all senior profiles
   - Shows complete information (CGPA, work experience, LinkedIn, etc.)
   - Real-time data from database

3. **User Experience:**
   - Clean, modern interface
   - Search and filter seniors
   - View detailed profiles
   - Connect via LinkedIn
   - Request connections

---

## Security

- ✅ Password-protected access
- ✅ Environment variables for credentials
- ✅ Session-based authentication
- ✅ Separate from main site (v1)

---

## Testing

1. **Test Login:**
   - Go to `/v2`
   - Enter Admin ID and Password
   - Should redirect to `/v2/dashboard`

2. **Test Features:**
   - Search for seniors
   - View profiles
   - Click LinkedIn links
   - Test logout

---

## Troubleshooting

### "V2 authentication not configured"
- Make sure `V2_ADMIN_ID` and `V2_PASSWORD` are set in Vercel
- Redeploy after adding environment variables

### "Invalid admin ID or password"
- Check that credentials match environment variables exactly
- Case-sensitive

### Can't access dashboard
- Make sure you're logged in
- Check session storage in browser
- Try logging in again

---

## Quick Reference

**V2 URL:** `https://your-app.vercel.app/v2`

**Environment Variables:**
- `V2_ADMIN_ID` - Admin ID for login
- `V2_PASSWORD` - Password for login

**Routes:**
- `/v2` - Login page
- `/v2/dashboard` - Main dashboard (requires auth)

---

Enjoy V2! 🚀

