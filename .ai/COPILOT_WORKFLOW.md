# VSCode Copilot Workflow - Step by Step

## How to Use GitHub Copilot with the Prompts

### Setup Copilot First

1. Install GitHub Copilot extension in VSCode
   - Open VSCode
   - Go to Extensions (Ctrl+Shift+X)
   - Search "GitHub Copilot"
   - Install the official one by GitHub
   - Sign in with GitHub account

2. Enable Copilot Chat
   - Install "GitHub Copilot Chat" extension
   - Open Copilot Chat panel (Ctrl+Shift+I)

---

## The Workflow

### Step 1: Follow WINDOWS_XAMPP_SETUP.md Parts 1-5

Complete these first:
- [ ] Verify PHP and Composer
- [ ] Create Laravel Project
- [ ] Setup Environment File
- [ ] Create Database
- [ ] Run Migrations (may need custom prompts)

### Step 2: Install Dependencies

```bash
composer require tymon/jwt-auth:^2.1
composer require fruitcake/laravel-cors
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
php artisan jwt:secret
```

### Step 3: Create Folder Structure

```bash
mkdir app\Services
mkdir app\Http\Controllers\Api
mkdir app\Http\Requests
mkdir app\Traits
```

### Step 4: Use Copilot Prompts in Order

**IMPORTANT**: Open Copilot Chat (Ctrl+Shift+I) before each step.

---

## Copilot Prompt Usage Guide

### How to Use Each Prompt

**General Pattern:**
1. Open Copilot Chat (Ctrl+Shift+I)
2. Copy the prompt from WINDOWS_XAMPP_SETUP.md
3. Paste entire prompt into chat
4. Press Enter
5. Wait for Copilot to generate code
6. Copy the generated code
7. Create file in VSCode
8. Paste code
9. Save file

---

## Detailed Steps with Prompts

### Prompt 1: User Model & Migration

**Step 1:** Open Copilot Chat (Ctrl+Shift+I)

**Step 2:** Copy-paste this into chat:

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

**Step 3:** Wait for response (usually 10-30 seconds)

**Step 4:** You'll get 2 code blocks:
- First: app/Models/User.php
- Second: database/migrations/create_users_table.php

**Step 5:** For User.php:
- Create file: `app/Models/User.php` (it exists, so modify)
- Replace entire content with Copilot's code
- Save (Ctrl+S)

**Step 6:** For Migration:
- Create file: `database/migrations/[timestamp]_create_users_table.php`
- Replace content with Copilot's code
- Save

**Step 7:** Run migration:
```bash
php artisan migrate
```

If error "Column [email_verified_at] already exists":
```bash
php artisan migrate:reset
php artisan migrate
```

---

### Prompt 2: Auth Controller

**Step 1:** Open Copilot Chat (Ctrl+Shift+I)

**Step 2:** Copy-paste this:

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

**Step 3:** Create file: `app/Http/Controllers/Api/AuthController.php`

**Step 4:** Paste code and save

---

### Prompt 3: Auth Middleware

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Create file: `app/Http/Middleware/AuthMiddleware.php`

**Step 4:** Paste and save

---

### Prompt 4: Validation Requests

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Create 4 files:
- `app/Http/Requests/SignupRequest.php`
- `app/Http/Requests/VerifyCodeRequest.php`
- `app/Http/Requests/SigninRequest.php`
- `app/Http/Requests/RefreshTokenRequest.php`

**Step 4:** Paste code into each and save

---

### Prompt 5: User Service Class

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Create file: `app/Services/UserService.php`

**Step 4:** Paste and save

---

### Prompt 6: Routes

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Open file: `routes/api.php`

**Step 4:** Replace content with Copilot's code

**Step 5:** Save

---

### Prompt 7: CORS Configuration

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Open file: `config/cors.php`

**Step 4:** Replace configuration array with Copilot's code

**Step 5:** Save

---

### Prompt 8: Auth Code & Access Token Models

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Create files:
- `app/Models/AuthCode.php`
- `app/Models/AccessToken.php`
- Update `app/Models/User.php`
- Create 2 migration files

**Step 4:** Run migrations:
```bash
php artisan migrate
```

---

### Prompt 9: API Response Trait

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Create file: `app/Traits/ApiResponse.php`

**Step 4:** Paste and save

---

### Prompt 10: Exception Handler

**Step 1:** Open Copilot Chat

**Step 2:** Copy-paste:

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

**Step 3:** Open file: `app/Exceptions/Handler.php`

**Step 4:** Update render method with code

**Step 5:** Save

---

## After All Prompts

### Step 1: Register Middleware

In `app/Http/Kernel.php`, find `$routeMiddleware` array and add:

```php
'jwt.auth' => \App\Http\Middleware\AuthMiddleware::class,
```

### Step 2: Clear Cache

```bash
php artisan config:cache
php artisan cache:clear
```

### Step 3: Start Server

Terminal 1 - Backend:
```bash
php artisan serve
```

Terminal 2 - Test health check:
```bash
curl http://localhost:8000/api/v1/health
```

Should return:
```json
{"success":true,"message":"Success","data":{"status":"ok"}}
```

---

## Troubleshooting Copilot Issues

### Issue: Copilot suggests wrong code

**Solution:**
- Be more specific in your prompt
- Add constraints like "no external packages except..."
- Copy exact prompt from WINDOWS_XAMPP_SETUP.md

### Issue: File already exists errors

**Solution:**
- Check if file exists before creating
- If updating existing, copy code into existing file
- Save (Ctrl+S)

### Issue: Import errors after pasting code

**Solution:**
- Run: `composer dump-autoload`
- Check all use statements match your project structure
- If class not found, verify file location

### Issue: Database migration fails

**Solution:**
- Check .env database credentials
- Make sure MySQL is running
- Check if table already exists: `php artisan migrate:reset`

---

## Quick Command Reference

```bash
# After each file creation, might need:
composer dump-autoload          # Rebuild autoloader
php artisan config:cache        # Cache configuration
php artisan route:list          # View all routes
php artisan migrate             # Run pending migrations
php artisan migrate:reset       # Delete all tables
php artisan tinker              # Test code interactively
```

---

## Final Verification Checklist

After using all 10 prompts:

- [ ] User model created at app/Models/User.php
- [ ] AuthCode model created at app/Models/AuthCode.php
- [ ] AccessToken model created at app/Models/AccessToken.php
- [ ] AuthController created at app/Http/Controllers/Api/AuthController.php
- [ ] AuthMiddleware created at app/Http/Middleware/AuthMiddleware.php
- [ ] 4 validation request classes created
- [ ] UserService created at app/Services/UserService.php
- [ ] ApiResponse trait created at app/Traits/ApiResponse.php
- [ ] Routes configured in routes/api.php
- [ ] CORS configured in config/cors.php
- [ ] Exception handler updated
- [ ] Middleware registered in app/Http/Kernel.php
- [ ] All migrations run successfully
- [ ] Health check endpoint works
- [ ] Can test signup flow

Once all checked, backend is complete and ready!
