# 🚀 Quick Deployment Checklist

Use this checklist to deploy to Vercel quickly!

## Pre-Deployment

- [ ] Code is working locally (`npm run build` succeeds)
- [ ] All changes committed to git
- [ ] Code pushed to GitHub repository
- [ ] Have Supabase database connection string ready

## Vercel Setup

- [ ] Created Vercel account at [vercel.com](https://vercel.com)
- [ ] Imported GitHub repository in Vercel
- [ ] Added environment variable: `DATABASE_URL` (your Supabase connection string)
- [ ] Verified build settings (auto-detected Next.js is fine)

## Deploy

- [ ] Clicked "Deploy" in Vercel
- [ ] Build completed successfully (check logs)
- [ ] Got deployment URL (e.g., `masterlist.vercel.app`)

## Post-Deployment Testing

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Search form works
- [ ] API endpoint works: `/api/match`
- [ ] Results display correctly
- [ ] No console errors in browser

## Database

- [ ] Supabase database has all tables (`Alumni`, `WaitlistEmail`, `MatchResult`)
- [ ] Database has data (or import if needed)
- [ ] Database connection works from Vercel

## Optional

- [ ] Custom domain configured
- [ ] Analytics enabled (if desired)

---

**That's it!** Your app should be live. 🎉

For detailed instructions, see `VERCEL_DEPLOYMENT.md`

