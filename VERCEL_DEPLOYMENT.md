# Vercel Deployment Guide

This guide will walk you through deploying your MasterList application to Vercel.

## Prerequisites

Before deploying, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Your Supabase database set up and running
- ✅ Your database connection string ready

---

## Step 1: Prepare Your Code

### 1.1 Ensure Your Code is Ready

Make sure your code is working locally:
```bash
npm run build
```

If the build succeeds, you're ready to deploy!

### 1.2 Commit and Push to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Important**: Make sure `.env` is in your `.gitignore` (it should be already) - never commit your database credentials!

---

## Step 2: Set Up Vercel Project

### 2.1 Import Your Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing your MasterList code

### 2.2 Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

---

## Step 3: Configure Environment Variables

This is **CRITICAL** - your app won't work without the database connection!

### 3.1 Get Your Database Connection String

1. Go to your **Supabase Dashboard**
2. Navigate to **Project Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

Example format:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### 3.2 Add Environment Variable in Vercel

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add the following:

   **Name**: `DATABASE_URL`
   
   **Value**: Your full connection string (e.g., `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres`)
   
   **Environment**: Select all (Production, Preview, Development)

4. Click **"Save"**

### 3.3 Verify Environment Variables

Make sure you have:
- ✅ `DATABASE_URL` - Your Supabase PostgreSQL connection string

---

## Step 4: Deploy!

### 4.1 Initial Deployment

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (usually 2-5 minutes)
3. Vercel will show you the deployment URL (e.g., `masterlist.vercel.app`)

### 4.2 Monitor the Build

Watch the build logs for any errors. Common issues:
- ❌ **Prisma Client not generated**: Should be fixed by `postinstall` script
- ❌ **Database connection error**: Check your `DATABASE_URL` environment variable
- ❌ **Build errors**: Check the logs for specific TypeScript/Next.js errors

---

## Step 5: Verify Deployment

### 5.1 Test Your Live Site

1. Visit your deployment URL
2. Test the main features:
   - ✅ Homepage loads
   - ✅ Search form works
   - ✅ API endpoints respond (check `/api/match`)
   - ✅ Results page displays correctly

### 5.2 Check API Routes

Test your API endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "college": "Test College",
    "bachelorsBranch": "Computer Science",
    "mastersPrograms": ["MS in CS"],
    "workExperience": 2,
    "cgpa": 8.5
  }'
```

---

## Step 6: Set Up Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

---

## Step 7: Database Setup on Production

### 7.1 Ensure Database Tables Exist

Your Supabase database should already have the tables. If not:

1. Go to Supabase SQL Editor
2. Run the SQL from `supabase_setup.sql` or `SUPABASE_SETUP.md`
3. Verify tables exist: `Alumni`, `WaitlistEmail`, `MatchResult`

### 7.2 Import Data (If Needed)

If you need to import data to production:

**Option A: Use Supabase Dashboard**
- Go to Table Editor → Alumni
- Import via CSV/Excel

**Option B: Run Import Script Locally**
- Set `DATABASE_URL` to your production database
- Run: `npm run import`

**⚠️ Warning**: Be careful not to overwrite production data!

---

## Troubleshooting

### Build Fails: "Prisma Client not found"

**Solution**: The `postinstall` script should handle this. If it doesn't:
1. Check that `postinstall` script exists in `package.json`
2. Manually add build command: `prisma generate && next build`

### Build Fails: "Cannot connect to database"

**Solution**: 
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Check that your Supabase database allows connections from Vercel IPs
3. Ensure your database password doesn't contain special characters that need URL encoding

### Runtime Error: "Database connection failed"

**Solution**:
1. Check Vercel logs: **Deployments** → Select deployment → **Logs**
2. Verify `DATABASE_URL` environment variable is set
3. Test database connection string locally
4. Check Supabase database is running and accessible

### API Routes Return 500 Errors

**Solution**:
1. Check Vercel function logs
2. Verify database connection
3. Check that Prisma Client is generated (should happen automatically)
4. Review error messages in Vercel dashboard

### Environment Variables Not Working

**Solution**:
1. Make sure variables are set for the correct environment (Production/Preview/Development)
2. Redeploy after adding environment variables
3. Check variable names match exactly (case-sensitive)

---

## Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Homepage loads correctly
- [ ] Search form is functional
- [ ] API endpoints respond correctly
- [ ] Database queries work
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring set up (optional)

---

## Continuous Deployment

Once set up, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run builds automatically

### Manual Deployment

If you need to redeploy manually:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment

---

## Environment-Specific Configuration

You can set different environment variables for:
- **Production**: Your live site
- **Preview**: Pull request previews
- **Development**: Local development (if using Vercel CLI)

Set these in **Settings** → **Environment Variables** by selecting the appropriate environment.

---

## Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use environment variables** for all secrets
3. ✅ **Rotate database passwords** periodically
4. ✅ **Enable Vercel's security features** (DDoS protection, etc.)
5. ✅ **Use Supabase Row Level Security** if needed for sensitive data

---

## Monitoring and Analytics

### Vercel Analytics (Optional)

1. Go to **Analytics** tab in Vercel
2. Enable Vercel Analytics (may require upgrade)
3. Monitor performance and errors

### Check Logs

- **Function Logs**: See API route execution logs
- **Build Logs**: See build-time errors
- **Runtime Logs**: See server-side errors

---

## Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Prisma Deployment**: [prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment)

---

## Quick Reference

**Deployment URL**: `https://your-project.vercel.app`

**Environment Variables Needed**:
- `DATABASE_URL` - PostgreSQL connection string

**Build Command**: `npm run build` (includes Prisma generate)

**Install Command**: `npm install` (includes Prisma generate via postinstall)

---

Good luck with your deployment! 🚀

