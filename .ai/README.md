# SABAT Project - AI-Assisted Development Documentation

## Overview

This folder contains comprehensive documentation for developing the SABAT backend and integrating it with the Next.js frontend. These documents are designed to help you work efficiently with VSCode Copilot and maintain a clear, scalable architecture.

## 📚 Documentation Files

### 1. **QUICK_START.md** - Start here! ⭐
Your entry point to the project. Contains:
- Project status overview
- Step-by-step setup for frontend and backend
- Directory structure
- Common commands
- Troubleshooting quick fixes

**Read this first if you're new to the project.**

---

### 2. **BACKEND_SETUP.md**
Complete Laravel backend setup guide:
- Prerequisites and installation
- Environment configuration
- Database setup (MySQL or SQLite)
- Starting the dev server
- Full authentication flow documentation
- Local verification without email services
- All API endpoints with request/response examples
- Error handling and rate limiting
- Troubleshooting section
- Development commands reference

**Use this when setting up Laravel for the first time.**

---

### 3. **API_SPECIFICATION.md**
Complete REST API reference:
- Base URL and authentication details
- Standard response format
- All endpoint specifications with:
  - HTTP method and path
  - Request body
  - Validation rules
  - Response examples
  - Error cases
- Status codes and meanings
- Rate limiting details
- Pagination format
- Webhook events (future)

**Reference this when building endpoints or debugging API issues.**

---

### 4. **FRONTEND_API_CLIENT.md**
How to connect Next.js frontend to Laravel backend:
- API client setup with Axios
- Zustand auth store implementation
- Auth service for API calls
- User service for user endpoints
- Environment variables
- Custom React hooks
- Protected routes
- Usage examples in components
- Error handling patterns
- Testing with Postman/cURL
- Debugging tips

**Follow this to set up API integration in the frontend.**

---

### 5. **LARAVEL_PROJECT_STRUCTURE.md**
Laravel code organization and patterns:
- Complete directory layout
- File descriptions and purposes
- Model relationships
- Service layer architecture
- Request validation classes
- Middleware explanations
- Exception handling
- Database migrations
- Configuration files
- Code examples for common patterns
- Performance tips
- Security best practices

**Reference this when creating new Laravel components.**

---

### 6. **DATABASE_SCHEMA.md**
Complete database design reference:
- All tables with SQL and Laravel migrations
- Column descriptions and types
- Relationships diagram
- Query examples
- Indexes strategy
- Data retention policies
- Backup strategy
- Security considerations
- Performance optimization tips

**Use this when designing new database features.**

---

### 7. **VSCODE_COPILOT_GUIDE.md**
How to work effectively with VSCode Copilot:
- Project architecture overview
- Authentication flow (frontend and backend)
- API structure explanation
- Frontend and backend directory structure
- Common development tasks
- Code style and patterns
- Testing approaches
- Performance optimization
- Security checklist
- Deployment checklist
- Good vs bad prompts for Copilot
- Copilot tips and tricks
- Quick reference table

**Use this when asking Copilot for help or starting a new feature.**

---

## 🚀 Getting Started

### For Beginners
1. Read **QUICK_START.md** → Get oriented
2. Read **BACKEND_SETUP.md** → Create Laravel project
3. Read **API_SPECIFICATION.md** → Understand endpoints
4. Read **FRONTEND_API_CLIENT.md** → Set up API integration

### For Experienced Developers
1. Skim **QUICK_START.md** for directory structure
2. Check **API_SPECIFICATION.md** for endpoints
3. Use **LARAVEL_PROJECT_STRUCTURE.md** for conventions
4. Ask VSCode Copilot using **VSCODE_COPILOT_GUIDE.md** patterns

### For Database Work
1. Review **DATABASE_SCHEMA.md** for current tables
2. Ask Copilot to generate migrations using schema details
3. Test migrations locally
4. Document changes

## 🎯 Common Tasks

### Create New API Endpoint
1. Read relevant section in **API_SPECIFICATION.md**
2. Check **LARAVEL_PROJECT_STRUCTURE.md** for patterns
3. Use prompt from **VSCODE_COPILOT_GUIDE.md**
4. Generate with Copilot, then test

### Add Database Table
1. Design schema, document in **DATABASE_SCHEMA.md**
2. Generate migration with Copilot
3. Create corresponding model
4. Add relationships to other models
5. Test with Laravel Tinker

### Debug Auth Flow
1. Check **BACKEND_SETUP.md** for auth flow diagram
2. Check **VSCODE_COPILOT_GUIDE.md** for debugging patterns
3. Enable logging in .env
4. Follow request through backend
5. Check frontend store and interceptor

### Fix API Integration
1. Check **FRONTEND_API_CLIENT.md** for client setup
2. Verify API_URL in .env.local
3. Check network tab in browser devtools
4. Use Postman to test endpoint directly
5. Check CORS settings in Laravel

## 📖 How to Use These Docs

