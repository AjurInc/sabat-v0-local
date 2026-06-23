# Database Schema Reference

## Overview
This document defines the complete database schema for SABAT backend. All tables use Laravel conventions with proper relationships and timestamps.

## Tables

### 1. Users Table

**Purpose**: Store user account information

**SQL**:
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_completed BOOLEAN DEFAULT FALSE,
    preferences JSON NULLABLE,
    email_verified_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

**Laravel Migration**:
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('phone')->nullable();
    $table->boolean('profile_completed')->default(false);
    $table->json('preferences')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->softDeletes();
    $table->timestamps();
    $table->index('email');
    $table->index('created_at');
});
```

**Columns**:
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGINT | No | Primary key |
| name | VARCHAR(255) | No | User full name |
| email | VARCHAR(255) | No | Unique email address |
| password | VARCHAR(255) | No | Hashed password (bcrypt) |
| phone | VARCHAR(20) | Yes | Phone number |
| profile_completed | BOOLEAN | No | Has user completed profile? |
| preferences | JSON | Yes | User preferences (language, currency, notifications) |
| email_verified_at | TIMESTAMP | Yes | When email was verified |
| deleted_at | TIMESTAMP | Yes | Soft delete timestamp |
| created_at | TIMESTAMP | No | Account creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Example JSON in preferences**:
```json
{
  "language": "en",
  "currency": "USD",
  "notifications": true,
  "theme": "dark",
  "timezone": "UTC"
}
```

**Model Methods**:
```php
// Get user's auth codes
$user->authCodes(); // hasMany

// Get user's access tokens
$user->accessTokens(); // hasMany

// Check if email verified
$user->hasVerifiedEmail(); // boolean

// Mark email as verified
$user->markEmailAsVerified();

// Generate verification code
$user->generateAuthCode($type = 'signup');

// Get active auth code
$user->getActiveAuthCode($type = 'signup');

// Get current JWT token
$user->getCurrentToken();
```

---

### 2. Auth Codes Table

**Purpose**: Store temporary verification codes for signup/signin

**SQL**:
```sql
CREATE TABLE auth_codes (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(6) NOT NULL,
    type ENUM('signup', 'signin') DEFAULT 'signup',
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    UNIQUE KEY unique_user_type (user_id, type, verified_at)
);
```

**Laravel Migration**:
```php
Schema::create('auth_codes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('code', 6);
    $table->enum('type', ['signup', 'signin'])->default('signup');
    $table->timestamp('expires_at');
    $table->timestamp('verified_at')->nullable();
    $table->timestamp('created_at');
    $table->index(['user_id', 'expires_at']);
    $table->unique(['user_id', 'type', 'verified_at']);
});
```

**Columns**:
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGINT | No | Primary key |
| user_id | BIGINT | No | Foreign key to users |
| code | VARCHAR(6) | No | 6-digit verification code |
| type | ENUM | No | 'signup' or 'signin' |
| expires_at | TIMESTAMP | No | When code expires (10 min) |
| verified_at | TIMESTAMP | Yes | When user verified code |
| created_at | TIMESTAMP | No | When code was generated |

**Lifecycle**:
1. Code generated on signup/signin
2. Stored with `verified_at = null`
3. Expires after 10 minutes
4. User verifies within 10 minutes
5. Set `verified_at` on successful verification
6. Cannot be reused after verified
7. Cleanup: Delete verified codes older than 30 days

**Model Methods**:
```php
// Check if code valid
$authCode->isValid(); // not expired and not verified

// Check if expired
$authCode->isExpired();

// Mark as verified
$authCode->markAsVerified();

// Get related user
$authCode->user(); // belongsTo

// Scope: only unverified codes
AuthCode::unverified();

// Scope: only expired codes
AuthCode::expired();

// Generate new code
AuthCode::generate($userId, $type = 'signup');
```

---

### 3. Access Tokens Table

**Purpose**: Track issued JWT tokens for security and revocation

**SQL**:
```sql
CREATE TABLE access_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_revoked (revoked)
);
```

**Laravel Migration**:
```php
Schema::create('access_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('token_hash')->unique();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->boolean('revoked')->default(false);
    $table->timestamp('expires_at');
    $table->timestamp('created_at');
    $table->index(['user_id', 'revoked']);
});
```

**Columns**:
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGINT | No | Primary key |
| user_id | BIGINT | No | Foreign key to users |
| token_hash | VARCHAR(255) | No | Hash of JWT (for tracking) |
| ip_address | VARCHAR(45) | Yes | Request IP address |
| user_agent | TEXT | Yes | Browser/app user agent |
| revoked | BOOLEAN | No | Is token revoked? |
| expires_at | TIMESTAMP | No | Token expiration time |
| created_at | TIMESTAMP | No | When token issued |

**Token Lifecycle**:
1. User verifies code successfully
2. Generate JWT token with user ID claim
3. Calculate expiration (1 hour from now)
4. Hash token and store in table
5. Return token to frontend
6. Token stored in httpOnly cookie
7. On logout: Set `revoked = true`
8. Cleanup: Delete revoked/expired tokens older than 7 days

**Model Methods**:
```php
// Get related user
$token->user(); // belongsTo

