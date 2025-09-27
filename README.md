# SaaS Notes Application

A multi-tenant SaaS Notes Application with role-based access control and subscription feature gating, deployed on Vercel.

## Features

- **Multi-Tenancy**: Support for multiple tenants (Acme and Globex) with strict data isolation
- **Authentication**: JWT-based login system
- **Role-Based Access**: Admin and Member roles with different permissions
- **Subscription Gating**: Free plan (3 notes limit) and Pro plan (unlimited notes)
- **CRUD Operations**: Full notes management with tenant isolation
- **Modern UI**: Responsive frontend built with Next.js and Tailwind CSS

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach for multi-tenancy:

- All tables include a `tenantId` foreign key that references the `Tenant` table
- Database queries are filtered by `tenantId` to ensure strict data isolation
- This approach provides good performance while maintaining data separation
- The tenant isolation is enforced at the application level in all API endpoints

### Database Schema

```sql
Tenant (id, slug, name, plan, createdAt, updatedAt)
User (id, email, password, role, tenantId, createdAt, updatedAt)
Note (id, title, content, tenantId, userId, createdAt, updatedAt)
```

## Test Accounts

All test accounts use the password: `password`

| Email | Role | Tenant | Plan |
|-------|------|--------|------|
| admin@acme.test | Admin | Acme | Free |
| user@acme.test | Member | Acme | Free |
| admin@globex.test | Admin | Globex | Free |
| user@globex.test | Member | Globex | Free |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Health Check
- `GET /api/health` - Health endpoint

### Notes (CRUD)
- `GET /api/notes` - List all notes for current tenant
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Subscription Management
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant to Pro (Admin only)

## Role Permissions

### Admin
- Can create, view, edit, and delete notes
- Can upgrade tenant subscription to Pro
- Can invite users (endpoint not implemented in this version)

### Member
- Can create, view, edit, and delete notes
- Cannot upgrade subscription
- Cannot invite users

## Subscription Plans

### Free Plan
- Maximum 3 notes per tenant
- All CRUD operations available
- Upgrade banner shown when limit reached

### Pro Plan
- Unlimited notes
- All CRUD operations available
- No restrictions

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env.local
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Set up database:
```bash
npm run db:push
```

5. Seed the database with test accounts:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

## Deployment on Vercel

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `JWT_SECRET`: A secure random string
   - `DATABASE_URL`: Your database connection string
4. Deploy

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: Database connection string

## Security Features

- JWT-based authentication with 7-day expiration
- Password hashing using bcrypt
- Tenant isolation enforced at database query level
- Role-based access control
- CORS enabled for API access

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Vercel

## Testing

The application includes automated test validation for:
- Health endpoint availability
- Successful login for all predefined accounts
- Tenant isolation enforcement
- Role-based restrictions
- Free plan note limit enforcement
- Pro plan upgrade functionality
- CRUD endpoint functionality
- Frontend accessibility

## CORS Configuration

CORS is enabled to allow automated scripts and dashboards to access the API endpoints.
