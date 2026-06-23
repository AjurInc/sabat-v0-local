# Laravel Backend Setup Guide

## Prerequisites
Make sure you have:
- PHP 8.1+ installed
- Composer installed
- MySQL or SQLite for the database
- Git

## Step 1: Create a New Laravel Project

```bash
composer create-project laravel/laravel sabat-backend
cd sabat-backend
```

## Step 2: Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` file:
```
APP_NAME=SABAT
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Use SQLite for development
DB_CONNECTION=sqlite
# Leave other DB_* variables blank

# CORS settings
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Create the SQLite database:
```bash
touch database/database.sqlite
```

## Step 3: Generate Application Key

```bash
php artisan key:generate
```

## Step 4: Run Migrations

```bash
php artisan migrate
```

## Step 5: Start the Development Server

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

The backend will be available at `http://localhost:8000`

## API Endpoints (Already Created)

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user (requires auth token)

## Next Steps

1. Copy the authentication files from the guide into your Laravel project
2. Configure CORS in `config/cors.php`
3. Update your Next.js frontend to call these endpoints

See `LARAVEL_FILES.md` for the complete code to add to your Laravel project.
