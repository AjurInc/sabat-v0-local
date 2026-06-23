# 🚀 SABAT - Full Stack Application (Unified Structure)

## ✅ What You Now Have

Your complete project is now organized in one unified folder: **`mobile-header-fixes/`**

```
mobile-header-fixes/
│
├── 📁 backend/                    # Complete Laravel Backend API ✓
│   ├── app/                       # Controllers, Models, Requests
│   ├── config/                    # Configuration files
│   ├── database/                  # Migrations, Seeders
│   ├── public/                    # Entry point (index.php)
│   ├── routes/                    # API routes
│   ├── storage/                   # Logs, uploads
│   ├── .env                       # Environment (local)
│   ├── .env.cpanel                # Template for cPanel
│   ├── .env.example               # Example config
│   ├── composer.json              # PHP dependencies
│   └── artisan                    # Laravel CLI
│
├── 📁 [frontend components]       # Your Next.js frontend
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── 📄 database-export.sql         # MySQL database backup ✓
│   └── Ready to import on cPanel
│
├── 📖 CPANEL_DEPLOYMENT_GUIDE.md  # Step-by-step deployment ✓
├── 📖 PROJECT_STRUCTURE.md        # Directory layout
├── 📖 README.md                   # Project overview
│
└── [Other config files]
```

---

## 🎯 Quick Summary

| Component | Location | Status | Details |
|-----------|----------|--------|---------|
| **Backend** | `/backend` | ✅ Ready | Laravel 12, JWT, Sanctum |
| **Database** | `database-export.sql` | ✅ Ready | MySQL schema + data |
| **Frontend** | Root level | ✅ Running | Next.js 16, i18n |
| **Config** | `backend/.env.cpanel` | ✅ Template | Fill in cPanel credentials |

---

## 🔧 Current Local Setup

### Running Everything Locally

**Terminal 1 - Backend API:**
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000/api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - MySQL:**
```bash
# If not already running:
C:\xampp\mysql_start.bat
```

---

## 🌐 Deploying to cPanel

### 1. **Prepare Your Files**
- Everything is already organized ✓
- No restructuring needed ✓

### 2. **Upload to cPanel**

Use **Git** (recommended):
```bash
cd C:\Users\Asus\Desktop\mobile-header-fixes
git init
git add .
git commit -m "Full stack app ready for deployment"
git remote add origin https://github.com/yourusername/sabat.git
git push -u origin main
```

Then on cPanel:
```bash
cd public_html
git clone https://github.com/yourusername/sabat.git .
```

Or use **FTP**: Zip the folder and upload to cPanel.

### 3. **Set Up Backend on cPanel**

```bash
cd public_html/backend

# Install dependencies
composer install

# Configure environment
cp .env.cpanel .env
# Edit .env with cPanel database credentials

# Generate keys (if needed)
php artisan key:generate
php artisan jwt:secret
```

### 4. **Import Database**

In cPanel → **MySQL Databases**:
1. Create database: `yourusername_sabat_db`
2. Create user with full privileges
3. Import `database-export.sql`:

```bash
mysql -u username -p database_name < database-export.sql
```

### 5. **Configure API Routing**

In `public_html/.htaccess`, route `/api` to backend:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} ^/api/(.*)$
    RewriteRule ^api/(.*)$ backend/public/index.php?/$1 [QSA,L]
</IfModule>
```

### 6. **Update Frontend**

Ensure your API calls point to `/api`:

```typescript
// In your API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  `${window.location.origin}/api`;
```

---

## 📝 File Organization Benefits

✅ **Single repository** - Everything in one git repo  
✅ **Easy backup** - Just zip the folder  
✅ **Simple deployment** - One folder to upload  
✅ **Clear structure** - Easy to find everything  
✅ **Database included** - No separate DB setup needed  
✅ **Documentation** - Deployment guides ready  

---

## 🚨 Important Notes

### Local Development
- Backend still runs at `http://localhost:8000`
- Update your frontend API calls if needed
- MySQL must be running (started with XAMPP)

### On cPanel
- Backend will be at `https://yourdomain.com/api`
- Frontend serves from `https://yourdomain.com`
- Database credentials from cPanel MySQL setup
- Environment variables must be updated

---

## 📋 Verification Checklist

- [ ] `backend/` folder exists at project root
- [ ] `database-export.sql` exists (92 KB)
- [ ] `CPANEL_DEPLOYMENT_GUIDE.md` is readable
- [ ] `backend/.env.cpanel` is available
- [ ] Frontend code is at root level
- [ ] `package.json` for frontend is present
- [ ] Backend runs locally: `php artisan serve` ✓
- [ ] Frontend runs locally: `npm run dev` ✓

---

## 🔐 Security Reminders

⚠️ **Before deploying to cPanel:**
1. Change all default passwords
2. Set `APP_DEBUG=false` in production
3. Update JWT secrets
4. Use strong database passwords
5. Enable HTTPS (SSL certificate)
6. Set proper file permissions (755 for dirs, 644 for files)
7. Keep `storage/` and `bootstrap/cache/` writable

---

## 💬 Need Help?

- Check `CPANEL_DEPLOYMENT_GUIDE.md` for detailed steps
- See `.ai/` folder for API documentation
- Review Laravel docs: https://laravel.com/docs
- Check Next.js docs: https://nextjs.org/docs

---

## 🎉 You're All Set!

Your project is now:
- ✅ Fully organized
- ✅ Ready for version control
- ✅ Ready for cPanel deployment
- ✅ Backed up (database export)
- ✅ Well-documented

**Next step:** Follow `CPANEL_DEPLOYMENT_GUIDE.md` when ready to deploy!

---

**Last updated:** 2026-06-22  
**Project:** SABAT - Full Stack App
