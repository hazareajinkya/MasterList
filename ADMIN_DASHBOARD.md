# Admin Dashboard Guide

## Access Your Admin Dashboard

You can now view all user inputs and data through the admin dashboard!

### URL

**Local Development:**
```
http://localhost:3002/admin
```

**Production (Vercel):**
```
https://your-app.vercel.app/admin
```

---

## What You Can See

### 1. Waitlist Emails Tab
- All emails from users who signed up for v2 early access
- Shows email address and sign-up date
- Automatically updates as new users sign up

### 2. User Searches Tab
- All search queries from users using "Find My Senior"
- Shows:
  - College name
  - Bachelor's branch
  - CGPA
  - Work experience
  - Master's programs they're interested in
  - Search timestamp
- Displays the last 100 searches

---

## Features

- ✅ **Real-time Data**: Click "Refresh" to see latest entries
- ✅ **Tabbed Interface**: Switch between Waitlist and Searches
- ✅ **Clean UI**: Easy to read table format
- ✅ **Automatic Saving**: All user searches are automatically saved

---

## How It Works

### Waitlist Emails
- Stored when users submit their email via the waitlist form
- Saved to `WaitlistEmail` table in database

### User Searches
- Automatically saved when users click "Find My Senior"
- Stored in `MatchResult` table with:
  - User's profile (CGPA, work experience, etc.)
  - Their search criteria
  - The matched universities they received
- Non-blocking: If saving fails, the search still works

---

## Security Note

⚠️ **Important**: The admin page is currently public. For production, you should:

1. **Add Authentication**: Protect the `/admin` route with login
2. **Add Password Protection**: Simple password check
3. **Use Environment Variable**: Check for admin key in environment

### Quick Password Protection (Optional)

You can add a simple password check by:
1. Adding an environment variable `ADMIN_PASSWORD` in Vercel
2. Updating the admin page to require password before showing data

---

## Viewing Data in Supabase

You can also view data directly in Supabase:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Click on:
   - **WaitlistEmail** table → See all emails
   - **MatchResult** table → See all search queries

---

## API Endpoints

The admin dashboard uses these API endpoints:

- `GET /api/admin/waitlist` - Get all waitlist emails
- `GET /api/admin/searches` - Get all user search queries

You can also call these directly if needed.

---

## Troubleshooting

### No data showing?
- Make sure users have actually used the features
- Check that the database connection is working
- Verify tables exist in Supabase

### Can't access admin page?
- Make sure you're using the correct URL: `/admin`
- Check that the page deployed correctly to Vercel

---

Enjoy monitoring your user activity! 🎉

