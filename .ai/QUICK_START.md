# Quick Start Guide - SABAT Project

## Project Status

- ✅ **Frontend**: Fully built (Next.js 16, TypeScript, Tailwind, i18n)
- ⏳ **Backend**: To be created (Laravel 11, JWT, REST API)

## What's Next

You're here because you want to:
1. Download frontend code and set it up in VSCode
2. Create Laravel backend with authentication
3. Connect frontend to backend
4. Use VSCode Copilot to help with development

## Files in `.ai/` Directory

Read these in this order:

1. **QUICK_START.md** (this file) - Overview and setup instructions
2. **BACKEND_SETUP.md** - How to set up Laravel locally
3. **API_SPECIFICATION.md** - All API endpoints and responses
4. **FRONTEND_API_CLIENT.md** - How to set up frontend API integration
5. **LARAVEL_PROJECT_STRUCTURE.md** - File organization and code patterns
6. **DATABASE_SCHEMA.md** - Complete database design
7. **VSCODE_COPILOT_GUIDE.md** - How to use VSCode Copilot effectively

## Part 1: Get Frontend Ready

### 1. Download Project
- Click "Download ZIP" button in v0.app
- OR use GitHub to clone
- Extract to your workspace

### 2. Install Dependencies
```bash
cd sabat-frontend
pnpm install
# or
npm install
```

### 3. Start Dev Server
```bash
pnpm dev
# Frontend runs at http://localhost:3000
```

### 4. Verify Frontend Works
- Open http://localhost:3000
- Should see landing page
- Navigation, features, FAQ all translated to Persian

## Part 2: Create Laravel Backend

### 1. Create Laravel Project
```bash
# Create in sibling directory to frontend
cd ..
composer create-project laravel/laravel sabat-backend
cd sabat-backend
```

### 2. Install Packages
```bash
composer require tymon/jwt-auth
composer require laravel/sanctum
composer require laravel/tinker
```

### 3. Set Up Environment
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 4. Configure Database
Edit `.env`:
```
DB_CONNECTION=sqlite
DB_DATABASE=/full/path/to/database.sqlite
```

Or use MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=sabat_db
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Create Database
```bash
touch database/database.sqlite
# Or create MySQL database
mysql -u root -e "CREATE DATABASE sabat_db;"
```

### 6. Publish Config
```bash
php artisan vendor:publish --provider="Tymon\JwtAuth\Providers\JwtAuthServiceProvider"
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 7. Run Migrations
```bash
php artisan migrate
```

### 8. Start Backend Server
```bash
php artisan serve
# Backend runs at http://localhost:8000
```

## Part 3: Build Backend with VSCode Copilot

Now use VSCode Copilot to build Laravel features. Ask it to:

### Authentication
```
"Create a Laravel AuthController with JWT authentication. 
Follow the API specification for endpoints:
- POST /auth/signup - returns verification code
- POST /auth/verify-code - returns JWT token
- POST /auth/signin - returns verification code
- POST /auth/logout - revoke token"
```

### User Management
```
"Create UserController with endpoints to:
- GET /user/profile - return current user
- PUT /user/profile - update profile
- POST /user/change-password - change password

Use Laravel Form Requests for validation."
```

### Models and Migrations
```
"Create Laravel migrations and models for:
1. User model with properties: name, email, password, phone, preferences
2. AuthCode model for storing verification codes
3. AccessToken model for tracking JWT tokens

Follow the schema in DATABASE_SCHEMA.md"
```

### Services
```
"Create AuthService class that handles:
- User signup with code generation
- Code verification
- Token issuance
- Password hashing

Use dependency injection and follow Laravel conventions."
```

## Part 4: Connect Frontend to Backend

### 1. Create API Client
See **FRONTEND_API_CLIENT.md** for:
- `lib/api/client.ts` - Axios instance
- `store/auth.ts` - Zustand store
- `lib/api/auth.service.ts` - Auth calls
- `hooks/useAuth.ts` - Auth hook

### 2. Update Environment
Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Test Authentication Flow
1. Frontend: http://localhost:3000/auth/signup
2. Backend: POST /api/v1/auth/signup
3. Backend returns 6-digit code
4. Frontend shows code input
5. Backend: POST /api/v1/auth/verify-code
6. Backend returns JWT token
7. Frontend stores token and redirects to dashboard

## Directory Structure

```
~/workspace/
├── sabat-frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── store/
│   ├── .ai/                 # ← You are here
│   │   ├── QUICK_START.md
│   │   ├── BACKEND_SETUP.md
│   │   ├── API_SPECIFICATION.md
│   │   ├── FRONTEND_API_CLIENT.md
│   │   ├── LARAVEL_PROJECT_STRUCTURE.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── VSCODE_COPILOT_GUIDE.md
│   ├── package.json
│   └── README.md
│
└── sabat-backend/           # Laravel app (to create)
    ├── app/
    ├── database/
    ├── routes/
    ├── config/
    ├── .env
    ├── artisan
    └── composer.json
