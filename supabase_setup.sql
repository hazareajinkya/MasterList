-- ============================================
-- Master List Database Schema for Supabase
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. Create Alumni Table
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

-- 2. Create Index on Alumni for faster queries
CREATE INDEX IF NOT EXISTS "Alumni_college_branch_cgpa_workExperience_idx" 
ON "Alumni"("college", "branch", "cgpa", "workExperience");

-- 3. Create WaitlistEmail Table
CREATE TABLE IF NOT EXISTS "WaitlistEmail" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create MatchResult Table
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

-- ============================================
-- Verify Tables Created
-- ============================================
-- Run this to check if tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('Alumni', 'WaitlistEmail', 'MatchResult');


