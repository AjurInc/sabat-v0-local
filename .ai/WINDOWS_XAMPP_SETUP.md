# Windows + XAMPP Setup Guide - Complete

## Part 1: System Requirements & Preparation

### Prerequisites
- Windows 10/11
- XAMPP installed (Apache, MySQL, PHP 8.1+)
- Node.js 18+ installed
- VSCode with GitHub Copilot
- Git installed

### Step 1: Verify PHP and Composer

Open PowerShell/CMD and run:
```bash
php --version
composer --version
```

If Composer is not installed:
```bash
# Download from https://getcomposer.org/download/
# Or use choco if you have Chocolatey:
choco install composer
```

---

## Part 2: Create Laravel Project

### Step 2: Create New Laravel Project

```bash
# Navigate to where you want the project (e.g., D:\projects or C:\xampp\htdocs)
cd D:\projects

# Create new Laravel project
composer create-project laravel/laravel sabat-backend

# Navigate into project
cd sabat-backend
```

### Step 3: Setup Environment File

```bash
# Copy example env
copy .env.example .env

# Generate app key
php artisan key:generate
```

### Step 4: Configure Database in .env

Open `.env` in VSCode and update:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sabat_db
DB_USERNAME=root
DB_PASSWORD=
```

**Note**: XAMPP MySQL default:
- Username: `root`
- Password: `` (empty)
- Host: `127.0.0.1`

---

## Part 3: Database Setup

### Step 5: Create Database in phpMyAdmin

1. Open XAMPP Control Panel
2. Start Apache + MySQL
3. Open phpMyAdmin: `http://localhost/phpmyadmin`
4. Create new database: `sabat_db`
   - Click "New"
   - Database name: `sabat_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click Create

---

## Part 4: Run Migrations

### Step 6: Create Migrations

In PowerShell/CMD in project folder:

```bash
# Create users table migration (should exist, modify it)
php artisan migrate --step

# If migrations fail, drop and recreate
php artisan migrate:fresh
```

If you get errors about table existing:
```bash
php artisan migrate:reset
php artisan migrate
```

---

## Part 5: Install Dependencies & Packages

### Step 7: Install Composer Packages

```bash
# JWT for authentication
composer require tymon/jwt-auth:^2.1

# CORS support
composer require fruitcake/laravel-cors

# Environment validation
composer require laravel/tinker

# Rate limiting helpers
composer require spatie/laravel-rate-limit
```

### Step 8: Publish Configurations

```bash
# JWT config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"

# Generate JWT secret
php artisan jwt:secret
```

---

## Part 6: Create API Structure with Copilot

### Step 9: Open Project in VSCode

```bash
code .
```

### Step 10: Create Folder Structure

In VSCode terminal (or PowerShell):

```bash
# Create folders
mkdir app\Services
mkdir app\Http\Controllers\Api
mkdir app\Http\Requests
mkdir app\Traits
mkdir routes\api
mkdir storage\logs
```

---

## Part 7: Copilot Prompts - Use These Exactly

### Prompt 1: Create User Model & Migration

**Copy this entire prompt and paste into Copilot Chat (Ctrl+Shift+I):**

```
I'm building a Laravel API backend for SABAT, a corporate travel management system. 
I need you to create complete User model with fillable properties and migration.

Requirements:
- User model at app/Models/User.php
- Should have: id, name, email, password, phone, organization, role (admin/user), email_verified_at, last_login_at, created_at, updated_at
- Add methods: isAdmin(), getFullName()
- Migration file that creates users table with all fields
- Use auth:sanctum in the User model
- Timestamps enabled
- Use proper timestamps (created_at, updated_at)

File locations:
- Model: app/Models/User.php
- Migration: database/migrations/[timestamp]_create_users_table.php

Generate complete code for both files. Include all necessary imports.
```

### Prompt 2: Create Auth Controller

**Paste this prompt:**

```
I'm building a Laravel API with JWT authentication. No email server, so use 6-digit verification codes stored in database.

Create app/Http/Controllers/Api/AuthController.php with these methods:

