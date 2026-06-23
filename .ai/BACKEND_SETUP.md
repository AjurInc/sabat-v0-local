# Laravel Backend Setup Guide

## Overview
SABAT backend is a Laravel 11 REST API with JWT authentication, designed to work with your Next.js frontend. This guide covers local setup without requiring email or OTP services.

## Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+ or SQLite
- Node.js (for frontend dev server)

### 1. Create Laravel Project
```bash
# Create new Laravel project
composer create-project laravel/laravel sabat-backend

cd sabat-backend

# Install dependencies
composer require tymon/jwt-auth
composer require laravel/sanctum
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret
```

### 3. Database Configuration
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sabat_db
DB_USERNAME=root
DB_PASSWORD=
```

Or use SQLite (easier for local):
```
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

### 4. Publish Configurations
```bash
php artisan vendor:publish --provider="Tymon\JwtAuth\Providers\JwtAuthServiceProvider"
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Create Database
```bash
php artisan migrate
```

### 6. Seed Initial Data (Optional)
```bash
php artisan db:seed
```

### 7. Start Server
```bash
php artisan serve
# Server runs on http://localhost:8000
```

## API Base URL
- **Local**: `http://localhost:8000/api`
- **Endpoints**: All routes prefixed with `/api/v1`

## CORS Setup
Update `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
'supports_credentials' => true,
```

## Authentication Flow

### Sign Up
**POST** `/api/v1/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "data": {
    "user_id": 1,
    "verification_code": "123456",
    "expires_at": "2024-01-01T00:10:00Z",
    "verification_required": true
  }
}
```

### Verify Code
**POST** `/api/v1/auth/verify-code`
```json
{
  "user_id": 1,
  "verification_code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLC...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "email_verified_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Sign In
**POST** `/api/v1/auth/signin`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "data": {
    "user_id": 1,
    "verification_code": "123456",
    "expires_at": "2024-01-01T00:10:00Z",
    "verification_required": true
  }
}
```

### Resend Code
**POST** `/api/v1/auth/resend-code`
```json
{
  "user_id": 1
}
```

### Logout
**POST** `/api/v1/auth/logout`
```
Headers: Authorization: Bearer {token}
```

### Refresh Token
**POST** `/api/v1/auth/refresh`
```
Headers: Authorization: Bearer {token}
```

## Local Verification Without Email

During development, verification codes are returned in API responses. You can:

1. **Copy from Response**: When signing up, the response includes the 6-digit code
2. **Check Logs**: Codes are logged to storage/logs/laravel.log
3. **Database**: Check `auth_codes` table to see generated codes
4. **Postman/cURL**: Test endpoint directly and grab the code

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User full name
- `email`: Unique email
- `password`: Hashed password
- `email_verified_at`: Verification timestamp
- `phone`: Optional phone number
- `profile_completed`: Boolean for profile status
- `preferences`: JSON with user preferences
- `created_at`, `updated_at`

### Auth Codes Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `code`: 6-digit verification code
- `type`: 'signup' or 'signin'
- `expires_at`: Code expiration time
- `verified_at`: When code was verified
- `created_at`

### Access Tokens Table
- `id`: Primary key
- `user_id`: Foreign key
- `token_hash`: Hashed JWT token
- `ip_address`: Request IP
- `user_agent`: Browser/app info
- `revoked`: Boolean
- `expires_at`
- `created_at`

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  },
  "status_code": 422
}
```

## Rate Limiting

Endpoints are rate limited:
- Auth endpoints: 5 requests per minute per IP
- General endpoints: 60 requests per minute per user
- Verification: 3 attempts per 15 minutes

## Logging & Debugging

Enable debug mode in `.env`:
```
APP_DEBUG=true
LOG_LEVEL=debug
```

Check logs:
```bash
tail -f storage/logs/laravel.log
```

## HTTPS for Production

When deploying, update frontend `.env`:
```
NEXT_PUBLIC_API_URL=https://api.sabat.ir/api/v1
```

And API CORS:
```php
'allowed_origins' => [
    'https://sabat.ir',
    'https://www.sabat.ir'
],
```

## Troubleshooting

### JWT Token Invalid
- Regenerate: `php artisan jwt:secret`
- Ensure same key in frontend and backend

### CORS Errors
- Check `config/cors.php`
- Verify frontend URL in allowed_origins
- Clear browser cache

### Migration Errors
- Fresh start: `php artisan migrate:fresh`
- Seed after: `php artisan db:seed`

### Permission Errors
```bash
chmod -R 775 storage bootstrap/cache
```

## Development Commands
```bash
# Create migration
php artisan make:migration create_table_name

# Create model
php artisan make:model ModelName -m

# Create controller
php artisan make:controller Api/ControllerName

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:cache
```
