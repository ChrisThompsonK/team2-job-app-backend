# Login System Implementation Plan
## Focused on Core Authentication Requirements

### 🎯 Success Criteria
Based on your specific requirements, this plan focuses on:

1. ✅ **User must log in with email and password**
2. ✅ **User must be able to log out**
3. ✅ **If email and password match database record, generate a JWT token**
4. ✅ **JWT token should be stored in browser session**
5. ✅ **Password should be salted and hashed before comparing to database**

### 📋 Reference
Following best practices from: https://youtu.be/zt8Cocdy15c?si=u74kFMHTvILDY1P_

---

## 🗄️ Simplified Database Schema

### Users Table (Minimal)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'standard')) DEFAULT 'standard',
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
```

---

## 🏗️ Implementation Tasks (Broken Down)

### Task 1: Database Setup
**Estimated Time: 30 minutes**

#### 1.1 Install Database Dependencies
```bash
npm install drizzle-orm better-sqlite3 drizzle-kit
npm install -D @types/better-sqlite3
```

#### 1.2 Create Drizzle Configuration
- Create `drizzle.config.ts`
- Setup SQLite database connection

#### 1.3 Create Users Schema
- Create `src/db/schema/users.ts`
- Define minimal users table structure
- Generate initial migration with `npm run db:generate`
- Run migration with `npm run db:migrate`

**Success Check:** Database file created, users table exists

---

### Task 2: Password Security Setup
**Estimated Time: 45 minutes**

#### 2.1 Install Password Dependencies
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

#### 2.2 Create Password Utility
Create `src/utils/password.ts`:
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

#### 2.3 Test Password Hashing
- Create simple test to verify hashing works
- Ensure salted hash is generated correctly

**Success Check:** Password can be hashed and verified

---

### Task 3: JWT Token Management
**Estimated Time: 45 minutes**

#### 3.1 Install JWT Dependencies
```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

#### 3.2 Create JWT Utility
Create `src/utils/jwt.ts`:
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
const JWT_EXPIRES_IN = '24h';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
```

#### 3.3 Environment Setup
- Create `.env` file with `JWT_SECRET`
- Install dotenv: `npm install dotenv`

**Success Check:** JWT tokens can be generated and verified

---

### Task 4: User Registration Endpoint
**Estimated Time: 1 hour**

#### 4.1 Create Registration Route
Create `src/routes/auth.ts`:
```typescript
import express from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { hashPassword } from '../utils/password.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'standard'
    }).returning();
    
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

export default router;
```

#### 4.2 Basic Input Validation
- Check required fields
- Validate email format
- Check password length (minimum 6 characters)

**Success Check:** User can register with email/password, password is hashed in database

---

### Task 5: Login Endpoint (Core Requirement)
**Estimated Time: 1 hour**

#### 5.1 Create Login Route
Add to `src/routes/auth.ts`:
```typescript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user[0]) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user[0].passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user[0].id,
      email: user[0].email,
      role: user[0].role
    });
    
    // Return token and user info
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        role: user[0].role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
```

**Success Check:** 
- ✅ User can login with correct email/password
- ✅ Password is verified against salted hash
- ✅ JWT token is generated and returned

---

### Task 6: Logout Endpoint
**Estimated Time: 30 minutes**

#### 6.1 Create Logout Route
Add to `src/routes/auth.ts`:
```typescript
router.post('/logout', (req, res) => {
  // Since we're using stateless JWT, logout is handled client-side
  // Client should remove token from session storage
  res.json({ 
    message: 'Logout successful',
    instruction: 'Remove token from client session storage'
  });
});
```

#### 6.2 Client-Side Logout Instructions
Document how frontend should handle logout:
- Remove JWT token from sessionStorage/localStorage
- Clear any cached user data
- Redirect to login page

**Success Check:** ✅ Logout endpoint exists and provides clear instructions

---

### Task 7: Authentication Middleware
**Estimated Time: 45 minutes**

#### 7.1 Create Auth Middleware
Create `src/middleware/auth.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      redirectTo: '/login'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token.',
      redirectTo: '/login'
    });
  }
};
```

**Success Check:** Middleware validates JWT tokens correctly

---

### Task 8: Protected Route Example
**Estimated Time: 30 minutes**

#### 8.1 Create Protected Profile Route
Create `src/routes/profile.ts`:
```typescript
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected route - requires authentication
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user
  });
});

export default router;
```

**Success Check:** Protected routes require valid JWT token

---

### Task 9: Frontend Integration Guide
**Estimated Time: 30 minutes**

#### 9.1 Document Token Storage
Create `docs/frontend-integration.md`:
```markdown
# Frontend Integration

## Storing JWT Token in Browser Session

### Login Response Handling
```javascript
// After successful login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (response.ok) {
  // Store token in session storage
  sessionStorage.setItem('authToken', data.token);
  sessionStorage.setItem('user', JSON.stringify(data.user));
}
```

### Making Authenticated Requests
```javascript
const token = sessionStorage.getItem('authToken');

const response = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout Handling
```javascript
const logout = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
  window.location.href = '/login';
};
```
```

**Success Check:** ✅ Clear instructions for frontend JWT storage in browser session

---

### Task 10: Testing & Validation
**Estimated Time: 1 hour**

#### 10.1 Manual Testing Checklist
- [ ] User can register with valid email/password
- [ ] Password is hashed in database (not plain text)
- [ ] User can login with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] JWT token is returned on successful login
- [ ] Protected routes require valid token
- [ ] Logout endpoint responds correctly

#### 10.2 Test Database Queries
```bash
# Check if password is hashed
sqlite3 database.sqlite "SELECT email, password_hash FROM users LIMIT 1;"
```

**Success Check:** All manual tests pass

---

## 🔄 Implementation Order

### Phase 1: Foundation (Day 1)
1. Task 1: Database Setup
2. Task 2: Password Security Setup 
3. Task 3: JWT Token Management

### Phase 2: Core Auth (Day 2)
4. Task 4: User Registration Endpoint
5. Task 5: Login Endpoint ⭐ (Core requirement)
6. Task 6: Logout Endpoint ⭐ (Core requirement)

### Phase 3: Protection (Day 3)
7. Task 7: Authentication Middleware
8. Task 8: Protected Route Example
9. Task 9: Frontend Integration Guide
10. Task 10: Testing & Validation

---

## � Quick Start Commands

```bash
# Install all dependencies
npm install drizzle-orm better-sqlite3 bcrypt jsonwebtoken dotenv
npm install -D drizzle-kit @types/better-sqlite3 @types/bcrypt @types/jsonwebtoken

# Setup environment
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env

# Generate and run database migration
npm run db:generate
npm run db:migrate

# Start development
npm run dev
```

---

## ✅ Final Success Validation

After implementation, verify all criteria are met:

1. ✅ **User must log in with email and password**
   - POST `/api/auth/login` accepts email/password
   
2. ✅ **User must be able to log out**
   - POST `/api/auth/logout` handles logout
   
3. ✅ **If email and password match database record, generate a JWT token**
   - Password verified against salted hash
   - JWT token generated on successful match
   
4. ✅ **JWT token should be stored in browser session**
   - Frontend integration guide provided
   - sessionStorage implementation documented
   
5. ✅ **Password should be salted and hashed before comparing to database**
   - bcrypt with 12 salt rounds implemented
   - Password comparison uses bcrypt.compare()

This focused plan delivers exactly what you need with clear, manageable tasks!