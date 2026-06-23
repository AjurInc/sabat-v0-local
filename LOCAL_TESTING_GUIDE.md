# 🚀 How to Run Your Full-Stack Project Locally

## ⚙️ Prerequisites Check

Before starting, ensure:
- ✅ XAMPP MySQL running
- ✅ Backend folder exists: `C:\Users\Asus\Desktop\mobile-header-fixes\backend`
- ✅ Frontend files exist (package.json in root)
- ✅ Dependencies installed (npm install done)

---

## 📝 Step-by-Step: Starting Everything

### **STEP 1: Start XAMPP MySQL** (if not already running)

```powershell
C:\xampp\mysql_start.bat
```

Wait for: `"MySQL is running"`

---

### **STEP 2: Open 3 Terminal Windows**

You'll need 3 separate terminals open at the same time:
- Terminal 1: Backend server
- Terminal 2: Frontend dev server
- Terminal 3: Testing/database access

---

### **STEP 3: Start Backend (Terminal 1)**

```powershell
# Set PATH to use XAMPP PHP
$env:Path += ";C:\xampp\php;C:\xampp\mysql\bin"

# Navigate to backend
cd C:\Users\Asus\Desktop\mobile-header-fixes\backend

# Start Laravel server
php artisan serve
```

**Expected output:**
```
INFO  Server running on [http://127.0.0.1:8000].
Press Ctrl+C to stop the server
```

✅ **Backend API is now at:** `http://localhost:8000/api`

---

### **STEP 4: Start Frontend (Terminal 2)**

```powershell
# Navigate to project root
cd C:\Users\Asus\Desktop\mobile-header-fixes

# Start Next.js dev server
npm run dev
```

**Expected output:**
```
> next dev
  ▲ Next.js 16.x.x
  - Local: http://localhost:3000
```

✅ **Frontend is now at:** `http://localhost:3000`

---

## 🗄️ Access Your Database

### **Option 1: Using phpMyAdmin (Easiest)**

1. Open browser: `http://localhost/phpmyadmin`
2. **Login:**
   - Username: `root`
   - Password: (leave blank)
   - Click "Go"

3. **Find your database:**
   - Left panel → `sabat_db`
   - See all tables (users, jobs, cache, personal_access_tokens)

### **Option 2: Using Terminal**

```powershell
$env:Path += ";C:\xampp\mysql\bin"

# Connect to MySQL
mysql -u root

# In MySQL prompt:
USE sabat_db;
SHOW TABLES;
SELECT * FROM users;
EXIT;
```

---

## 🧪 Test the Backend & Create a User

### **Method 1: Using Tinker (Laravel Interactive Shell)**

```powershell
# In Terminal 1 (backend folder), stop the server (Ctrl+C)
# Then run:
php artisan tinker

# In Tinker prompt, create a user:
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => Hash::make('password123')
]);

# Verify user was created:
User::all();

# Exit Tinker:
exit
```

**Expected output:**
```
=> Illuminate\Database\Eloquent\Collection {#5240
     all: [
       Illuminate\Database\Eloquent\Model {#5239
         id: 1,
         name: "Test User",
         email: "test@example.com",
         ...
       }
     ]
   }
```

### **Method 2: Using Postman (Recommended for API testing)**

1. **Download Postman:** https://www.postman.com/downloads/

2. **Create a new request:**
   - Method: `POST`
   - URL: `http://localhost:8000/api/v1/auth/signup`
   - Body (JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "password_confirmation": "password123"
   }
   ```

3. **Send and check response**

---

## 🔗 Test Frontend + Backend Integration

### **Step 1: Start All Services**
- ✅ MySQL running
- ✅ Backend running: `http://localhost:8000`
- ✅ Frontend running: `http://localhost:3000`

### **Step 2: Open Frontend in Browser**
```
http://localhost:3000
```

### **Step 3: Try Sign Up**
1. Click "Sign Up" button
2. Enter test data:
   - Email: `test@example.com`
   - Password: `test123456`
3. Click "Sign Up"

### **Step 4: Check Results**

