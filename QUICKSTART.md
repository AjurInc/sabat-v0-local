# 🎯 START HERE - Run These Commands Now

## ⚡ Super Quick - Copy & Paste These

### **TERMINAL 1 - Backend (Required first!)**

```powershell
$env:Path += ";C:\xampp\php;C:\xampp\mysql\bin"; cd C:\Users\Asus\Desktop\mobile-header-fixes\backend; php artisan serve
```

Wait for output:
```
INFO  Server running on [http://127.0.0.1:8000].
```

---

### **TERMINAL 2 - Frontend (Open in NEW terminal)**

```powershell
cd C:\Users\Asus\Desktop\mobile-header-fixes; npm run dev
```

Wait for output:
```
✓ Ready in 2.5s
```

---

### **TERMINAL 3 - Testing (Open in NEW terminal)**

```powershell
# Set PATH
$env:Path += ";C:\xampp\php;C:\xampp\mysql\bin"

# Go to backend
cd C:\Users\Asus\Desktop\mobile-header-fixes\backend

# Create a test user
php artisan tinker
```

Then in Tinker prompt, copy this exactly:

```php
User::create(['name'=>'John Doe','email'=>'john@example.com','password'=>Hash::make('password123')])
```

Press Enter, should see:
```
=> Illuminate\Database\Eloquent\Model { ... }
```

Exit Tinker:
```php
exit
```

---

## 🌐 Open In Browser

| What | URL | What You'll See |
|------|-----|-----------------|
| **Frontend** | http://localhost:3000 | Your Next.js app with landing page |
| **Backend API** | http://localhost:8000/api | API endpoints |
| **Database** | http://localhost/phpmyadmin | phpMyAdmin - see database tables |

---

## ✅ Test Sign Up Flow

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Enter:
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Sign Up"
5. Check phpMyAdmin → `sabat_db` → `users` table to see the new user

---

## 📊 Verify Everything Works

### Check Backend DB Connection:

```powershell
# In Terminal 3 (backend folder)
php artisan tinker
User::count()    # Should return 1 (the user you created)
User::first()    # Shows the user details
exit
```

### Check Database:

```powershell
$env:Path += ";C:\xampp\mysql\bin"
mysql -u root sabat_db -e "SELECT id, name, email FROM users;"
```

Should output:
```
+----+----------+---------------------+
| id | name     | email               |
+----+----------+---------------------+
| 1  | John Doe | john@example.com    |
+----+----------+---------------------+
```

---

## 🎮 API Testing with Postman

1. Download Postman: https://www.postman.com/downloads/

2. Create POST request:
   - **URL:** `http://localhost:8000/api/v1/auth/signin`
   - **Body (JSON):**
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. Send request → Should get JWT token ✅

---

## ⚠️ Important

- MySQL must be running before starting backend
- Start Terminal 1 (Backend) FIRST
- Start Terminal 2 (Frontend) SECOND
- All 3 must be running together for full testing

---

## 🚨 If Something Goes Wrong

### Backend won't start:
```powershell
php --version    # Check PHP path is correct
# If error: $env:Path += ";C:\xampp\php"

php artisan config:clear
php artisan cache:clear
php artisan serve
```

### Frontend shows errors:
```powershell
cd C:\Users\Asus\Desktop\mobile-header-fixes
npm install --legacy-peer-deps
npm run dev
```

### Database won't connect:
```powershell
# Start MySQL
C:\xampp\mysql_start.bat

# Test connection
$env:Path += ";C:\xampp\mysql\bin"
mysql -u root -e "SELECT 1"
```

### Can't create user:
```powershell
# Check tinker
php artisan tinker
User::all()     # See all users
User::count()   # Count users
```

---

## 📚 Full Guides

Need more detail? Read:
- `LOCAL_TESTING_GUIDE.md` - Comprehensive testing guide
- `CPANEL_DEPLOYMENT_GUIDE.md` - How to deploy when ready
- `.ai/API_SPECIFICATION.md` - All API endpoints

---

**You're ready to go! Start Terminal 1 first! 🚀**
