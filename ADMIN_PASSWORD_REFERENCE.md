# Admin Password Reference

## Your Admin Password

**Password**: `Sarita@123`

---

## Quick Setup Instructions

### For Vercel (Production):

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"** (or edit if it already exists)
3. Set:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: `Sarita@123`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**
5. **Redeploy** your application (Deployments → Latest → Redeploy)

### For Local Development:

Add this to your `.env` file (create it if it doesn't exist):

```bash
ADMIN_PASSWORD=Sarita@123
```

Then restart your dev server:
```bash
npm run dev
```

---

## Access Admin Panel

- **Vercel**: `https://your-app.vercel.app/admin`
- **Local**: `http://localhost:3002/admin`

Enter password: `Sarita@123`

---

**Note**: This file is for your reference only. The password is stored securely in environment variables and is not committed to git.

