# Project Structure - Unified Full-Stack Application

## 📁 Directory Layout

```
mobile-header-fixes/
│
├── frontend/                      # Next.js Frontend (not created yet, add yours here)
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── backend/                       # Laravel Backend API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── storage/
│   ├── .env
│   ├── .env.example
│   ├── artisan
│   ├── composer.json
│   └── ...
│
├── database-export.sql            # MySQL Database Backup (import this on cPanel)
│
├── CPANEL_DEPLOYMENT_GUIDE.md     # Step-by-step cPanel setup
├── PROJECT_STRUCTURE.md           # This file
└── README.md                       # Project info

```

## 🗄️ What's Included

### Backend (`/backend`)
- Complete Laravel 12 REST API
- JWT authentication configured
- Sanctum token management
- MySQL database migrations
- All required packages installed

### Database (`database-export.sql`)
- Complete MySQL database schema
- Tables: users, jobs, cache, personal_access_tokens
- Ready to import on cPanel

### Frontend
- ⚠️ You need to copy your Next.js app here or reorganize

## 🚀 For cPanel Deployment

### Structure on cPanel

```
public_html/
├── public/                    → Points to backend/public (Laravel public folder)
├── backend/                   → Your Laravel application
├── frontend-build/            → Next.js built files (if serving from cPanel)
└── database-export.sql        → For DB restoration
```

### OR for separate frontend/backend deployment:

```
Backend on cPanel:
public_html/api/  → backend/public

Frontend on Vercel/Netlify:
https://yourdomain.com  → Next.js deployment
https://api.yourdomain.com  → Laravel API
```

See `CPANEL_DEPLOYMENT_GUIDE.md` for full instructions.