### Reading for Understanding
- Start with "Overview" sections
- Read code examples
- Review diagrams
- Check references at bottom

### Reading for Implementation
- Use Ctrl+F to search for what you need
- Follow step-by-step sections
- Copy code examples where appropriate
- Test immediately after implementing

### Updating Documentation
When adding new features:
1. Update relevant .md file
2. Add to code examples if pattern-based
3. Update API_SPECIFICATION.md if new endpoints
4. Update DATABASE_SCHEMA.md if new tables
5. Update VSCODE_COPILOT_GUIDE.md if new patterns

## 🤖 Working with VSCode Copilot

### Before Asking Copilot
1. Check if answer is in these docs (Ctrl+F)
2. Review examples in **VSCODE_COPILOT_GUIDE.md**
3. Have context ready (file paths, framework versions)

### Good Copilot Prompts
```
"Create a Laravel controller method following the pattern in 
LARAVEL_PROJECT_STRUCTURE.md for handling user signup"

"Add validation to the signup form following the request 
validation rules in API_SPECIFICATION.md"

"Generate a database migration for storing user preferences 
as JSON, following the structure in DATABASE_SCHEMA.md"
```

### Bad Copilot Prompts
```
"Fix this" ❌
"Make it work" ❌
"Generate code" ❌ (too vague)
```

## 🔍 Quick Reference

### Endpoints
- **Auth**: See API_SPECIFICATION.md → Authentication Endpoints
- **User**: See API_SPECIFICATION.md → User Endpoints
- **Database**: See DATABASE_SCHEMA.md → Tables section

### Code Patterns
- **Frontend**: See VSCODE_COPILOT_GUIDE.md → Code Style & Patterns
- **Backend**: See LARAVEL_PROJECT_STRUCTURE.md → Code Examples
- **API Client**: See FRONTEND_API_CLIENT.md → Usage Example

### Development
- **Frontend**: npm/pnpm commands in QUICK_START.md
- **Backend**: php artisan commands in BACKEND_SETUP.md
- **Testing**: See FRONTEND_API_CLIENT.md → Testing with Postman

## 📦 File Structure

```
.ai/
├── README.md                          ← You are here
├── QUICK_START.md                     ← Start here!
├── BACKEND_SETUP.md                   ← Setup guide
├── API_SPECIFICATION.md               ← All endpoints
├── FRONTEND_API_CLIENT.md             ← API integration
├── LARAVEL_PROJECT_STRUCTURE.md       ← Code organization
├── DATABASE_SCHEMA.md                 ← Database design
└── VSCODE_COPILOT_GUIDE.md           ← Copilot help
```

## ✅ Checklist Before Starting

- [ ] Downloaded frontend code from v0.app
- [ ] Installed pnpm/npm dependencies
- [ ] Read QUICK_START.md
- [ ] Created Laravel project
- [ ] Installed Laravel packages
- [ ] Set up .env file
- [ ] Created database
- [ ] Ran migrations
- [ ] Started both dev servers (frontend + backend)
- [ ] Tested frontend loads at http://localhost:3000
- [ ] Tested backend responds at http://localhost:8000/api/v1/health (optional)

## 🐛 Common Issues

### "I don't know where to start"
→ Read QUICK_START.md from top to bottom

### "API endpoints not working"
→ Check API_SPECIFICATION.md for correct format

### "Frontend can't connect to backend"
→ Check FRONTEND_API_CLIENT.md environment variables

### "Database error"
→ Check DATABASE_SCHEMA.md and BACKEND_SETUP.md

### "Copilot not understanding my request"
→ Use examples from VSCODE_COPILOT_GUIDE.md

## 📞 Support

For specific questions, search in:
1. **QUICK_START.md** - General setup
2. **BACKEND_SETUP.md** - Backend errors
3. **API_SPECIFICATION.md** - Endpoint issues
4. **FRONTEND_API_CLIENT.md** - Frontend/integration
5. **LARAVEL_PROJECT_STRUCTURE.md** - Code structure
6. **DATABASE_SCHEMA.md** - Database issues
7. **VSCODE_COPILOT_GUIDE.md** - Development help

## 🎓 Learning Resources

### Frontend
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

### Backend
- Laravel: https://laravel.com/docs
- JWT Auth: https://github.com/tymondesigns/jwt-auth
- PHP: https://www.php.net/docs.php
- REST API Design: https://restfulapi.net

### Tools
- VSCode: https://code.visualstudio.com/docs
- Postman: https://learning.postman.com
- Git: https://git-scm.com/doc

## 📝 Version Info

- **Frontend**: Next.js 16, React 19, TypeScript 5
- **Backend**: Laravel 11, PHP 8.2+
- **Database**: MySQL 8.0+ or SQLite
- **API Version**: v1

## 🚀 You're Ready!

Everything is documented. Follow QUICK_START.md and use VSCode Copilot to build the backend and connect it to the frontend.

**Happy coding!** 🎉

---

Last Updated: January 2024
