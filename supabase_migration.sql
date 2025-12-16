-- ============================================
-- Supabase Migration - Add All New Fields
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Add all new columns to Alumni table
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

-- ============================================
-- Verify Columns Were Added
-- ============================================
-- Run this to check if columns were added:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'Alumni' 
-- AND column_name IN (
--   'mastersEnd', 'mastersGrade', 'msSkills', 'bachelorsBatch',
--   'tenthPercentage', 'twelfthPercentage', 'companySector',
--   'designation', 'linkedInProfile', 'workExperiences'
-- );