1. signup(Request $request)
   - Accept: email, password, name, phone, organization
   - Validate all inputs
   - Check if email exists, return error if yes
   - Hash password using Hash::make()
   - Create user in database
   - Generate 6-digit code (random)
   - Store in auth_codes table with 10-minute expiry
   - Return: { success: true, message: "Code sent to email", code: "123456" (only for dev), user_id: id }

2. verifyCode(Request $request)
   - Accept: user_id, code
   - Validate code from auth_codes table
   - Check if code matches and not expired
   - If expired, return error
   - Mark user as verified in users table
   - Generate JWT token using jwt-auth
   - Store token hash
   - Delete used code
   - Return: { success: true, token: "jwt_token", user: { id, name, email } }

3. signin(Request $request)
   - Accept: email, password
   - Find user by email
   - If not found, return 401
   - If not verified, return error "Please verify code first"
   - Verify password using Hash::check()
   - If wrong, return 401
   - Generate JWT token
   - Update last_login_at
   - Return: { success: true, token: "jwt_token", user: { id, name, email, organization } }

4. refreshToken(Request $request)
   - Authenticated route
   - Get current user from auth()->user()
   - Generate new JWT token
   - Return: { success: true, token: "new_jwt_token", user: user data }

5. logout(Request $request)
   - Authenticated route
   - Invalidate current token
   - Return: { success: true, message: "Logged out" }

Use proper error handling with try-catch.
Use validation with $request->validate().
Include all necessary imports (Illuminate, JWT, Hash, etc).
Add detailed comments.
```

### Prompt 3: Create Auth Middleware

**Paste this prompt:**

```
Create app/Http/Middleware/AuthMiddleware.php for JWT token verification.

Requirements:
- Check for Authorization header with Bearer token
- Extract token from "Bearer {token}" format
- Verify JWT token using jwt-auth library
- If invalid/expired, return 401 { error: "Unauthorized" }
- If valid, get user from token and attach to request
- Allow request to proceed
- Handle all error cases (missing token, invalid token, expired)

Use proper error responses with status codes.
Add detailed comments.
Include all necessary imports.
This will be used in api.php middleware route group.
```

### Prompt 4: Create Auth Requests Validation

**Paste this prompt:**

```
Create validation request classes in app/Http/Requests/ folder.

Create these files:

1. SignupRequest.php
   - email: required, email, unique:users
   - password: required, min:8, confirmed
   - name: required, string, max:255
   - phone: required, string, max:20
   - organization: required, string, max:255

2. VerifyCodeRequest.php
   - user_id: required, exists:users,id
   - code: required, digits:6

3. SigninRequest.php
   - email: required, email
   - password: required, string

4. RefreshTokenRequest.php
   - No validation needed (uses middleware)

Each file should:
- Extend FormRequest
- Have authorize() returning true
- Have rules() method with validation
- Have messages() method with custom error messages
- Include all necessary imports
- Add comments explaining each field
```

### Prompt 5: Create User Service Class

**Paste this prompt:**

```
Create app/Services/UserService.php - a service layer for user operations.

Methods needed:

1. createUser(array $data)
   - Accept: email, password, name, phone, organization
   - Create user in database
   - Return User model instance
   - Handle validation errors

2. generateVerificationCode(User $user)
   - Generate random 6-digit code
   - Store in auth_codes table with user_id, code, expires_at (10 min)
   - Return the code

3. verifyCode(User $user, string $code)
   - Find auth code for user
   - Check if matches provided code
   - Check if not expired (created_at + 10 mins > now)
   - Mark user as verified
   - Delete code
   - Return boolean

4. authenticateUser(User $user)
   - Generate JWT token for user
   - Update last_login_at timestamp
   - Return token

5. getUserProfile(User $user)
   - Return user data: id, name, email, phone, organization, role, created_at

Use proper error handling.
Add detailed comments.
Include all necessary imports.
Make it testable and maintainable.
```

### Prompt 6: Create Routes

**Paste this prompt:**

```
Create/update routes/api.php for Laravel API routes.

Requirements:

