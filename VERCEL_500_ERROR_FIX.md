# Fixing 500 Error on Vercel - Supabase Connection Issues

## Common Causes of 500 Error

The 500 error when clicking "Find My Senior" is usually caused by:
1. ❌ **Connection string format issue** (password with `@` symbol)
2. ❌ **Supabase IP restrictions** blocking Vercel
3. ❌ **Missing SSL mode** in connection string
4. ❌ **Connection pooling not configured** for serverless

---

## Solution 1: Fix Connection String Format (CRITICAL)

Your password contains an `@` symbol which breaks the connection string. You need to URL-encode it.

### Current (BROKEN):
```
postgresql://postgres:Lamborginidream@6420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require
```

### Fixed (USE THIS IN VERCEL):
```
postgresql://postgres:Lamborginidream%406420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require
```

**Key change:** `@` in password becomes `%40`

### Steps to Fix in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` and click **Edit**
3. Replace the value with:
   ```
   postgresql://postgres:Lamborginidream%406420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require
   ```
4. Click **Save**
5. **Redeploy** your application (go to Deployments → Latest → Redeploy)

---

## Solution 2: Use Connection Pooling (RECOMMENDED for Vercel)

For serverless environments like Vercel, Supabase recommends using **Connection Pooling**.

### Get Pooled Connection String:

1. Go to **Supabase Dashboard** → **Project Settings** → **Database**
2. Scroll to **Connection Pooling** section
3. You'll see connection strings for different modes:
   - **Session mode** (recommended for Prisma)
   - **Transaction mode**
4. Copy the **Session mode** connection string
5. It will look like:
   ```
   postgresql://postgres.qusbnsbtshvnmedloeys:[YOUR-PASSWORD]@aws-0-xx-xx.pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your password (URL-encode `@` as `%40`)
7. Add `?sslmode=require` at the end

### Final Pooled Connection String:
```
postgresql://postgres.qusbnsbtshvnmedloeys:Lamborginidream%406420@aws-0-xx-xx.pooler.supabase.com:6543/postgres?sslmode=require
```

**Note:** The host will be different (pooler.supabase.com instead of db.xxxxx.supabase.co)

---

## Solution 3: Check Supabase IP Restrictions

Supabase might be blocking connections from Vercel. Check these settings:

### In Supabase Dashboard:

1. Go to **Project Settings** → **Database**
2. Scroll to **Connection Pooling** section
3. Check if there are any **IP restrictions** enabled
4. If yes, you need to either:
   - **Disable IP restrictions** (for development/testing)
   - **Add Vercel's IP ranges** (complex, not recommended)

### Recommended: Disable IP Restrictions (for now)

1. Go to **Project Settings** → **Database**
2. Look for **"Restrict connections to specific IP addresses"** or similar
3. Make sure it's **disabled** or set to allow all connections

---

## Solution 4: Verify Connection String in Vercel

### Check Current Environment Variable:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` exists
3. Check the value - make sure:
   - Password is URL-encoded (`@` → `%40`)
   - Includes `?sslmode=require` at the end
   - No extra spaces or quotes

### Test Connection String Format:

The connection string should follow this pattern:
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

Where:
- `[user]` = `postgres` (or `postgres.xxxxx` for pooling)
- `[password]` = Your password with `@` encoded as `%40`
- `[host]` = `db.xxxxx.supabase.co` or `aws-0-xx-xx.pooler.supabase.com`
- `[port]` = `5432` (direct) or `6543` (pooling)
- `[database]` = `postgres`

---

## Solution 5: Check Vercel Logs

To see the actual error:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **"Functions"** tab
4. Find `/api/match` function
5. Click on it to see logs
6. Look for error messages like:
   - `P1001: Can't reach database server`
   - `P1000: Authentication failed`
   - `Connection refused`
   - `SSL connection required`

---

## Quick Fix Checklist

- [ ] **Connection string has URL-encoded password** (`@` → `%40`)
- [ ] **Connection string includes `?sslmode=require`**
- [ ] **Environment variable is set in Vercel** (Settings → Environment Variables)
- [ ] **Environment variable is set for all environments** (Production, Preview, Development)
- [ ] **Redeployed after changing environment variable**
- [ ] **Supabase IP restrictions are disabled** (or Vercel IPs are allowed)
- [ ] **Using connection pooling** (recommended for serverless)

---

## Recommended Connection String for Vercel

Use this format (with your actual values):

### Option A: Direct Connection (if pooling not available)
```
postgresql://postgres:Lamborginidream%406420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require
```

### Option B: Connection Pooling (BEST for Vercel)
```
postgresql://postgres.qusbnsbtshvnmedloeys:Lamborginidream%406420@aws-0-xx-xx.pooler.supabase.com:6543/postgres?sslmode=require
```

**Replace `aws-0-xx-xx` with your actual pooler host from Supabase dashboard.**

---

## After Making Changes

1. **Save** the environment variable in Vercel
2. **Redeploy** your application:
   - Go to **Deployments** → Latest deployment → **Redeploy**
3. **Test** the "Find My Senior" feature again
4. **Check logs** if it still fails

---

## Still Not Working?

1. **Check Vercel function logs** for specific error messages
2. **Test connection locally** with the same connection string
3. **Verify Supabase database is running** (check Supabase dashboard)
4. **Try resetting database password** in Supabase and updating connection string

---

## Need Help?

Share the error message from Vercel logs, and I can help debug further!

