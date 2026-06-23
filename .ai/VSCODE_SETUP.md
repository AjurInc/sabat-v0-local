# Setting Up VSCode for SABAT Development

## Step 1: Install VSCode Extensions

Go to Extensions (Ctrl+Shift+X) and install:

### Essential
- **GitHub Copilot** - AI-powered code completion
- **GitHub Copilot Chat** - Chat with Copilot

### Frontend Development
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatter
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript Vue Plugin** - TypeScript support

### Backend Development
- **PHP Intelephense** - PHP language server
- **Laravel Extension Pack** - Laravel support (by Herd)
- **Database Client** - SQL query viewer

### Productivity
- **Peacock** - Color code workspaces
- **GitLens** - Git integration
- **Thunder Client** - API testing (alternative to Postman)
- **REST Client** - Make HTTP requests from editor

## Step 2: Create Workspace Settings

Create `.vscode/settings.json` in project root:

```json
{
  // Editor Settings
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.trimAutoWhitespace": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // Language-specific
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[php]": {
    "editor.defaultFormatter": "intelephense"
  },

  // TypeScript
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsdk": "node_modules/typescript/lib",

  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // Search Exclusions
  "search.exclude": {
    "**/node_modules": true,
    "**/vendor": true,
    "**/.next": true,
    "**/storage/logs": true,
    "**/dist": true
  },

  // File Exclusions
  "files.exclude": {
    "**/.DS_Store": true,
    "**/.git": false
  },

  // Terminal
  "terminal.integrated.shellArgs.windows": ["-NoExit", "-Command", "cd $env:USERPROFILE"],

  // Git
  "git.ignoreLimitWarning": true,

  // Prettier Config
  "prettier.proseWrap": "always",
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5"
}
```

## Step 3: Create Workspace File

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "heybourn.heybourn-php-intelephense-client",
    "onecentlin.laravel-extension-pack",
    "rangav.vscode-thunder-client",
    "humao.rest-client",
    "eamodio.gitlens",
    "johnpapa.peacock"
  ]
}
```

## Step 4: Create Keyboard Shortcuts

Create `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+l",
    "command": "github.copilot.forceRefresh",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+i",
    "command": "editor.action.formatDocument",
    "when": "editorTextFocus && editorLangId != php"
  },
  {
    "key": "alt+shift+f",
    "command": "editor.action.formatDocument"
  }
]
```

## Step 5: Configure Copilot

### In VSCode Settings (Ctrl+,)

Search for "Copilot" and set:
- `Copilot: Enable` - Enable
- `Copilot: Autocomplete References` - Enable
- `Copilot: Inline Suggest: Count` - 3
- `Copilot Chat: Editor Context` - Full

### Keyboard Shortcuts for Copilot
- `Ctrl+I` - Copilot Chat (inline)
- `Ctrl+Shift+I` - Copilot Chat (side panel)
- `Alt+\` - Toggle Copilot

## Step 6: Set Up Workspace Folders

If working with both frontend and backend:

Create `.vscode/workspace-settings.json`:

```json
{
  "folders": [
    {
      "path": ".",
      "name": "Frontend (Next.js)"
    },
    {
      "path": "../sabat-backend",
      "name": "Backend (Laravel)"
    }
  ],
  "settings": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Then open workspace:
1. File → Open Workspace from File
2. Select `.vscode/workspace-settings.json`

## Step 7: Create Run/Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Frontend Dev Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Backend Dev Server",
      "type": "php",
      "request": "launch",
      "program": "${workspaceFolder}/../sabat-backend/artisan",
      "args": ["serve"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Step 8: Create Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Frontend: Dev Server",
      "type": "shell",
      "command": "pnpm",
      "args": ["dev"],
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^.*error.*",
          "file": 1,
          "line": 2,
          "column": 3,
          "message": 4
        }
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "Backend: Dev Server",
      "type": "shell",
      "command": "php",
      "args": ["artisan", "serve"],
      "isBackground": true,
      "options": {
        "cwd": "${workspaceFolder}/../sabat-backend"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "Run Both Servers",
      "dependsOn": ["Frontend: Dev Server", "Backend: Dev Server"],
      "problemMatcher": []
    }
  ]
}
```

## Step 9: Install Node/PHP Versions

### For Frontend Development
```bash
# Check Node version
node --version  # Should be 18+ or 20+

# Install NVM (Node Version Manager) if needed
# https://github.com/nvm-sh/nvm
```

### For Backend Development
```bash
# Check PHP version
php --version  # Should be 8.2+

# Install PHP (macOS with Homebrew)
brew install php@8.2

# Install PHP (Ubuntu/Debian)
sudo apt install php8.2 php8.2-cli php8.2-mysql php8.2-sqlite3
```

## Step 10: Configure REST Client Extension

Create `.vscode/requests.http` for testing API:

```http
### Variables
@baseUrl = http://localhost:8000/api/v1
@email = test@example.com
@password = TestPass123!

### Signup
POST {{baseUrl}}/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "{{email}}",
  "password": "{{password}}",
  "password_confirmation": "{{password}}"
}

### Get verification code from response, then test verify

### Verify Code
POST {{baseUrl}}/auth/verify-code
Content-Type: application/json