Public routes (no auth):
- POST /api/v1/auth/signup
- POST /api/v1/auth/verify-code
- POST /api/v1/auth/signin
- GET /api/v1/health (health check endpoint, returns { status: "ok" })

Protected routes (require JWT middleware):
- POST /api/v1/auth/refresh-token
- POST /api/v1/auth/logout
- GET /api/v1/user/profile
- GET /api/v1/user/me

Each route should:
- Use correct HTTP method (GET/POST/PUT/DELETE)
- Use api middleware group
- Group protected routes using middleware
- Route to correct controller method
- Include version prefix /api/v1

Use this structure:
Route::middleware('api')->prefix('api/v1')->group(function () {
    // public routes
});

Route::middleware(['api', 'jwt.auth'])->prefix('api/v1')->group(function () {
    // protected routes
});

Include all necessary imports.
Add comments for each route group.
```

### Prompt 7: Create CORS Configuration

**Paste this prompt:**

```
Update config/cors.php to allow frontend requests.

Requirements:
- Allow origins: http://localhost:3000, http://localhost:3001
- Allow methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Allow headers: Content-Type, Authorization, X-Requested-With
- Allow credentials: true
- Max age: 86400
- Expose headers: X-Total-Count

This will allow the Next.js frontend (localhost:3000) to make API requests to Laravel (localhost:8000) without CORS errors.

Update the existing config/cors.php file with these settings.
```

### Prompt 8: Create Database Models & Relationships

**Paste this prompt:**

```
Create additional Laravel models and migrations needed:

1. AuthCode model (app/Models/AuthCode.php)
   - Fields: id, user_id, code, expires_at, created_at
   - Relationship: belongsTo User
   - Methods: isExpired(), isValid()
   - Migration: create_auth_codes_table

2. AccessToken model (app/Models/AccessToken.php)
   - Fields: id, user_id, token_hash, ip_address, user_agent, created_at, expires_at
   - Relationship: belongsTo User
   - Migration: create_access_tokens_table

3. Update User model relationships
   - hasMany AuthCodes
   - hasMany AccessTokens

Create all migrations and models.
Include all necessary imports.
Add proper timestamps and relationships.
Use UUID if possible, otherwise auto-increment ID.
```

### Prompt 9: Create Base API Response Trait

**Paste this prompt:**

```
Create app/Traits/ApiResponse.php - standardize all API responses.

Methods needed:

1. successResponse(mixed $data = null, string $message = "Success", int $code = 200)
   - Returns: { success: true, message: message, data: data }
   - HTTP status code: $code

2. errorResponse(string $message, array $errors = [], int $code = 400)
   - Returns: { success: false, message: message, errors: errors }
   - HTTP status code: $code

3. unauthorizedResponse(string $message = "Unauthorized")
   - Returns: { success: false, message: message }
   - HTTP status code: 401

4. validationErrorResponse(array $errors)
   - Returns: { success: false, message: "Validation failed", errors: errors }
   - HTTP status code: 422

All methods should use Laravel's response() helper.
Make it reusable across all controllers.
Add comments explaining each method.
```

### Prompt 10: Create Exception Handler

**Paste this prompt:**

```
Update app/Exceptions/Handler.php to handle API errors properly.

In the render method, add:

1. JWT token errors (JWTException)
   - Return: { success: false, message: "Invalid token" }
   - Status: 401

2. Validation errors (ValidationException)
   - Return: { success: false, message: "Validation failed", errors: errors }
   - Status: 422

3. Model not found (ModelNotFoundException)
   - Return: { success: false, message: "Resource not found" }
   - Status: 404

4. Generic exceptions
   - Log to storage/logs/laravel.log
   - In production: generic error message
   - In development: actual error message