```

## VSCode Setup

### Extensions to Install
```
GitHub Copilot
GitHub Copilot Chat
ESLint
Prettier
Tailwind CSS IntelliSense
PHP Intelephense
Laravel Extension Pack
```

### Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "intelephense"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/vendor": true
  }
}
```

## Common Commands

### Frontend
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Check linting
npm run test          # Run tests
```

### Backend
```bash
php artisan serve              # Start dev server
php artisan migrate            # Run migrations
php artisan tinker             # Interactive shell
php artisan make:model Name    # Create model
php artisan make:controller    # Create controller
php artisan test               # Run tests
```

## API Testing

### Using Postman
1. Create environment with:
   ```
   {{base_url}} = http://localhost:8000/api/v1
   {{token}} = (leave empty, will fill after signin)
   ```

2. Create requests for each endpoint in API_SPECIFICATION.md

3. Test signup → verify → signin flow

### Using cURL
```bash
# Signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
  }'

# Verify code
curl -X POST http://localhost:8000/api/v1/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "verification_code": "123456"
  }'
```

## Debugging

### Frontend Issues
```typescript
// Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Check auth store
console.log(useAuthStore.getState());

// Check token
console.log('Token:', useAuthStore.getState().token);

// Check interceptor
// Add logs in lib/api/client.ts
```

### Backend Issues
```bash
# Check logs
tail -f storage/logs/laravel.log

# Check database
sqlite3 database/database.sqlite ".tables"

# Run migration fresh
php artisan migrate:fresh

# Debug with tinker
php artisan tinker
> User::all()
> AuthCode::where('user_id', 1)->get()
```

## Next Steps

1. **Clone frontend** from v0 to VSCode ✓
2. **Create Laravel backend** using guides
3. **Build API endpoints** with Copilot help
4. **Connect frontend to backend** with API client
5. **Test full auth flow** end-to-end
6. **Deploy to production** when ready

## File Sizes Reference

- Frontend: ~500KB (node_modules excluded)
- Backend: ~200KB (vendor excluded)
- Total dependencies: ~500MB (node_modules + vendor)

## Troubleshooting

### "Backend not responding"
- Check Laravel server: `php artisan serve`
- Check CORS: See config/cors.php in BACKEND_SETUP.md
- Check API URL in frontend .env.local

### "Token not working"
- Check JWT secret: `php artisan jwt:secret`
- Check token expiration
- Check token stored in cookies

### "Database error"
- Check .env DB connection
- Run: `php artisan migrate:fresh`
- Check database file permissions

### "Port already in use"
```bash
# Frontend on different port
pnpm dev -- -p 3001

# Backend on different port
php artisan serve --port=8001
```

## Support Resources

- Laravel docs: https://laravel.com/docs
- Next.js docs: https://nextjs.org/docs
- JWT Auth docs: https://github.com/tymondesigns/jwt-auth
- Tailwind docs: https://tailwindcss.com
- VSCode Copilot: Ask directly in VSCode

## Key Points to Remember

1. **Frontend talks to Backend via REST API** using Axios
2. **Authentication uses JWT tokens** stored in httpOnly cookies
3. **Verification codes are 6 digits** valid for 10 minutes
4. **All API errors follow same format** with status_code and errors object
5. **Use VSCode Copilot** to speed up coding with context from .ai/ files
6. **Test end-to-end frequently** during development
7. **Keep frontend and backend running** during dev (two terminals)

## Security Reminder

Never commit:
- `.env` file with secrets
- JWT secret in code
- API keys or passwords
- Database with real user data

Use `.gitignore` to exclude:
```
.env
.env.local
node_modules/
vendor/
storage/logs/
database/*.sqlite
```

---

**You're all set! Start building with VSCode Copilot. Happy coding! 🚀**

Questions? Check the .ai/ documentation files first, they have detailed answers.
