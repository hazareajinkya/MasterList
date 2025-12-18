# How to Get Your Supabase Connection String

## Current Connection String Format

Based on your setup, your connection string should be:
```
postgresql://postgres:Lamborginidream@6420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require
```

## How to Get/Verify Your Connection String in Supabase

### Method 1: Project Settings (Recommended)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Click on Settings** (gear icon in left sidebar)
4. **Click on Database** tab
5. **Scroll down to "Connection string"** section
6. **Under "URI"**, you'll see the connection string
7. **Copy it** - it will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
8. **Replace `[YOUR-PASSWORD]`** with your actual database password
9. **Add `?sslmode=require`** at the end for secure connection

### Method 2: Connection Pooling (Alternative)

If you see "Connection pooling" section:
- Use the "Session" mode connection string
- Format: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xx.pooler.supabase.com:6543/postgres`

### Method 3: Direct Database Connection

1. Go to **Settings** → **Database**
2. Look for **"Connection string"** or **"Database URL"**
3. Copy the connection string
4. Make sure it includes:
   - Host: `db.xxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: Your database password

## Your Current Setup

Your `.env` file should contain:
```bash
DATABASE_URL="postgresql://postgres:Lamborginidream@6420@db.qusbnsbtshvnmedloeys.supabase.co:5432/postgres?sslmode=require"
```

**Components:**
- **User**: `postgres`
- **Password**: `Lamborginidream@6420`
- **Host**: `db.qusbnsbtshvnmedloeys.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **SSL Mode**: `require` (for secure connection)

## Verify Connection String is Working

Run this to test:
```bash
npx tsx scripts/test_connection.ts
```

If you see "✅ Database connection successful!", your connection string is correct.

## If You Need to Reset Password

1. Go to **Settings** → **Database**
2. Click **"Reset database password"**
3. Set a new password
4. Update your `.env` file with the new password

## Security Note

⚠️ **Never commit your `.env` file to git!** It's already in `.gitignore` for security.

