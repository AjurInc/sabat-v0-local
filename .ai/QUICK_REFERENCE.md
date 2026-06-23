# Quick Reference - Windows + XAMPP + Laravel + Copilot

## TL;DR - Get Running in 30 Minutes

```bash
# 1. Create project
composer create-project laravel/laravel sabat-backend
cd sabat-backend

# 2. Setup .env (edit file)
# DB_DATABASE=sabat_db
# DB_USERNAME=root
# DB_PASSWORD=

# 3. Generate key
php artisan key:generate

# 4. Install packages
composer require tymon/jwt-auth:^2.1
composer require fruitcake/laravel-cors

# 5. Publish JWT config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
php artisan jwt:secret

# 6. Create database in phpMyAdmin
# Open http://localhost/phpmyadmin
# Create database: sabat_db

# 7. Now open project in VSCode
code .

# 8. Use Copilot Chat (Ctrl+Shift+I) and run these prompts IN ORDER:
# - WINDOWS_XAMPP_SETUP.md Prompt 1-10
# - COPILOT_WORKFLOW.md Step-by-step instructions

# 9. Register middleware in app/Http/Kernel.php (add this):
'jwt.auth' => \App\Http\Middleware\AuthMiddleware::class,

# 10. Clear cache
php artisan config:cache

# 11. Start server
php artisan serve

# 12. Test
curl http://localhost:8000/api/v1/health
```

---

## File Locations to Create

| File | Location |
|------|----------|
| User Model | `app/Models/User.php` |
| AuthCode Model | `app/Models/AuthCode.php` |
| AccessToken Model | `app/Models/AccessToken.php` |
| AuthController | `app/Http/Controllers/Api/AuthController.php` |
| AuthMiddleware | `app/Http/Middleware/AuthMiddleware.php` |
| SignupRequest | `app/Http/Requests/SignupRequest.php` |
| VerifyCodeRequest | `app/Http/Requests/VerifyCodeRequest.php` |
| SigninRequest | `app/Http/Requests/SigninRequest.php` |
| RefreshTokenRequest | `app/Http/Requests/RefreshTokenRequest.php` |
| UserService | `app/Services/UserService.php` |
| ApiResponse Trait | `app/Traits/ApiResponse.php` |
| Routes | `routes/api.php` |
| CORS Config | `config/cors.php` |
| Exception Handler | `app/Exceptions/Handler.php` |
| Migrations | `database/migrations/` (auto-generated) |

---

## API Endpoints Reference

### Public Endpoints

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/verify-code
POST   /api/v1/auth/signin
GET    /api/v1/health
```

### Protected Endpoints (need JWT token)

```
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
GET    /api/v1/user/profile
GET    /api/v1/user/me
```

---

## Example Requests

### Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "name": "John Doe",
    "phone": "+989991234567",
    "organization": "ACME Corp"
  }'
```

### Verify Code
```bash
curl -X POST http://localhost:8000/api/v1/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "code": "123456"
  }'
```

### Signin
```bash
curl -X POST http://localhost:8000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Protected Route (with token)
```bash
curl -X GET http://localhost:8000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `php is not recognized` | Add PHP to Windows PATH (C:\xampp\php) |
| `SQLSTATE[HY000]` | MySQL not running, check XAMPP |
| `Class not found` | Run `composer dump-autoload` |
| `CORS error` | Run `php artisan config:cache` |
| `JWT token invalid` | Check `.env` has `JWT_SECRET` set |
| `Table already exists` | Run `php artisan migrate:reset` then `php artisan migrate` |
| `Port 3000 already in use` | Run `npm run dev -- -p 3001` for frontend |
| `Port 8000 already in use` | Run `php artisan serve --port=8001` |

---

## Three Terminal Setup

**Terminal 1 - Frontend (http://localhost:3000)**
```bash
cd path/to/frontend
npm run dev
```

**Terminal 2 - Backend (http://localhost:8000)**
```bash
cd path/to/sabat-backend
php artisan serve
```

**Terminal 3 - Watch Logs (optional)**
```bash
cd path/to/sabat-backend
# On Windows PowerShell:
Get-Content storage\logs\laravel.log -Wait
```

---

## Environment Variables (.env)

```env
APP_NAME=SABAT
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sabat_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret_here_generated_by_artisan
JWT_ALGORITHM=HS256
JWT_TTL=60

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## Copilot Prompts Overview

| # | Prompt | Creates |
|---|--------|---------|
| 1 | User Model & Migration | User.php + migration |
| 2 | Auth Controller | AuthController.php |
| 3 | Auth Middleware | AuthMiddleware.php |
| 4 | Validation Requests | 4 validation classes |
| 5 | User Service | UserService.php |
| 6 | Routes | routes/api.php |
| 7 | CORS Config | config/cors.php |
| 8 | Auth Code & Token Models | AuthCode.php, AccessToken.php + migrations |
| 9 | API Response Trait | ApiResponse.php |
| 10 | Exception Handler | Updated Handler.php |

---

## Database Schema Quick View

### users
- id (PK)
- name
- email (unique)
- password
- phone
- organization
- role
- email_verified_at
- last_login_at
- created_at, updated_at

### auth_codes
- id (PK)
- user_id (FK)
- code
- expires_at
- created_at

### access_tokens
- id (PK)
- user_id (FK)
- token_hash
- ip_address
- user_agent
- created_at
- expires_at

---

## Before You Start - Checklist

- [ ] XAMPP installed with Apache + MySQL
- [ ] PHP added to Windows PATH
- [ ] Composer installed
- [ ] Node.js installed
- [ ] VSCode installed
- [ ] GitHub Copilot extension installed
- [ ] GitHub Copilot Chat extension installed
- [ ] Git installed
- [ ] Laravel project created
- [ ] Database created in phpMyAdmin

Once all checked, you're ready to run the prompts!

---

## After All Files Created - Checklist

- [ ] Middleware registered in Kernel.php
- [ ] Cache cleared: `php artisan config:cache`
- [ ] Autoloader regenerated: `composer dump-autoload`
- [ ] Migrations run: `php artisan migrate`
- [ ] Health check works: `curl http://localhost:8000/api/v1/health`
- [ ] Can signup and get code
- [ ] Can verify code and get JWT token
- [ ] Can signin with JWT token
- [ ] Protected routes work with Bearer token

---

## Pro Tips

1. **Use Postman** - Makes testing endpoints much easier
2. **Check logs** - `storage/logs/laravel.log` shows all errors
3. **Clear cache often** - Laravel caches config: `php artisan config:cache`
4. **Use tinker** - Test code: `php artisan tinker` then `User::all()`
5. **Check routes** - See all routes: `php artisan route:list`
6. **Use .env** - Never hardcode config, use env() helper
7. **Test in order** - Signup → Verify → Signin before protected routes
8. **Save token** - Copy the JWT token from verify/signin and use for protected routes

---

## Next Steps After Backend Works

1. Create User API endpoints (get profile, update, delete)
2. Create booking/service management endpoints
3. Add admin dashboard endpoints
4. Implement rate limiting on auth endpoints
5. Add audit logging
6. Setup email notifications (future)
7. Deploy to production

For now, focus on getting auth working perfectly!