Make sure to check if request is for API (starts with /api).
Use the ApiResponse trait if possible.
Return JSON for all API errors.
```

---

## Part 8: Run Everything

### Step 11: Start Services

**In XAMPP:**
- Start Apache
- Start MySQL

**In VSCode (open 3 terminals):**

Terminal 1 - Frontend:
```bash
cd path/to/frontend
npm run dev
# Runs on http://localhost:3000
```

Terminal 2 - Backend:
```bash
cd path/to/sabat-backend
php artisan serve
# Runs on http://localhost:8000
```

Terminal 3 - Check logs (optional):
```bash
cd path/to/sabat-backend
tail -f storage/logs/laravel.log
# On Windows PowerShell:
Get-Content storage\logs\laravel.log -Wait
```

---

## Part 9: Test Everything

### Step 12: Test Health Check

Open browser or Postman:
```
GET http://localhost:8000/api/v1/health
```

Should return:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status": "ok"
  }
}
```

### Step 13: Test Signup

```
POST http://localhost:8000/api/v1/auth/signup

Headers:
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "name": "John Doe",
  "phone": "+989991234567",
  "organization": "ACME Corp"
}
```

Should return:
```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user_id": 1,
    "code": "123456",
    "message": "Use this code to verify (dev only)"
  }
}
```

### Step 14: Test Verify Code

```
POST http://localhost:8000/api/v1/auth/verify-code

Headers:
Content-Type: application/json

Body:
{
  "user_id": 1,
  "code": "123456"
}
```

Should return:
```json
{
  "success": true,
  "message": "Email verified",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "organization": "ACME Corp"
    }
  }
}
```

### Step 15: Test Signin

```
POST http://localhost:8000/api/v1/auth/signin

Headers:
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

Should return token + user data.

---

## Part 10: Troubleshooting Windows Issues

### Issue: "php is not recognized"

Solution:
```bash
# Add PHP to PATH in Windows
# Edit system environment variables
# Add: C:\xampp\php (or wherever XAMPP is installed)
# Restart PowerShell/CMD
```

### Issue: "Database connection refused"

Solution:
```bash
# Make sure MySQL is running in XAMPP
# Check .env DB_HOST is 127.0.0.1
# Check DB_USERNAME is 'root'
# Check DB_PASSWORD is empty ''
# Run: php artisan migrate
```

### Issue: "CORS error on frontend"

Solution:
```bash
# Make sure to run Copilot Prompt 7 (CORS config)
# Check config/cors.php has localhost:3000
# Run: php artisan config:cache
```

### Issue: "JWT token invalid"

Solution:
```bash
# Make sure you ran: php artisan jwt:secret
# Check .env has JWT_SECRET set
# Run: php artisan config:cache
```

### Issue: "Class not found" errors

Solution:
```bash
# Run composer autoload
composer dump-autoload

# Clear Laravel cache
php artisan config:cache
php artisan cache:clear
```

### Issue: "XAMPP MySQL won't start"

Solution:
```
1. Check port 3306 is not in use
2. Run XAMPP as Administrator
3. Delete files in: C:\xampp\mysql\data\ib_logfile*
4. Restart MySQL
```

---

## Quick Reference Commands

```bash
# Start dev server
php artisan serve

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migrations (CAUTION: deletes all data)
php artisan migrate:fresh

# Create model + migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller Api/ControllerName

# Create request class
php artisan make:request RequestName

# Create middleware
php artisan make:middleware MiddlewareName

# Create service
php artisan make:class Services/ServiceName

# Clear cache
php artisan config:cache
php artisan cache:clear
php artisan view:clear

# View all routes
php artisan route:list

# Composer commands
composer install
composer update
composer dump-autoload
```

---

## Final Checklist

- [ ] XAMPP installed with Apache + MySQL
- [ ] Laravel project created with `composer create-project`
- [ ] .env configured with XAMPP database settings
- [ ] Database created in phpMyAdmin (`sabat_db`)
- [ ] Migrations run successfully
- [ ] Composer packages installed
- [ ] JWT secret generated
- [ ] Used all 10 Copilot prompts to create backend
- [ ] All files created in correct locations
- [ ] CORS configured for localhost:3000
- [ ] Health check endpoint working (test in browser)
- [ ] Frontend and backend running simultaneously
- [ ] Auth flow tested (signup → verify → signin)

Once all checked, you have a fully functional Laravel API backend ready for production!
