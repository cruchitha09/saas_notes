# Deployment Instructions

## Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy the application**:
```bash
vercel
```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add the following variables:
     - `JWT_SECRET`: A secure random string (e.g., generate with `openssl rand -base64 32`)
     - `DATABASE_URL`: For production, use a hosted database like PlanetScale, Supabase, or Railway

## Environment Variables for Production

### Required Variables:
- `JWT_SECRET`: Secure random string for JWT signing
- `DATABASE_URL`: Production database connection string

### Example Production Database URLs:
- **PlanetScale**: `mysql://username:password@host:port/database?sslaccept=strict`
- **Supabase**: `postgresql://postgres:password@host:port/database`
- **Railway**: `postgresql://postgres:password@host:port/database`

## Database Migration for Production

1. **Update Prisma schema** for production database:
```prisma
datasource db {
  provider = "postgresql" // or "mysql" depending on your choice
  url      = env("DATABASE_URL")
}
```

2. **Generate and push schema**:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## CORS Configuration

The application is configured to allow CORS for automated testing. The API endpoints are accessible from any origin.

## Health Check

After deployment, verify the health endpoint:
```
GET https://your-app.vercel.app/api/health
```

Should return: `{"status":"ok"}`

## Test Accounts

All test accounts are seeded with password: `password`

- admin@acme.test (Admin, Acme)
- user@acme.test (Member, Acme)  
- admin@globex.test (Admin, Globex)
- user@globex.test (Member, Globex)