{
  "user_id": 1,
  "verification_code": "123456"
}

### Get User Profile (requires token from verify response)
@token = Bearer eyJ0eXAiOiJKV1QiLC...

GET {{baseUrl}}/user/profile
Authorization: {{token}}
```

Then use in REST Client:
- Click "Send Request" above each request
- View response below

## Step 11: Terminal Configuration

### Add Multiple Terminals

Create shortcuts or use VSCode terminal:

**Terminal 1: Frontend**
```bash
cd /path/to/sabat-frontend
pnpm dev
```

**Terminal 2: Backend**
```bash
cd /path/to/sabat-backend
php artisan serve
```

**Terminal 3: Logs (Optional)**
```bash
tail -f storage/logs/laravel.log
```

## Step 12: Theme & UI Customization

### Recommended Theme
- Install: "One Dark Pro" or "Dracula"
- VSCode settings:
  ```json
  {
    "workbench.colorTheme": "One Dark Pro",
    "workbench.iconTheme": "One Dark Pro Icons"
  }
  ```

### Font Recommendation
```json
{
  "editor.fontFamily": "'Fira Code', 'Consolas', monospace",
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": true
}
```

## Step 13: Copilot Best Practices

### Before Asking Copilot

1. **Set Context**
   - Have the relevant .ai/ docs open in VSCode
   - Reference specific documentation in your question
   - Include file paths and framework details

2. **Ask in Chat Panel**
   - Ctrl+Shift+I opens Copilot Chat side panel
   - Better for complex questions
   - Can reference code and files

3. **Use Inline Copilot**
   - Ctrl+I for quick suggestions
   - Write partial code, Copilot completes
   - Great for method stubs

### Good Prompts Examples

```
"I'm in lib/api/client.ts. Create an Axios interceptor 
that adds JWT token from Zustand store to every request, 
following the pattern in FRONTEND_API_CLIENT.md"

"Generate a Laravel controller method for user signup 
validation following the rules in API_SPECIFICATION.md 
and patterns in LARAVEL_PROJECT_STRUCTURE.md"

"Create a database migration for the auth_codes table 
as specified in DATABASE_SCHEMA.md"
```

### Copilot Keyboard Shortcuts
- `Ctrl+I` - Inline chat
- `Ctrl+Shift+I` - Side panel chat
- `Alt+\` - Toggle completions
- `Tab` - Accept suggestion
- `Esc` - Dismiss

## Step 14: Debugging

### Frontend Debugging
```json
{
  "name": "Next.js Client",
  "type": "pwa-chrome",
  "request": "launch",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/.next"
}
```

### Backend Debugging
```bash
# Add to .env
XDEBUG_MODE=debug
XDEBUG_CONFIG="client_host=127.0.0.1 client_port=9003"

# Then in VSCode, use the Browser debugger in Debug panel
```

## Step 15: Final Checklist

- [ ] Installed all recommended extensions
- [ ] Created `.vscode/settings.json`
- [ ] Created `.vscode/extensions.json`
- [ ] Tested Copilot with Ctrl+I
- [ ] Opened both frontend and backend folders
- [ ] Started dev servers in terminals
- [ ] Tested REST Client with API requests
- [ ] Verified code formatting works (Shift+Alt+F)
- [ ] Tested debugger (F5)
- [ ] Reviewed `.ai/` documentation files

## Common VSCode Issues

### "Copilot not working"
- Install GitHub Copilot extension
- Sign in with GitHub account
- Check: Settings → Copilot → Enable

### "Prettier not formatting"
- Install Prettier extension
- Check: Default formatter = esbenp.prettier-vscode
- Check: Format on save = enabled

### "PHP errors not showing"
- Install PHP Intelephense
- Set workspace PHP version
- Restart VSCode

### "Terminal not working"
- Check shell type: Ctrl+Shift+P → "Terminal: Select Default Profile"
- Choose bash, zsh, or your shell

## Pro Tips

1. **Use Command Palette** (Ctrl+Shift+P) for everything
   - Search "Format Document"
   - Search "Terminal: Create New Terminal"
   - Search "Copilot: Reset Copilot"

2. **Bookmark Important Files**
   - .ai/README.md
   - .ai/VSCODE_COPILOT_GUIDE.md
   - lib/api/client.ts
   - store/auth.ts

3. **Use Breadcrumbs** (View → Breadcrumbs)
   - Shows file structure at top

4. **Minimap** (View → Appearance → Show Minimap)
   - Quick file overview on right

5. **Zen Mode** (Ctrl+K Z)
   - Distraction-free editing

## Useful Extensions Cheat Sheet

| Task | Extension | Shortcut |
|------|-----------|----------|
| Format Code | Prettier | Shift+Alt+F |
| Quick Fix | ESLint | Ctrl+. |
| Copilot Chat | GitHub Copilot | Ctrl+Shift+I |
| Multi-cursor | VSCode Built-in | Ctrl+D |
| Git Status | GitLens | Ctrl+Shift+G |
| HTTP Request | REST Client | Send Request |
| Command Palette | VSCode Built-in | Ctrl+Shift+P |

---

You're all set! Start by opening both projects and using Copilot to build the backend. Reference the .ai/ documentation frequently. Happy coding! 🚀
