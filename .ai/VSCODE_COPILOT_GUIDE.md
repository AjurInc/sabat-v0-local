# VSCode Copilot Development Guide

## Purpose
This guide helps VSCode Copilot understand your project structure so it can assist with efficient code generation, debugging, and feature development.

## Project Overview

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **i18n**: react-i18next (English + Persian)
- **Location**: `/vercel/share/v0-project`

### Backend (To be created)
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Authentication**: JWT via tymon/jwt-auth
- **Database**: MySQL/SQLite
- **API Pattern**: RESTful with versioning (`/api/v1`)
- **Location**: `sabat-backend/` (sibling to frontend)

## Authentication Architecture

### Frontend Auth Flow
1. User enters email/password in SignIn component
2. Frontend calls `POST /api/v1/auth/signin`
3. Backend returns verification code
4. Frontend shows code input screen
5. User enters 6-digit code
6. Frontend calls `POST /api/v1/auth/verify-code`
7. Backend returns JWT token + user data
8. Frontend stores token in cookies + Zustand store
9. All subsequent requests include `Authorization: Bearer {token}`

### Backend Auth Flow
1. Generate 6-digit verification code (expires in 10 minutes)
2. Store code in `auth_codes` table with `verified_at = null`
3. Return code in response (for local testing)
4. On verification: Set `verified_at`, update user `email_verified_at`
5. Generate JWT token with user ID and role claims
6. Return token + user data to frontend
7. Store token hash in `access_tokens` table for tracking

## API Structure

### Authentication Endpoints
```
POST   /api/v1/auth/signup        - Create account
POST   /api/v1/auth/signin        - Start signin (returns code)
POST   /api/v1/auth/verify-code   - Verify code (returns token)
POST   /api/v1/auth/resend-code   - Resend verification code
POST   /api/v1/auth/logout        - Revoke token
POST   /api/v1/auth/refresh       - Get new token
```

### User Endpoints
```
GET    /api/v1/user/profile       - Get user profile
PUT    /api/v1/user/profile       - Update profile
POST   /api/v1/user/change-password - Change password
```

### Protected Routes
- Require JWT token in `Authorization: Bearer {token}` header
- Return 401 if token invalid/expired
- Return 403 if insufficient permissions

## Frontend Structure

### Key Directories
```
app/
├── auth/              # Authentication pages
│   ├── signin/        # Sign in page
│   └── signup/        # Sign up page
├── dashboard/         # Protected dashboard routes
└── page.tsx          # Landing page

components/
├── auth/              # Auth-related components
├── landing/           # Landing page sections
└── ui/               # Reusable UI components

lib/
├── api/
│   ├── client.ts     # Axios instance with interceptors
│   ├── auth.service.ts # Auth API calls
│   └── user.service.ts # User API calls
└── utils.ts          # Helper functions

store/
└── auth.ts           # Zustand auth store (user, token, auth state)

hooks/
├── useAuth.ts        # Auth hook
└── use-mobile.ts     # Mobile detection
```

### Important Files
- **store/auth.ts**: Zustand store for authentication state - manages user, token, loading
- **lib/api/client.ts**: Axios instance with JWT interceptor - automatically adds token to requests
- **lib/api/auth.service.ts**: All auth API calls - signup, signin, verify, logout
- **hooks/useAuth.ts**: React hook for accessing auth state - use in components

## Backend Structure (To Create)

### Key Directories
```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   └── UserController.php
│   ├── Middleware/
│   │   └── JwtMiddleware.php
│   ├── Requests/
│   │   ├── Auth/SignUpRequest.php
│   │   └── User/UpdateProfileRequest.php
│   └── Exceptions/
│       └── ApiException.php

app/
├── Models/
│   ├── User.php
│   ├── AuthCode.php
│   └── AccessToken.php
├── Services/
│   ├── AuthService.php
│   └── VerificationService.php
└── Traits/
    └── ApiResponse.php

database/
├── migrations/
│   ├── create_users_table.php
│   ├── create_auth_codes_table.php
│   └── create_access_tokens_table.php
└── seeders/

routes/
└── api.php            # All API routes with /api/v1 prefix

config/
├── jwt.php            # JWT configuration
├── api.php            # API constants (code length, TTL)
└── cors.php           # CORS settings
```

