# SABAT API Specification v1

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All authenticated endpoints require JWT token in header:
```
Authorization: Bearer {token}
```

## Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {},
  "status_code": 200,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Too Many Requests (Rate Limited)
- `500`: Server Error

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

**Validation**:
- `name`: required, string, 2-255 chars, only letters/spaces
- `email`: required, valid email, unique in database
- `password`: required, min 8 chars, uppercase, number, special char
- `password_confirmation`: must match password

**Response** (201):
```json
{
  "success": true,
  "message": "Account created. Verification code sent.",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "verification_code": "123456",
    "expires_at": "2024-01-01T00:10:00Z",
    "expires_in_seconds": 600
  }
}
```

**Error Response** (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email has already been taken"],
    "password": ["Password must contain uppercase letter"]
  }
}
```

---

### 2. Verify Code (Signup)
**POST** `/auth/verify-code`

**Body**:
```json
{
  "user_id": 1,
  "verification_code": "123456"
}
```

**Validation**:
- `user_id`: required, exists in users table, not verified
- `verification_code`: required, 6 digits, matches stored code, not expired
- `type`: optional, defaults to 'signup', can be 'signin'

**Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Cases**:
- `400`: Code expired or invalid
- `422`: Validation failed
- `404`: User not found

---

### 3. Sign In
**POST** `/auth/signin`

**Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation**:
- `email`: required, valid email format
- `password`: required, non-empty

**Response** (200):
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "verification_code": "654321",
    "expires_at": "2024-01-01T00:10:00Z",
    "expires_in_seconds": 600,
    "requires_verification": true
  }
}
```

**Error Cases**:
- `401`: Invalid credentials
- `422`: Email not found
- `404`: User not verified (signup first)

---

### 4. Resend Verification Code
**POST** `/auth/resend-code`

**Headers**:
```
Authorization: Bearer {token}
```

**Body**:
```json
{
  "user_id": 1
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Verification code resent",
  "data": {
    "verification_code": "789012",
    "expires_at": "2024-01-01T00:15:00Z",
    "expires_in_seconds": 600
  }
}
```

**Limits**:
- Max 3 resends per 15 minutes
- Returns 429 if limit exceeded

---

### 5. Logout
**POST** `/auth/logout`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Notes**:
- Revokes current token
- User must log in again to use API
- Removes refresh token

---

### 6. Refresh Token
**POST** `/auth/refresh`

**Headers**:
```
Authorization: Bearer {refresh_token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Error Cases**:
- `401`: Token invalid or expired
- `401`: Refresh token revoked

---

## User Endpoints

### 7. Get Current User
**GET** `/user/profile`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profile_completed": true,
    "preferences": {
      "language": "en",
      "currency": "USD",
      "notifications": true
    },
    "email_verified_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 8. Update Profile
**PUT** `/user/profile`

**Headers**:
```
Authorization: Bearer {token}
```

**Body**:
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "preferences": {
    "language": "fa",
    "currency": "IRR",
    "notifications": true
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "phone": "+1234567890",
    "preferences": {
      "language": "fa",
      "currency": "IRR",
      "notifications": true
    }
  }
}
```

---

### 9. Change Password
**POST** `/user/change-password`

**Headers**:
```
Authorization: Bearer {token}
```

**Body**:
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!",
  "new_password_confirmation": "NewPass456!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Cases**:
- `400`: Current password incorrect
- `422`: Validation failed

---

## Status Codes & Meanings

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET /user/profile |
| 201 | Created | POST /auth/signup |
| 204 | No Content | Deleted successfully |
| 400 | Bad Request | Invalid code format |
| 401 | Unauthorized | Invalid token or expired |
| 403 | Forbidden | No permission to resource |
| 404 | Not Found | User doesn't exist |
| 422 | Validation Error | Invalid email format |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Database connection failed |

---

## Rate Limiting

Headers returned on every response:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067200
```

Limits per endpoint group:
- Authentication: 5 requests/minute per IP
- User endpoints: 60 requests/minute per user
- General: 30 requests/minute per IP

---

## Pagination

List endpoints support pagination:
```
GET /users?page=1&per_page=20&sort=-created_at
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `sort`: Sort field with direction (default: -created_at)
  - Prefix `-` for descending
  - Prefix `+` or no prefix for ascending

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "email": "user@example.com" }
  ],
  "pagination": {
    "total": 150,
    "per_page": 20,
    "current_page": 1,
    "last_page": 8,
    "from": 1,
    "to": 20
  }
}
```

---

## Webhook Events (Future)

Webhooks will be sent to configured URL:
- `user.created`: New user registered
- `user.verified`: Email verified
- `user.password_changed`: Password updated
- `user.deleted`: Account deleted

## API Versioning

Current version: **v1** (in URL: `/api/v1`)

Future versions will use `/api/v2`, `/api/v3`, etc.
No breaking changes to v1 without deprecation notice.