**If successful:**
- User created in database
- Get JWT token in response
- Frontend stores token
- Can access dashboard

**If errors:**
- Check browser console (F12 → Console tab)
- Check backend terminal for errors
- Check database in phpMyAdmin

---

## 📊 Check What's in Your Database

### In phpMyAdmin:

1. Go to `http://localhost/phpmyadmin`
2. Left panel → `sabat_db`
3. Click each table:
   - **users** - Your user accounts
   - **personal_access_tokens** - JWT tokens
   - **jobs** - Background jobs queue
   - **cache** - Cache entries

---

## 🔍 Verify Everything is Connected

### Check Backend is Responding:

```powershell
# In Terminal 3, test API
curl http://localhost:8000/api/health
# Or in browser: http://localhost:8000/api/health
```

### Check Database Connection:

In backend terminal, run:
```powershell
php artisan tinker
DB::connection()->getPdo();
exit
```

If no errors, database is connected ✅

### Check Frontend Can Reach Backend:

In browser console (F12):
```javascript
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 📋 Quick Reference Commands

### Backend Control

```powershell
# Navigate to backend
cd C:\Users\Asus\Desktop\mobile-header-fixes\backend

# Start server
php artisan serve

# Open interactive shell
php artisan tinker

# Create a test user (in tinker)
User::create(['name'=>'Test','email'=>'test@test.com','password'=>Hash::make('pass')])

# Check database
php artisan tinker
DB::table('users')->get()
exit

# Clear cache
php artisan cache:clear
php artisan config:clear

# Stop server
# Press Ctrl+C in the terminal
```

### Frontend Control

```powershell
# Navigate to root
cd C:\Users\Asus\Desktop\mobile-header-fixes

# Start dev server
npm run dev

# Stop server
# Press Ctrl+C in the terminal

# Install dependencies
npm install --legacy-peer-deps

# Build for production
npm run build
```

### Database Control

```powershell
# Set MySQL path
$env:Path += ";C:\xampp\mysql\bin"

# Connect to MySQL
mysql -u root

# In MySQL:
USE sabat_db;
SHOW TABLES;
SELECT * FROM users;
EXIT;

# Backup database
mysqldump -u root sabat_db > backup.sql

# Restore database
mysql -u root sabat_db < backup.sql
```

---

## ⚠️ Troubleshooting

### Backend won't start

```powershell
# Check PHP path is set
php --version

# If not found, run:
$env:Path += ";C:\xampp\php"
php --version

# Then try:
php artisan serve
```

### Cannot connect to database

```powershell
# Check MySQL is running
mysql -u root
# If error, start MySQL:
C:\xampp\mysql_start.bat

# Check database exists
mysql -u root -e "SHOW DATABASES;"

# Check credentials in backend/.env
# Should be:
DB_HOST=127.0.0.1
DB_DATABASE=sabat_db
DB_USERNAME=root
DB_PASSWORD=
```

### Frontend shows blank page

```powershell
# Check Node version
node --version    # Should be 18+

# Clear Next.js cache
rm -r .next
npm run dev
```

### API calls failing

```powershell
# Check backend is running (Terminal 1)
# Check frontend is running (Terminal 2)
# Check MySQL is running
# Check browser console for errors (F12)
# Check backend terminal for error logs
```

---

## ✅ Success Indicators

You know everything is working when:

- ✅ Backend terminal shows: `Server running on [http://127.0.0.1:8000]`
- ✅ Frontend terminal shows: `- Local: http://localhost:3000`
- ✅ Can open `http://localhost:3000` in browser
- ✅ Can open `http://localhost:8000/api` in browser
- ✅ Can see database tables in phpMyAdmin
- ✅ Can create users via Tinker or API
- ✅ Can see new users in database
- ✅ Frontend API calls don't show CORS errors
- ✅ Can sign up and see token in response

---

## 🎯 Next: Deploy to cPanel

When ready to go live:
1. Follow `CPANEL_DEPLOYMENT_GUIDE.md`
2. Upload everything to cPanel
3. Configure database on cPanel
4. Update API URL in frontend `.env`

---

**Happy testing!** 🎉
