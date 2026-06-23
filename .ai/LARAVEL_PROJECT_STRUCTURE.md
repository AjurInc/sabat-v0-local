# Laravel Project Structure Guide

## Directory Layout

```
sabat-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── UserController.php
│   │   │   │   └── DashboardController.php
│   │   │   └── Controller.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   ├── VerifyCsrfToken.php
│   │   │   ├── JwtMiddleware.php
│   │   │   └── ApiResponseMiddleware.php
│   │   └── Requests/
│   │       ├── Auth/
│   │       │   ├── SignUpRequest.php
│   │       │   ├── SignInRequest.php
│   │       │   └── VerifyCodeRequest.php
│   │       └── User/
│   │           └── UpdateProfileRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── AuthCode.php
│   │   └── AccessToken.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── UserService.php
│   │   └── VerificationService.php
│   ├── Exceptions/
│   │   ├── ApiException.php
│   │   └── ValidationException.php
│   └── Traits/
│       ├── ApiResponse.php
│       └── RateLimitable.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_auth_codes_table.php
│   │   └── 2024_01_01_000003_create_access_tokens_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
├── config/
│   ├── app.php
│   ├── database.php
│   ├── jwt.php
│   ├── cors.php
│   ├── auth.php
│   └── api.php
├── tests/
│   ├── Unit/
│   │   ├── AuthServiceTest.php
│   │   └── UserServiceTest.php
│   └── Feature/
│       ├── AuthApiTest.php
│       └── UserApiTest.php
├── storage/
│   ├── logs/
│   │   └── laravel.log
│   └── framework/
├── .env
├── .env.example
├── composer.json
├── artisan
└── README.md
```

## File Descriptions

### Controllers

**AuthController.php** - Handles all authentication endpoints
- `signup()` - Create new account
- `signin()` - Sign in user
- `verifyCode()` - Verify 6-digit code
- `resendCode()` - Resend verification code
- `logout()` - Revoke token
- `refresh()` - Refresh token

**UserController.php** - Handles user profile endpoints
- `getProfile()` - Get current user profile
- `updateProfile()` - Update user information
- `changePassword()` - Change user password

**DashboardController.php** - Dashboard/analytics endpoints
- `getStats()` - User statistics
- `getActivity()` - User activity logs

### Models

**User.php** - User model with relationships
```php
// Relationships
- hasMany('AuthCode')
- hasMany('AccessToken')

// Attributes
- id, name, email, password
- phone, profile_completed, preferences
- email_verified_at, created_at, updated_at

// Methods
- verifyEmail()
- generateAuthCode()
- getAuthCode()
- tokens()
```

**AuthCode.php** - Authentication code model
```php
// Relationships
- belongsTo('User')

// Attributes
- id, user_id, code, type
- expires_at, verified_at, created_at

// Methods
- isValid()
- isExpired()
- verify()
```

**AccessToken.php** - JWT token tracking
```php
// Relationships
- belongsTo('User')

// Attributes
- id, user_id, token_hash
- ip_address, user_agent, revoked
- expires_at, created_at

// Methods
- revoke()
- isValid()
```

### Services

**AuthService.php** - Business logic for authentication
```php
Methods:
- signup(array $data): array
- signin(array $data): array
- verifyCode(int $userId, string $code): array
- resendCode(int $userId): array
- logout(User $user): void
- refreshToken(User $user): array
```

**UserService.php** - Business logic for user operations
```php
Methods:
- getProfile(User $user): User
- updateProfile(User $user, array $data): User
- changePassword(User $user, array $data): void
- deleteAccount(User $user): void
```

**VerificationService.php** - Code generation and verification
```php
Methods:
- generateCode(int $userId, string $type): string
- verifyCode(int $userId, string $code): bool
- expireOldCodes(int $userId): void
- getExpirationTime(): Carbon
```

### Requests (Form Validation)

**SignUpRequest.php** - Validate signup data
```php
Rules:
- name: required, string, 2-255, letters only
- email: required, email, unique:users
- password: required, min:8, regex:/[A-Z]/, regex:/[0-9]/
- password_confirmation: required, same:password
```

