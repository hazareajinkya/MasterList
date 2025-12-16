# Database Migration Guide - New Fields Update

## Overview
This update adds new fields to improve matching accuracy and preserve ALL data from Excel:
- **ALL Excel Columns** - Complete data preservation:
  - Master's end year
  - Master's grade
  - MS Skills
  - Bachelor's Degree Batch
  - 10th Standard Percentage/CGPA
  - 12th Standard Percentage/CGPA
  - Company Sector (auto-detected from company name)
  - Designation (job title/role)
  - LinkedIn Profile (profile URL)
  - **ALL Work Experiences** (Exp 1, Exp 2, Exp 3, Exp 4) with companies and designations

## Database Schema Changes

### New Fields Added to `Alumni` Model:
- `mastersEnd` (Int, optional) - Master's end year
- `mastersGrade` (Float, optional) - Master's grade
- `msSkills` (String, optional) - MS Skills
- `bachelorsBatch` (Int, optional) - Bachelor's Degree Batch
- `tenthPercentage` (Float, optional) - 10th Standard Percentage/CGPA
- `twelfthPercentage` (Float, optional) - 12th Standard Percentage/CGPA
- `companySector` (String, optional) - Quick access to primary company sector
- `designation` (String, optional) - Quick access to primary designation
- `linkedInProfile` (String, optional) - LinkedIn profile URL
- `workExperiences` (JSON, optional) - **Complete array of ALL work experiences**
  - Format: `[{duration, company, designation, type}, ...]`
  - Stores Exp 1, Exp 2, Exp 3, Exp 4 with all details

## Migration Steps

### Option 1: Using Prisma Migrate (Recommended)

1. **Generate Migration:**
   ```bash
   npx prisma migrate dev --name add_student_details_fields
   ```

2. **Apply Migration:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Option 2: Manual SQL Migration (For Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
-- Add new columns to Alumni table
ALTER TABLE "Alumni" 
ADD COLUMN IF NOT EXISTS "mastersEnd" INTEGER,
ADD COLUMN IF NOT EXISTS "mastersGrade" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "msSkills" TEXT,
ADD COLUMN IF NOT EXISTS "bachelorsBatch" INTEGER,
ADD COLUMN IF NOT EXISTS "tenthPercentage" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "twelfthPercentage" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "companySector" TEXT,
ADD COLUMN IF NOT EXISTS "designation" TEXT,
ADD COLUMN IF NOT EXISTS "linkedInProfile" TEXT,
ADD COLUMN IF NOT EXISTS "workExperiences" JSONB;
```

### Option 3: Using Prisma Studio (For Development)

1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. The schema changes will be automatically applied when you save.

## Re-importing Data

After migration, you may want to re-import your Excel data to populate the new fields:

```bash
npm run import-data
# or
ts-node scripts/import_data.ts
```

The import script now automatically:
- Extracts **ALL columns** from Excel including:
  - Master's end year, Master's grade, MS Skills
  - Bachelor's Degree Batch
  - 10th and 12th percentages
  - Detects company sector from company names (from Exp 1)
  - Extracts designation from first work experience (Exp 1)
  - Extracts LinkedIn Profile URL from Excel
  - **Stores ALL work experiences** (Exp 1, Exp 2, Exp 3, Exp 4) in `workExperiences` JSON field
    - Each experience includes: duration (in months), company, designation, and type
  - **100% data preservation** - every column from Excel is stored!

## What Changed

### 1. Form (`app/find-seniors/page.tsx`)
- Added Simple/Detailed mode toggle
- Added 10th percentage input
- Added 12th percentage input
- Added company name input with auto-sector detection
- Added designation dropdown
- Added disclaimer about probability-based results

### 2. Matching Algorithm (`lib/matching.ts`)
- Updated scoring to include:
  - 10th percentage (5% weight)
  - 12th percentage (5% weight)
  - Company sector (5% weight)
  - Designation (5% weight)
- Adjusted existing weights to accommodate new fields

### 3. API Route (`app/api/match/route.ts`)
- Added validation for new optional fields
- Updated to accept and process new fields

### 4. Import Script (`scripts/import_data.ts`)
- Extracts **ALL Excel columns** including:
  - Master's end year, Master's grade, MS Skills
  - Bachelor's Degree Batch
  - 10th and 12th percentages
- Detects company sector using company names (from Exp 1)
- Extracts designation from first work experience (Exp 1)
- Extracts LinkedIn Profile URL from Excel
- **Stores ALL work experiences** (Exp 1, Exp 2, Exp 3, Exp 4) in JSON format
  - Preserves complete work history with companies and designations
  - **100% data preservation** - every Excel column is imported

### 5. Company Sector Detection (`lib/companySector.ts`)
- New utility to detect company sector from company name
- Supports 15+ sectors including Technology, Finance, Consulting, Healthcare, etc.

## Testing

After migration, test the following:

1. **Form Submission:**
   - Test simple mode (basic fields only)
   - Test detailed mode (all fields)
   - Verify company sector auto-detection
   - Verify validation works correctly

2. **Matching:**
   - Submit a search with detailed fields
   - Verify matches are more accurate with additional data
   - Check that optional fields don't break matching when empty

3. **Data Import:**
   - Re-import Excel data
   - Verify new fields are populated correctly
   - Check company sector detection accuracy
   - **Verify ALL experiences are stored** in `workExperiences` JSON field
   - Check that Exp 1, Exp 2, Exp 3, Exp 4 are all preserved

## Notes

- All new fields are **optional** - existing functionality continues to work
- Company sector is auto-detected but can be manually overridden
- Designation matching uses fuzzy matching for similar roles
- The matching algorithm normalizes scores when additional fields are provided

## Rollback (If Needed)

If you need to rollback, run:

```sql
ALTER TABLE "Alumni" 
DROP COLUMN IF EXISTS "mastersEnd",
DROP COLUMN IF EXISTS "mastersGrade",
DROP COLUMN IF EXISTS "msSkills",
DROP COLUMN IF EXISTS "bachelorsBatch",
DROP COLUMN IF EXISTS "tenthPercentage",
DROP COLUMN IF EXISTS "twelfthPercentage",
DROP COLUMN IF EXISTS "companySector",
DROP COLUMN IF EXISTS "designation",
DROP COLUMN IF EXISTS "linkedInProfile",
DROP COLUMN IF EXISTS "workExperiences";
```

Then revert the code changes using git.

