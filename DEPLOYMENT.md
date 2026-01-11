# Vercel Deployment Guide

This guide explains how to deploy the DINOXE Smart Accessories e-commerce store to Vercel.

## Prerequisites

1. A Vercel account (free tier works)
2. GitHub account with the repository connected to Vercel
3. Basic understanding of environment variables

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository is pushed to GitHub and connected to Vercel:

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it as a Next.js project

### 2. Configure Environment Variables

In the Vercel project settings, add the following environment variable:

```
DATABASE_URL=file:./dev.db
```

**Important Note:**
- SQLite uses a file-based database that stores data in `prisma/dev.db`
- On Vercel's serverless environment, the database will be ephemeral (data resets on each deployment)
- For production, consider migrating to Vercel Postgres, PlanetScale, or another cloud database
- For now, the site will work but orders will reset on each new deployment

### 3. Configure Build Settings

Vercel should automatically detect these settings, but verify them:

**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Database Seeding on Vercel

Since Vercel's serverless environment is ephemeral, you'll need to seed the database. There are two approaches:

### Option 1: Use Vercel CLI (Recommended for initial setup)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push

# Seed the database
npm run seed

# Redeploy
vercel --prod
```

### Option 2: Create an API Endpoint for Seeding

Create `/app/api/seed/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Check if products already exist
    const existingProducts = await prisma.product.count()
    if (existingProducts > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Seed data here (copy from prisma/seed.ts)
    // ...
    
    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}
```

Then visit `/api/seed` after deployment to seed the database.

### Option 3: Manual Database Migration (Simplest)

After deployment, the database will be empty. You can:

1. Access your deployed site
2. Go to the admin panel: `https://your-project.vercel.app/admin/login`
3. The database will be created automatically when accessed
4. You'll need to manually add products through the admin panel

Or create a simple seeding script and run it via Vercel CLI:

```bash
vercel env pull .env
npx prisma db push
npm run seed
```

## Current Limitations with SQLite on Vercel

1. **Data Persistence**: SQLite files don't persist across deployments on Vercel
2. **Order History**: Orders will be lost on each new deployment
3. **Product Database**: Products need to be re-seeded after each deployment

## Recommended Production Database

For a production e-commerce site, migrate to:

1. **Vercel Postgres** (Recommended) - Native integration, free tier available
2. **PlanetScale** - MySQL-compatible, great free tier
3. **Supabase** - PostgreSQL, generous free tier
4. **Neon** - PostgreSQL, serverless-optimized

### Migration Steps to Vercel Postgres

1. Create a Vercel Postgres database in your project
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update Vercel environment variable with the new Postgres URL
4. Run `npx prisma db push` to migrate schema
5. Seed the database: `npm run seed`
6. Deploy

## Verifying Deployment

1. Check the Vercel dashboard for successful deployment
2. Visit your site URL
3. Test navigation between pages
4. Try adding items to cart
5. Complete a test order (as customer)
6. Check admin panel: `/admin/login`
   - Email: admin@dinoxe.com
   - Password: admin123

## Troubleshooting

### Build Fails

```bash
# Check logs in Vercel dashboard
# Common issues:
# - Missing dependencies: npm install
# - TypeScript errors: Check locally with npm run build
# - Prisma issues: npx prisma generate
```

### Database Errors

```bash
# Re-generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed database
npm run seed
```

### Environment Variables

Ensure `DATABASE_URL` is set in Vercel project settings:
- Go to Settings → Environment Variables
- Add `DATABASE_URL` with value: `file:./dev.db`

## Pull Request Workflow

To deploy from pull requests:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit and push: `git push origin feature/your-feature`
4. Open a pull request on GitHub
5. Vercel will automatically create a preview deployment
6. Test the preview URL
7. Merge to main branch for production deployment

## Continuous Deployment

Vercel will automatically redeploy when:
- You push to the main branch
- You merge a pull request to main
- You push to any connected branch (creates preview deployments)

To disable auto-deploy:
- Go to Vercel project settings
- Git → Deploy Hooks
- Configure custom deploy hooks or disable auto-deploy