// Revoke token
$token->revoke();

// Check if valid
$token->isValid(); // not revoked and not expired

// Scope: active tokens
AccessToken::active();

// Scope: expired tokens
AccessToken::expired();

// Create new token
AccessToken::create($user, $token, $request);
```

---

### 4. Audit Logs Table (Optional but Recommended)

**Purpose**: Track sensitive user actions for security

**SQL**:
```sql
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255),
    resource_id BIGINT UNSIGNED,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);
```

**Log Actions**:
- `user.created` - New user registered
- `user.verified` - Email verified
- `user.logged_in` - User signed in
- `user.logged_out` - User logged out
- `user.profile_updated` - Profile changed
- `user.password_changed` - Password updated
- `user.deleted` - Account deleted

---

## Relationships Diagram

```
┌─────────────────────┐
│      Users          │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password            │
│ profile_completed   │
│ email_verified_at   │
│ preferences (JSON)  │
└─────────┬─────────┬─┘
          │         │
    ┌─────▼─┐   ┌──▼──────────┐
    │       │   │             │
    │   hasMany hasMany        │
    │       │   │             │
    ▼       ▼   ▼             ▼
┌──────────────────┐   ┌──────────────────┐
│  Auth Codes      │   │ Access Tokens    │
├──────────────────┤   ├──────────────────┤
│ id (PK)          │   │ id (PK)          │
│ user_id (FK)     │   │ user_id (FK)     │
│ code (6-digit)   │   │ token_hash       │
│ type             │   │ ip_address       │
│ expires_at       │   │ user_agent       │
│ verified_at      │   │ revoked          │
│ created_at       │   │ expires_at       │
└──────────────────┘   └──────────────────┘
```

## Query Examples

### Get unverified users
```php
// Find users who haven't verified email
$unverified = User::whereNull('email_verified_at')->get();

// Get users with active auth codes
$withPendingVerification = User::whereHas('authCodes', function ($q) {
    $q->whereNull('verified_at')->where('expires_at', '>', now());
})->get();
```

### Get user's login history
```php
// Last 10 logins
$user->accessTokens()
    ->where('revoked', false)
    ->latest()
    ->take(10)
    ->get();
```

### Find expired tokens
```php
// Clean up expired tokens
AccessToken::where('expires_at', '<', now())
    ->where('revoked', false)
    ->forceDelete();
```

### Get current active token
```php
// Get user's current valid token
$token = $user->accessTokens()
    ->where('revoked', false)
    ->where('expires_at', '>', now())
    ->latest()
    ->first();
```

## Indexes Strategy

**Indexes Created**:
- `users.email` - Fast email lookups for signin
- `users.created_at` - Sort by creation time
- `auth_codes.user_id` - Lookup codes by user
- `auth_codes.expires_at` - Find expired codes for cleanup
- `access_tokens.user_id` - Find tokens by user
- `access_tokens.revoked` - Filter active/revoked tokens

**Why These Indexes**:
- Email is queried on every signin
- Foreign keys are always indexed for joins
- Timestamp fields indexed for sorting and cleanup queries
- Commonly filtered columns (revoked, verified_at) indexed

## Data Retention Policies

| Table | Keep | Delete After |
|-------|------|--------------|
| users | Forever | On soft delete, hard delete after 30 days |
| auth_codes | Verified for 30 days | Unverified after expiry, all after 30 days |
| access_tokens | Active | Revoked/expired after 30 days |
| audit_logs | Forever | Optionally archive after 1 year |

## Backup Strategy

**Critical Tables** (always backup):
- users (contains accounts)
- auth_codes (needed for verification)
- access_tokens (needed for active sessions)

**Backup Frequency**:
- Daily backups (automated)
- Weekly full backups (kept 1 month)
- Monthly full backups (kept 1 year)

**Restore Testing**:
- Monthly restore tests from backup
- Document restore procedures

## Security Considerations

1. **Password Hashing**: Always hash with bcrypt (Laravel default)
2. **Token Storage**: Hash tokens in database, never store plaintext
3. **Email Verification**: Required for account activation
4. **Code Expiration**: Codes expire after 10 minutes
5. **Rate Limiting**: Max 3 code resends per 15 minutes
6. **Token Revocation**: Logout revokes tokens immediately
7. **Soft Deletes**: Keep historical data for compliance

## Performance Tips

1. Query with relationships: `User::with('accessTokens')`
2. Use pagination for lists: `->paginate(20)`
3. Cache frequently accessed data
4. Use `select()` to limit columns: `->select(['id', 'email'])`
5. Monitor slow queries with Laravel Debugbar
6. Analyze query performance with EXPLAIN
