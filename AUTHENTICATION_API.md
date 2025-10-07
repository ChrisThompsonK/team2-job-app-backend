# Authentication API Documentation

## Overview
This backend provides a complete user authentication system with session management, password hashing, and CORS support for frontend integration.

## Base URL
```
http://localhost:8080
```

## Authentication Endpoints

### POST /api/auth/login
Authenticate a user with email and password.

**Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@kainos.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "admin@kainos.com",
  "isAdmin": true
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response (429) - Rate Limited:**
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again later."
}
```

**Notes:**
- Creates a session cookie that will be sent with subsequent requests
- Rate limited to 5 attempts per minute per IP address
- Email is case-insensitive

---

### POST /api/auth/logout
Clear the user's session and log them out.

**Request:**
```json
POST /api/auth/logout
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Notes:**
- Destroys the server-side session
- Session cookie will be invalidated

---

### GET /api/auth/me
Get the currently authenticated user's information.

**Request:**
```
GET /api/auth/me
```

**Success Response (200) - When Authenticated:**
```json
{
  "id": 1,
  "email": "admin@kainos.com",
  "isAdmin": true
}
```

**Error Response (401) - When Not Authenticated:**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

**Notes:**
- Requires valid session cookie from login
- Use this endpoint to check authentication status

---

## Test Users

Two test users are seeded in the database:

### Admin User
- **Email:** `admin@kainos.com`
- **Password:** `admin123`
- **Admin:** `true`

### Regular User
- **Email:** `user@kainos.com`
- **Password:** `user123`
- **Admin:** `false`

---

## CORS Configuration

The backend is configured to accept requests from:
- **Origin:** `http://localhost:3000`
- **Credentials:** Enabled
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

---

## Session Management

**Session Configuration:**
- **Store:** SQLite (`sessions.sqlite`)
- **Duration:** 24 hours
- **Cookie Settings:**
  - `httpOnly`: true (prevents XSS attacks)
  - `secure`: false (set to true in production with HTTPS)
  - `sameSite`: 'lax'

---

## Security Features

### Password Hashing
- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- Passwords are never stored in plain text

### Rate Limiting
- **Max Attempts:** 5 per minute per IP
- **Window:** 60 seconds
- Applies to login endpoint only

### SQL Injection Prevention
- Uses parameterized queries via Drizzle ORM
- All user input is sanitized

### Input Validation
- Email and password are required fields
- Email format validation
- Case-insensitive email lookup

---

## Testing the API

### Using cURL

**1. Login and Save Session:**
```bash
curl -c cookies.txt -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kainos.com","password":"admin123"}'
```

**2. Get Current User (with session):**
```bash
curl -b cookies.txt http://localhost:8080/api/auth/me
```

**3. Logout:**
```bash
curl -b cookies.txt -X POST http://localhost:8080/api/auth/logout
```

**4. Verify Logout:**
```bash
curl -b cookies.txt http://localhost:8080/api/auth/me
# Should return: {"success":false,"message":"Not authenticated"}
```

### Using JavaScript (Frontend)

```javascript
// Login
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: includes cookies
  body: JSON.stringify({
    email: 'admin@kainos.com',
    password: 'admin123',
  }),
});

const user = await loginResponse.json();
console.log(user); // { id: 1, email: "admin@kainos.com", isAdmin: true }

// Get current user
const meResponse = await fetch('http://localhost:8080/api/auth/me', {
  credentials: 'include', // Important: includes cookies
});

const currentUser = await meResponse.json();

// Logout
const logoutResponse = await fetch('http://localhost:8080/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

const result = await logoutResponse.json();
console.log(result); // { success: true, message: "Logout successful" }
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing required fields |
| 401 | Unauthorized - Invalid credentials or not authenticated |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Environment Variables

Configure these in your `.env` file:

```bash
# Session secret (change in production!)
SESSION_SECRET=your-secret-key-change-in-production

# Server port
PORT=8080

# Database
DATABASE_URL=./database.sqlite

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Database Schema

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| email | TEXT | UNIQUE, NOT NULL | User's email address (lowercase) |
| password | TEXT | NOT NULL | bcrypt hashed password |
| is_admin | BOOLEAN | NOT NULL, DEFAULT false | Admin flag |
| created_at | TIMESTAMP | NOT NULL | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

---

## Integration Checklist

- [x] Database created with users table
- [x] Two test users inserted with hashed passwords
- [x] POST /api/auth/login endpoint working
- [x] POST /api/auth/logout endpoint working
- [x] GET /api/auth/me endpoint working
- [x] CORS configured to allow http://localhost:3000
- [x] Passwords hashed with bcrypt (10 salt rounds)
- [x] Error responses in correct format
- [x] Rate limiting implemented (5 attempts/minute)
- [x] Input validation working
- [x] Session management with SQLite store
- [x] httpOnly cookies configured
- [x] Session duration set to 24 hours

---

## Common Issues & Solutions

### CORS Errors
**Problem:** Frontend getting CORS errors  
**Solution:** 
- Ensure frontend is running on `http://localhost:3000`
- Check that `credentials: 'include'` is set in fetch requests
- Verify CORS origin is exactly `http://localhost:3000` (no trailing slash)

### Login Not Persisting
**Problem:** Session not persisting after login  
**Solution:**
- Ensure `credentials: 'include'` in all fetch requests
- Check that cookies are being saved (browser dev tools)
- Verify session store is working (check `sessions.sqlite` file)

### Authentication Fails
**Problem:** Valid credentials returning 401  
**Solution:**
- Check that database was seeded properly
- Verify email is lowercase in database
- Ensure bcrypt comparison is working

### Session Not Working
**Problem:** /me endpoint always returns "Not authenticated"  
**Solution:**
- Make sure cookies are sent with requests
- Check session cookie settings (sameSite, httpOnly)
- Verify session secret is set correctly

---

## Production Considerations

Before deploying to production:

1. **Change session secret:**
   ```bash
   SESSION_SECRET=<generate-strong-random-secret>
   ```

2. **Enable secure cookies:**
   ```typescript
   cookie: {
     secure: true, // Requires HTTPS
     httpOnly: true,
     sameSite: 'strict',
   }
   ```

3. **Update CORS origin:**
   ```typescript
   origin: process.env.FRONTEND_URL || 'https://yourdomain.com'
   ```

4. **Use Redis for sessions:**
   - Replace SQLite session store with Redis
   - Better performance and scalability

5. **Add more security:**
   - Implement CSRF protection
   - Add helmet.js for security headers
   - Use environment-specific rate limits
   - Add logging and monitoring

6. **Database:**
   - Migrate from SQLite to PostgreSQL/MySQL
   - Add database connection pooling
   - Implement proper backup strategy

---

## Support

For issues or questions:
1. Check server logs for errors
2. Verify frontend console for CORS/network issues
3. Test endpoints with cURL to isolate frontend/backend issues
4. Check database to verify user records exist

---

## Next Steps

Now that authentication is implemented, you can:

1. ✅ Test login with both user accounts
2. ✅ Verify session persistence after page refresh
3. ✅ Test protected routes (/job-roles)
4. ✅ Verify logout functionality
5. ✅ Check navigation updates based on auth state
6. ✅ Test admin badge appears for admin user
7. 🔜 Implement admin-only features:
   - Create new job posting (admin only)
   - Edit existing job (admin only)
   - Delete job posting (admin only)
