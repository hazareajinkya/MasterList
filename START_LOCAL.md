# How to Start Local Development Server

## Quick Start

```bash
npm run dev
```

Then open: http://localhost:3002

## If Port 3002 is Already in Use

If you get an error that port 3002 is in use:

1. **Find and kill the process:**
   ```bash
   lsof -ti:3002 | xargs kill -9
   ```

2. **Or use a different port:**
   ```bash
   PORT=3003 npm run dev
   ```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Database connection errors
Make sure your `.env` file has:
```bash
DATABASE_URL="your-connection-string"
ADMIN_PASSWORD=Sarita@123
```

### Prisma errors
```bash
npx prisma generate
```

---

**Default URL:** http://localhost:3002

