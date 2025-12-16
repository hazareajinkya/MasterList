# Master List

A platform to help students discover which universities they might be eligible for based on profiles of seniors from their college who have successfully gained admission to top universities abroad.

## Features

- **Profile Matching**: Enter your details (college, courses, CGPA, work experience) and get matched with universities
- **Similarity Algorithm**: Advanced matching algorithm that considers CGPA, work experience, and course preferences
- **University Suggestions**: Get ranked list of universities with match percentages
- **Email Waitlist**: Sign up for v2 early access to see detailed senior profiles

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Data Import**: TypeScript script using xlsx library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Excel file with alumni data

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MasterList
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@localhost:5432/masterlist?schema=public"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Import alumni data:
```bash
npm run import
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
MasterList/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── find-seniors/      # Search form page
│   ├── results/           # Results display page
│   ├── about/             # About & Contact page
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   └── matching.ts       # Matching algorithm
├── prisma/               # Prisma schema
├── scripts/              # Data import scripts
└── public/               # Static assets
```

## Database Schema

- **Alumni**: Stores alumni profiles with CGPA, work experience, branch, university, etc.
- **WaitlistEmail**: Stores emails for v2 early access
- **MatchResult**: Stores user search queries and results (optional)

## Matching Algorithm

The matching algorithm uses weighted scoring:
- **CGPA** (40% weight): ±0.5 range matching
- **Work Experience** (30% weight): ±1 year range matching
- **Course/Branch** (30% weight): Exact or related course matching

Only matches with score ≥ 50% are shown.

## Deployment

The app can be deployed on Vercel with a PostgreSQL database (Supabase, Neon, etc.).

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## License

ISC