### Important Backend Concepts

#### Models Relationship
```
User
├── hasMany AuthCode (verification codes)
├── hasMany AccessToken (JWT tokens)
└── hasMany Profile (user profile data)

AuthCode
├── belongsTo User
└── hasTimestamps (created_at, expires_at, verified_at)

AccessToken
├── belongsTo User
└── hasTimestamps (created_at, expires_at, revoked_at)
```

#### Verification Code Logic
- Generated on signup/signin (type: 'signup' or 'signin')
- 6 random digits
- Expires in 10 minutes (600 seconds)
- Max 3 resends per 15 minutes
- Marked verified when user submits correct code
- Can't be reused after verified

#### JWT Token
- Issued after successful code verification
- Contains user ID, email, role in claims
- Expires in 1 hour
- Refreshable up to 7 days from issue
- Revoked on logout

## Common Development Tasks

### Adding New API Endpoint

**Backend (Laravel)**
1. Create migration if DB schema needed: `php artisan make:migration`
2. Create model: `php artisan make:model ModelName -m`
3. Create request validation: `php artisan make:request NameRequest`
4. Create controller: `php artisan make:controller Api/ControllerName`
5. Add service method in `app/Services/SomeService.php`
6. Add route in `routes/api.php` under `/api/v1` group
7. Add tests in `tests/Feature/`

**Frontend (Next.js)**
1. Create API service in `lib/api/name.service.ts`
2. Create hook if needed: `hooks/useName.ts`
3. Use service in component with error handling
4. Update Zustand store if new state needed
5. Test with VSCode Copilot debugging

### Adding New Feature (End-to-End)

1. **Plan Database** - What data do we need to store?
2. **Create Backend**
   - Migrations
   - Models with relationships
   - Validation requests
   - Services with business logic
   - Controllers calling services
   - Routes
3. **Test Backend** - Use Postman/cURL to verify endpoints
4. **Create Frontend**
   - API service for calls
   - Components using service
   - Update store if needed
   - Add error handling
   - Test in dev server

### Debugging

#### Backend Debugging
```php
// Log to storage/logs/laravel.log
Log::debug('Message', ['data' => $variable]);

// In controller
dd($variable); // Die and dump

// Get authenticated user
$user = auth('api')->user();

// Check request data
dd($request->all());
```

#### Frontend Debugging
```typescript
// Log to browser console
console.log('[v0] Message:', variable);

// Check API response
console.log('[API] Response:', response.data);

// Check store state
console.log('[Store] Auth state:', useAuthStore.getState());

// Check token
console.log('[Token] Current:', useAuthStore.getState().token);
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend (.env)
```
APP_DEBUG=true
APP_URL=http://localhost:8000
API_PREFIX=v1

DB_CONNECTION=sqlite
JWT_SECRET=generated_by_php_artisan_jwt:secret
JWT_ALGORITHM=HS256

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## VSCode Extensions to Install

```json
{
  "recommendations": [
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "nrwl.angular-console",
    "ms-dotnettools.vscode-dotnet-runtime",
    "bmewburn.vscode-intelephense-client",
    "felixbecker.php-debug"
  ]
}
```

## Code Style & Patterns

### Frontend (TypeScript)
```typescript
// Use named exports
export function MyComponent() {}

// Use React hooks at top of component
const router = useRouter();
const { t } = useTranslation();
const auth = useAuth();

// Use async/await with try/catch
try {
  const result = await apiClient.get('/endpoint');
} catch (error) {
  console.error('[Error]', error);
}

// Type all props
interface Props {
  title: string;
  onClose: () => void;
}
```

