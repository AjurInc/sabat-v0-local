# cPanel Deployment Guide - SABAT Project

## 📋 Pre-Deployment Checklist

- [ ] All files in `mobile-header-fixes/` ready
- [ ] `backend/` folder present with Laravel app
- [ ] `database-export.sql` present
- [ ] Frontend app ready (Next.js build or dev server)
- [ ] cPanel account with SSH access and PHP 8.2+
- [ ] cPanel with Composer support

---

## Step 1: Prepare Your Project Files

```
Ensure your project has this structure:
mobile-header-fixes/
├── backend/              (Laravel app - Ready ✓)
├── database-export.sql   (Database backup - Ready ✓)
└── [frontend code]       (Add your Next.js app here)
```

---

## Step 2: Upload to cPanel

### Option A: Using Git (Recommended)

1. **Initialize git repo locally:**
   ```powershell
   cd C:\Users\Asus\Desktop\mobile-header-fixes
   git init
   git add .
   git commit -m "Initial commit - Full stack app"
   ```

2. **Push to GitHub/GitLab**

3. **On cPanel Terminal:**
   ```bash
   cd public_html
   git clone [your-repo-url] .
   ```

### Option B: Upload via FTP/cPanel File Manager

1. Zip your entire `mobile-header-fixes` folder
2. Upload to cPanel
3. Extract in `public_html`

---

## Step 3: Configure Backend on cPanel

### 3.1 Set up Laravel in public_html

```bash
cd public_html/backend

# If you have SSH access:
composer install
php artisan key:generate
php artisan jwt:secret
```

### 3.2 Create .env for cPanel

Edit `backend/.env`:

```env
APP_NAME=SABAT
APP_ENV=production
APP_KEY=base64:...  # Keep existing key
APP_DEBUG=false
APP_URL=https://yourdomain.com/api

# Database (cPanel will provide these)
DB_CONNECTION=mysql
DB_HOST=localhost        # Usually localhost on cPanel
DB_PORT=3306
DB_DATABASE=yourusername_sabat_db
DB_USERNAME=yourusername_dbuser
DB_PASSWORD=[Strong password from cPanel]

JWT_SECRET=[Your JWT secret]
JWT_ALGORITHM=HS256
JWT_EXPIRATION_TIME=3600

# Ensure cache uses database
CACHE_STORE=database
SESSION_DRIVER=database
```

### 3.3 Import Database

1. **In cPanel → MySQL Databases:**
   - Create new database: `yourusername_sabat_db`
   - Create database user with full privileges

2. **Import SQL file:**
   ```bash
   mysql -u yourusername_dbuser -p yourusername_sabat_db < database-export.sql
   ```

3. **Run migrations (optional, already in export):**
   ```bash
   cd backend
   php artisan migrate --force
   ```

---

## Step 4: Configure Public Folder Routing

### Option A: API in Subdirectory (Recommended)

```bash
# In public_html/.htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Route /api to backend/public
    RewriteCond %{REQUEST_URI} ^/api/(.*)$
    RewriteRule ^api/(.*)$ backend/public/index.php?/$1 [QSA,L]
    
    # Route everything else to frontend
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>
```

### Option B: Separate Domains

- **Backend:** `api.yourdomain.com` → points to `backend/public`
- **Frontend:** `www.yourdomain.com` → points to `frontend/out` (Next.js static export)

---

## Step 5: Configure Permissions

```bash
# On cPanel (via SSH)
cd public_html/backend

# Laravel requires writable storage & bootstrap/cache
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod -R 755 database

# Make these writable:
chmod 777 storage/logs
chmod 777 storage/framework
```

---

## Step 6: Frontend Deployment

### Option A: Static Export (Easiest)

```powershell
# On your local machine
cd frontend
npm run build    # Builds to .next folder
npm run export   # Creates static files in 'out' folder

# Upload 'out' folder to cPanel/public_html
```

### Option B: Node.js Server (Advanced)

Deploy frontend to Vercel or Netlify instead.

### Option C: Next.js on cPanel

```bash
# On cPanel, in public_html directory
npm install
NODE_ENV=production npm run build
pm2 start 'npm run start' --name "nextjs-app"
```

---

## Step 7: Update Frontend API Configuration

In your Next.js app, update API client:

**File:** `lib/api-client.ts` (or similar)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.origin}/api`
    : 'http://localhost:8000/api'
  );

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Set environment variable in cPanel:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## Step 8: Set Up SSL Certificate

1. **In cPanel → AutoSSL** - Auto-generate free SSL
2. **Redirect HTTP to HTTPS:**

```bash
# In public_html/.htaccess
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]
```

---

## Step 9: Enable CORS on Backend

Edit `backend/config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
],
'supports_credentials' => true,
```

Then clear config:
```bash
cd backend
php artisan config:cache
```

---

## 🧪 Test Everything

1. **Test Backend API:**
   ```bash
   curl https://yourdomain.com/api/health
   # Or use Postman
   ```

2. **Test Frontend:**
   - Open `https://yourdomain.com`
   - Check Network tab for API calls
   - Try login/signup flow

3. **Check Logs:**
   ```bash
   tail -f backend/storage/logs/laravel.log
   ```

---

## 📝 Troubleshooting

### 404 on `/api/` routes
- Check `.htaccess` rewrite rules
- Verify `backend/public/index.php` exists
- Enable `mod_rewrite` in cPanel

### Database connection error
- Check `.env` credentials match cPanel database
- Verify database user has proper privileges
- Test via cPanel → phpMyAdmin

### Static files not loading
- Check `backend/public` folder permissions
- Clear Laravel cache: `php artisan cache:clear`

### CORS errors
- Update `config/cors.php` with your domain
- Ensure frontend makes requests to `/api/...` not `http://localhost:8000`

---

## 🔄 Deployment Updates

When updating your app:

```bash
# Pull latest code
git pull origin main

# Install dependencies
cd backend && composer install

# Run migrations (if any new ones)
php artisan migrate --force

# Clear cache
php artisan cache:clear
php artisan config:cache

# Frontend (if hosting on cPanel)
cd ../frontend
npm install
npm run build
npm run export    # For static files
```

---

## 💡 Tips

- Use **environment variables** instead of hardcoding secrets
- Set `APP_DEBUG=false` in production
- Enable Laravel logging to monitor issues
- Use **cPanel backups** regularly
- Monitor disk space usage
- Set up email notifications for errors

---

## 📞 Quick Reference

**Backend URL:** `https://yourdomain.com/api`
**Frontend URL:** `https://yourdomain.com`
**Database:** `yourusername_sabat_db` (via phpMyAdmin in cPanel)
**SSH:** Access via cPanel Terminal or SSH client

---

**Ready to deploy? Good luck!** 🚀
