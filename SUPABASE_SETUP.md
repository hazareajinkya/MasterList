# Supabase Setup Guide - Step by Step

## Step 1: Run SQL in Supabase SQL Editor

1. **Open Supabase SQL Editor** (you're already there!)
2. **Copy the entire SQL script** from `supabase_setup.sql` or use the SQL below
3. **Paste it into the SQL Editor**
4. **Click "Run"** (or press Cmd+Enter)

### SQL Script to Run:

```sql
-- Create Alumni Table
CREATE TABLE IF NOT EXISTS "Alumni" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "cgpa" DOUBLE PRECISION NOT NULL,
  "workExperience" DOUBLE PRECISION NOT NULL,
  "branch" TEXT NOT NULL,
  "university" TEXT NOT NULL,
  "course" TEXT,
  "location" TEXT,
  "admittedYear" INTEGER,
  "college" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Index for faster queries
CREATE INDEX IF NOT EXISTS "Alumni_college_branch_cgpa_workExperience_idx" 
ON "Alumni"("college", "branch", "cgpa", "workExperience");

-- Create WaitlistEmail Table
CREATE TABLE IF NOT EXISTS "WaitlistEmail" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create MatchResult Table
CREATE TABLE IF NOT EXISTS "MatchResult" (
  "id" TEXT PRIMARY KEY,
  "userCGPA" DOUBLE PRECISION NOT NULL,
  "userWorkEx" DOUBLE PRECISION NOT NULL,
  "userBranch" TEXT NOT NULL,
  "userCollege" TEXT NOT NULL,
  "userCourses" TEXT[] NOT NULL,
  "universities" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Verify Tables Were Created:

Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Alumni', 'WaitlistEmail', 'MatchResult');
```

You should see all 3 tables listed.

---

## Step 2: Get Your Database Connection String

1. **In Supabase Dashboard**, go to **Project Settings** (gear icon in left sidebar)
2. Click on **Database** tab
3. Scroll down to **Connection string** section
4. Under **URI**, you'll see a connection string like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **Copy this connection string**
6. **Replace `[YOUR-PASSWORD]`** with your actual database password (the one you set when creating the project)

---

## Step 3: Create .env File in Your Project

1. **Go back to your terminal** (in the MasterList directory)
2. **Create .env file**:
   ```bash
   cd /Users/ajinkya642000/Desktop/MasterList
   touch .env
   ```
3. **Open .env file** and add:
   ```bash
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```
   Replace:
   - `YOUR_ACTUAL_PASSWORD` with your Supabase database password
   - `db.xxxxx.supabase.co` with your actual Supabase host

**Example:**
```bash
DATABASE_URL="postgresql://postgres:mypassword123@db.abcdefghijk.supabase.co:5432/postgres"
```

---

## Step 4: Generate Prisma Client

This connects Prisma to your database schema:

```bash
npx prisma generate
```

You should see: `✔ Generated Prisma Client`

---

## Step 5: Verify Prisma Can Connect

This will sync Prisma with your database (it should detect the tables you created):

```bash
npx prisma db pull
```

This should show that it found your 3 tables.

---

## Step 6: Import Your Excel Data

Now import all the alumni data from your Excel file:

```bash
npm run import
```

This will:
- Read `Alumni Master List.xlsx`
- Parse all the data
- Insert records into the `Alumni` table

You should see output like:
```
Found 40 rows to import
Imported: Dhrumil Raigagla -> Georgia Institute of Technology
Imported: Prasad S. -> University at Buffalo
...
Import complete!
Imported: 40
Skipped: 0
```

---

## Step 7: Verify Data (Optional)

You can check your data in Supabase:

1. **Go to Supabase Dashboard** → **Table Editor**
2. Click on **Alumni** table
3. You should see all your imported records!

Or use Prisma Studio (visual database browser):
```bash
npx prisma studio
```
This opens http://localhost:5555 where you can browse your data.

---

## Step 8: Start Your Application

```bash
npm run dev
```

Open http://localhost:3000 and test your application!

---

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the SQL script in Supabase SQL Editor
- Check that tables were created using the verification query

### Error: "connection refused" or "password authentication failed"
- Double-check your DATABASE_URL in .env file
- Make sure password is correct (no extra spaces)
- Make sure connection string is in quotes: `DATABASE_URL="..."`

### Error: "Cannot find module '@prisma/client'"
- Run: `npm install`
- Then: `npx prisma generate`

### Import script fails
- Make sure Excel file is named exactly: `Alumni Master List.xlsx`
- Make sure it's in the root directory: `/Users/ajinkya642000/Desktop/MasterList/`
- Make sure tables exist first (run SQL script)

---

## Summary Checklist

- [ ] Run SQL script in Supabase SQL Editor
- [ ] Verify 3 tables were created
- [ ] Get connection string from Supabase Settings
- [ ] Create .env file with DATABASE_URL
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db pull` (verify connection)
- [ ] Run `npm run import` (import Excel data)
- [ ] Verify data in Supabase Table Editor
- [ ] Run `npm run dev` and test app!

---

## What Each Table Does

1. **Alumni**: Stores all the senior/alumni profiles from your Excel file
2. **WaitlistEmail**: Stores emails of users who sign up for v2 early access
3. **MatchResult**: (Optional) Can store user search queries and results for analytics