### Backend (PHP)
```php
// Use Laravel conventions
// Models: singular (User, AuthCode)
// Tables: plural (users, auth_codes)
// Controllers: singular + Controller (UserController)

// Use dependency injection
public function __construct(AuthService $authService) {
    $this->authService = $authService;
}

// Use form requests for validation
public function store(StoreRequest $request) {
    // Data already validated
}

// Use service layer for business logic
$result = $this->authService->verify($data);

// Return consistent API response
return $this->success($data, 'Message', 200);
return $this->error('Error message', 400);
```

## Testing

### Backend
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/AuthApiTest.php

# Run with coverage
php artisan test --coverage
```

### Frontend
```bash
# Run tests
npm run test

# Run in watch mode
npm run test:watch
```

## Performance Optimization

### Frontend
- Use `React.memo()` for expensive components
- Use `useCallback()` for event handlers
- Implement pagination for lists
- Cache API responses with SWR

### Backend
- Use eager loading with `with()` in models
- Add database indexes on frequently queried fields
- Use pagination for list endpoints
- Cache with Redis for expensive operations
- Use queues for long-running tasks

## Security Checklist

### Frontend
- ✅ Validate all form input
- ✅ Store JWT in secure cookies (httpOnly, secure, sameSite)
- ✅ Never store in localStorage
- ✅ Add CSRF protection
- ✅ Use Content Security Policy headers

### Backend
- ✅ Hash passwords with bcrypt
- ✅ Validate all input with Form Requests
- ✅ Use rate limiting on auth endpoints
- ✅ Implement CORS properly
- ✅ Use parameterized queries (Laravel ORM)
- ✅ Add audit logging for sensitive operations
- ✅ Implement refresh token rotation

## Deployment Checklist

Before deploying to production:
- [ ] Set `APP_DEBUG=false`
- [ ] Update `APP_URL` to production domain
- [ ] Update CORS origins to production domain
- [ ] Generate new JWT secret on production server
- [ ] Run migrations on production: `php artisan migrate --force`
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerting
- [ ] Backup database regularly
- [ ] Test end-to-end auth flow

## Getting Help from Copilot

### Good Prompts
```
"Create a Laravel controller method that handles user signup with validation"
"Add error handling to the auth API client interceptor"
"Generate a database migration for storing user preferences"
"Create unit tests for the verification service"
```

### Bad Prompts
```
"Fix this"
"Make it work"
"What's wrong?"
"Generate code"
```

### Copilot Tips
1. Include context: file paths, framework versions, existing code
2. Be specific about what you want: endpoint name, expected response
3. Reference existing patterns in your codebase
4. Ask to follow specific architecture patterns
5. Ask it to explain code before generating
6. Request tests alongside implementation

## Quick Reference

| Task | Frontend | Backend |
|------|----------|---------|
| Get current user | `useAuth()` hook | `auth('api')->user()` |
| Make API call | `apiClient.get(url)` | `Http::get(url)` |
| Validate input | React hook form | Form Request class |
| Handle error | try/catch + toast | throw exception |
| Store auth token | Zustand + cookies | JWT issued |
| Check if logged in | `isAuthenticated` in store | Middleware checks token |
| Refresh token | Auto via interceptor | `auth('api')->refresh()` |
| Log message | `console.log()` | `Log::debug()` |

## Document Updates

This file describes v1 of the API and project structure. When adding major features:
1. Update relevant documentation section
2. Add to "Common Development Tasks" if pattern-based
3. Update deployment checklist if needed
4. Add environment variables if added

## Contact & Support

For architecture questions or changes:
- Review BACKEND_SETUP.md for backend setup
- Review API_SPECIFICATION.md for endpoint details
- Review FRONTEND_API_CLIENT.md for frontend integration
- Check LARAVEL_PROJECT_STRUCTURE.md for code organization
