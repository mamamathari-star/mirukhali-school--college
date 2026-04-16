# Mirukhali School & College — Official Website

> মিরুখালী স্কুল এন্ড কলেজ | EIIN: 102726 | Est. 1937 | Mirukhali, Mathbaria, Pirojpur, Bangladesh

A full-stack Next.js 14 App Router application for Mirukhali School & College — covering public information, certificate verification, results, admissions, and a full admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL via Prisma ORM |
| Auth | NextAuth.js v5 (auth.js) |
| Password | bcryptjs |
| QR Codes | qrcode |
| Forms | react-hook-form / useState |
| Validation | Zod |

---

## Features

### Public Pages
- **Homepage** — Hero, stats, latest notices, facilities overview
- **About** — History timeline (1937→1962→1967→present), mission & vision
- **Academics** — SSC & HSC programs, subjects, grading system
- **Teachers** — Staff directory with photos and designations
- **Notices** — Filterable notice board with category tabs
- **Results** — Student result search by name/admission number
- **Admission** — Online application form
- **Committee** — Managing committee directory
- **Gallery** — Photo gallery with lightbox
- **Facilities** — Campus facilities showcase
- **Contact** — Contact form + information
- **Certificate Verification** — Public QR/number-based verification portal

### Admin Dashboard
- Dashboard with live statistics
- Teacher management (CRUD + photo upload)
- Student management (CRUD)
- Notice management (publish/unpublish)
- Result entry and management
- Certificate issuance (TESTIMONIAL / TRANSFER / CHARACTER) with QR code generation
- Admission request processing (Approve/Reject)
- Managing committee management
- Photo gallery management
- Facilities management
- Site settings
- Certificate verification audit logs

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # MySQL schema (13 models)
│   └── seed.ts              # Seed with Bengali data
├── src/
│   ├── app/
│   │   ├── (public)/        # Public-facing pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   └── shared/          # Shared page components
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── db.ts            # Prisma singleton
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # School constants
│   ├── middleware.ts         # Route protection
│   └── types/               # TypeScript augmentations
└── ...config files
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+ database
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/your-org/mirukhali-school--college.git
cd mirukhali-school--college
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="mysql://user:password@localhost:3306/mirukhali_school"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin dashboard

**Default Admin Credentials:**
- Email: `admin@mirukhali.edu.bd`
- Password: `Admin@123456`

> ⚠️ Change the admin password immediately after first login in production!

---

## Production Deployment

### Option A: VPS (Ubuntu/Debian)

```bash
# Install dependencies
npm ci --production

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "mirukhali" -- start
pm2 save
pm2 startup
```

### Option B: Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

> Note: For file uploads on Vercel, use an object storage service (Cloudinary, AWS S3, etc.) instead of local `public/uploads/`.

### Nginx Reverse Proxy (VPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then add SSL with Certbot:
```bash
certbot --nginx -d yourdomain.com
```

---

## Database Commands

```bash
npm run db:generate    # Generate Prisma client after schema changes
npm run db:push        # Push schema changes to database (dev)
npm run db:migrate     # Create and run migrations (production)
npm run db:seed        # Seed database with initial data
npm run db:studio      # Open Prisma Studio GUI
```

---

## Admin Roles

| Role | Permissions |
|---|---|
| `SUPER_ADMIN` | Full access including user management |
| `ADMIN` | Manage all content, certificates, admissions |
| `TEACHER` | View-only access |
| `STAFF` | View-only access |

---

## Certificate Verification

Every issued certificate gets:
1. A unique certificate number (e.g., `TST-2024-38291`)
2. A QR code linking to `/verify/{certificateNo}`
3. All verifications are logged with IP address and user agent

Public verification URL: `https://yourdomain.com/verify`

---

## Institution Info

- **Name:** Mirukhali School & College (মিরুখালী স্কুল এন্ড কলেজ)
- **EIIN:** 102726
- **Established:** 1 January 1937
- **Location:** Mirukhali, Mathbaria, Pirojpur-8514, Bangladesh
- **Type:** Private MPO Enlisted, Co-Education
- **Recognition:** 1937 M.E. School → 1962 Junior Secondary → 1967 High School → Higher Secondary

---

## License

MIT — see [LICENSE](LICENSE)
