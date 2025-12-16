# Database Setup Guide

## Option 1: Cloud PostgreSQL (Recommended for Beginners) 🌟

This is the easiest option - no local installation needed!

### Using Supabase (Free Tier Available)

1. **Sign up for Supabase**:
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub/Google/Email

2. **Create a new project**:
   - Click "New Project"
   - Choose a name (e.g., "masterlist")
   - Set a database password (save this!)
   - Select a region close to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get your connection string**:
   - Go to Project Settings → Database
   - Scroll to "Connection string" section
   - Copy the "URI" connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

4. **Update your .env file**:
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```
   Replace `[YOUR-PASSWORD]` with your actual password

### Using Neon (Free Tier Available)

1. **Sign up for Neon**:
   - Go to https://neon.tech
   - Click "Sign Up" (free tier available)
   - Sign up with GitHub/Google/Email

2. **Create a new project**:
   - Click "Create a project"
   - Choose a name (e.g., "masterlist")
   - Click "Create project"

3. **Get your connection string**:
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
   - Click "Copy" to copy it

4. **Update your .env file**:
   ```bash
   DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
   ```

---

## Option 2: Local PostgreSQL Installation

If you prefer to run PostgreSQL on your Mac:

### Step 1: Install PostgreSQL

**Using Homebrew (Recommended)**:
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15
```

**Or download from official website**:
- Go to https://www.postgresql.org/download/macosx/
- Download and install Postgres.app or use the installer

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE masterlist;

# Create a user (optional, or use default 'postgres' user)
CREATE USER masterlist_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE masterlist TO masterlist_user;

# Exit psql
\q
```

### Step 3: Update .env file

```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/masterlist"
```

---

## After Setting Up Database (Both Options)

### Step 1: Create .env file

```bash
cd /Users/ajinkya642000/Desktop/MasterList
touch .env
```

Add your DATABASE_URL to the .env file:
```bash
DATABASE_URL="your_connection_string_here"
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Create Database Tables

```bash
npx prisma db push
```

This will create all the tables (Alumni, WaitlistEmail, MatchResult) in your database.

### Step 4: Import Your Excel Data

```bash
npm run import
```

This will read your "Alumni Master List.xlsx" file and import all the data into the database.

### Step 5: Verify Data (Optional)

You can check if data was imported:

```bash
# Using Prisma Studio (visual database browser)
npx prisma studio
```

This will open a web interface at http://localhost:5555 where you can see all your data.

---

## Troubleshooting

### Connection Error?
- Make sure your DATABASE_URL is correct
- For cloud services, check if your IP needs to be whitelisted
- For local, make sure PostgreSQL is running: `brew services list`

### Import Script Not Working?
- Make sure the Excel file is in the root directory: `Alumni Master List.xlsx`
- Check that the file name matches exactly
- Make sure you've run `npx prisma db push` first

### Need Help?
- Check Prisma logs: `npx prisma db push --verbose`
- Check database connection: `npx prisma db pull`

---

## Quick Start (Recommended Path)

1. **Sign up for Supabase** (5 minutes)
2. **Create project and get connection string**
3. **Add to .env file**
4. **Run**: `npx prisma generate && npx prisma db push`
5. **Run**: `npm run import`
6. **Done!** 🎉