**SignInRequest.php** - Validate signin data
```php
Rules:
- email: required, email
- password: required, string
```

**VerifyCodeRequest.php** - Validate code verification
```php
Rules:
- user_id: required, exists:users
- verification_code: required, 6 digits
```

### Middleware

**JwtMiddleware.php** - Verify JWT token
- Extracts token from Authorization header
- Validates token with JWT library
- Adds authenticated user to request

**ApiResponseMiddleware.php** - Standardize responses
- Wraps all responses in standard format
- Adds status codes
- Handles errors consistently

**RateLimitable.php** - Rate limiting trait
- Limits requests per endpoint
- Returns 429 when limit exceeded
- Tracks per IP or per user

### Exceptions

**ApiException.php** - Custom API exception
```php
Properties:
- status: HTTP status code
- message: Error message
- errors: Field-level errors

Methods:
- render(): JsonResponse
```

### Routes

**routes/api.php** - API routes
```php
// Public routes
POST /auth/signup
POST /auth/signin
POST /auth/verify-code
POST /auth/resend-code

// Protected routes (require JWT)
POST /auth/logout
POST /auth/refresh
GET /user/profile
PUT /user/profile
POST /user/change-password
```

## Database Migrations

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_completed BOOLEAN DEFAULT FALSE,
  preferences JSON,
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Auth Codes Table
```sql
CREATE TABLE auth_codes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  code VARCHAR(6) NOT NULL,
  type ENUM('signup', 'signin') DEFAULT 'signup',
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Access Tokens Table
```sql
CREATE TABLE access_tokens (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Configuration Files

### config/api.php
```php
return [
    'prefix' => 'v1',
    'verification_code_length' => 6,
    'verification_code_expiry' => 600, // 10 minutes
    'jwt_ttl' => 3600, // 1 hour
    'refresh_ttl' => 604800, // 7 days
    'rate_limits' => [
        'auth' => '5,1', // 5 requests per minute
        'user' => '60,1', // 60 requests per minute
        'general' => '30,1', // 30 requests per minute
    ],
];
```

### config/cors.php
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
    ],
    'supports_credentials' => true,
];
```

## Common Commands

```bash
# Create migration
php artisan make:migration create_users_table

# Create model with migration
php artisan make:model User -m

# Create controller with methods
php artisan make:controller Api/UserController --api

# Create request class
php artisan make:request Auth/SignUpRequest

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear

# Run tests
php artisan test

# Generate documentation
php artisan api:docs
```

## Code Examples

### Creating New Endpoint

1. **Create Controller Method**
```php
// app/Http/Controllers/Api/ExampleController.php
public function getExample(Request $request)
{
    try {
        $data = ExampleService::getData($request->user());
        return $this->success($data, 'Data retrieved', 200);
    } catch (\Exception $e) {
        return $this->error($e->getMessage(), 500);
    }
}
```

2. **Add Route**
```php
// routes/api.php
Route::get('/example', [ExampleController::class, 'getExample'])->middleware('auth:api');
```

3. **Create Service if needed**
```php
// app/Services/ExampleService.php
public static function getData(User $user)
{
    return $user->examples()->latest()->get();
}
```

4. **Add Tests**
```php
// tests/Feature/ExampleApiTest.php
public function test_get_example()
{
    $response = $this->getJson('/api/v1/example');
    $response->assertStatus(200);
}
```

## Performance Tips

- Use query optimization with `select()` and `with()`
- Cache frequently accessed data
- Use database indexes for search queries
- Implement pagination for large datasets
- Use jobs/queues for long-running operations
- Monitor slow queries with Laravel Debugbar

## Security Best Practices

- Validate all input with Form Requests
- Use password hashing with bcrypt
- Implement rate limiting on sensitive endpoints
- Use HTTPS in production
- Keep JWT secrets secure in .env
- Add request sanitization for user input
- Implement CORS properly
- Use parameterized queries (Laravel ORM handles this)
