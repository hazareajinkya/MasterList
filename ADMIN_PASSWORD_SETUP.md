# Admin Password Setup Guide

## How to Set Up Password Protection for Admin Panel

The admin panel is now password-protected. Only you can access it with the correct password.

---

## Step 1: Set Password in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Your desired password (e.g., `MySecurePassword123`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**

### Important:
- Choose a strong password
- Don't share this password publicly
- The password is case-sensitive

---

## Step 2: Set Password Locally (Optional)

For local development, create or update your `.env` file:

```bash
ADMIN_PASSWORD=MySecurePassword123
```

**Note:** `.env` is already in `.gitignore`, so your password won't be committed to git.

---

## Step 3: Redeploy (If Already Deployed)

After adding the environment variable in Vercel:

1. Go to **Deployments** → Latest deployment
2. Click **"Redeploy"**
3. Wait for deployment to complete

---

## Step 4: Access Admin Panel

1. Go to: `https://your-app.vercel.app/admin`
2. You'll see a login form
3. Enter your password
4. Click "Login"
5. You'll have access to the admin dashboard

---

## How It Works

- **Password Check**: Password is verified against `ADMIN_PASSWORD` environment variable
- **Session Storage**: Once logged in, you stay logged in for the browser session
- **Logout**: Click "Logout" button to end your session
- **Security**: Password is never exposed to the client-side code

---

## Troubleshooting

### "Admin authentication not configured" Error

**Solution**: Make sure `ADMIN_PASSWORD` is set in Vercel environment variables and redeploy.

### "Invalid password" Error

**Solution**: 
- Check that the password matches exactly (case-sensitive)
- Make sure you're using the correct environment variable
- Try redeploying after setting the password

### Can't Access Admin Panel on Vercel

**Possible Issues**:
1. Environment variable not set → Add `ADMIN_PASSWORD` in Vercel
2. Not redeployed → Redeploy after adding environment variable
3. Wrong password → Double-check the password

---

## Security Best Practices

1. ✅ Use a strong, unique password
2. ✅ Don't commit password to git (already in `.gitignore`)
3. ✅ Use environment variables (not hardcoded)
4. ✅ Change password periodically
5. ✅ Don't share the password publicly

---

## Quick Reference

**Environment Variable Name**: `ADMIN_PASSWORD`

**Admin URL**: `https://your-app.vercel.app/admin`

**Local URL**: `http://localhost:3002/admin`

---

That's it! Your admin panel is now password-protected. 🔒

