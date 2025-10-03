# Fix: UUID Validation Error for MongoDB ObjectIds

## Issue
When trying to delete accounts, the server returned a 400 validation error:
```
Validation failed: "Invalid account ID format"
DELETE /api/v1/accounts/68d3ac53c3344f1c6bf75662 400
```

## Root Cause
The validation schemas were using `.uuid()` to validate ID parameters:
```typescript
id: z.string().uuid('Invalid account ID format')
```

However, the project uses **MongoDB with ObjectId format**, not PostgreSQL with UUIDs:
- **UUID format**: `123e4567-e89b-12d3-a456-426614174000` (36 characters with dashes)
- **ObjectId format**: `68d3ac53c3344f1c6bf75662` (24-character hexadecimal string)

From `schema.prisma`:
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Account {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  // ...
}
```

## Solution

### 1. Updated Account Routes (`apps/api/src/routes/account.routes.ts`)
Changed from UUID validation to MongoDB ObjectId validation:

**Before:**
```typescript
const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account ID format')
  })
});
```

**After:**
```typescript
// MongoDB ObjectId validation (24-character hexadecimal string)
const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid account ID format')
  })
});
```

### 2. Updated Attendee Routes (`apps/api/src/routes/attendee.routes.ts`)
Applied the same fix to all ID validations in attendee routes.

### 3. Created Common Validation Utilities (`apps/api/src/validations/common.validation.ts`)
Created reusable validation helpers to prevent future inconsistencies:

```typescript
/**
 * MongoDB ObjectId validation
 * Validates a 24-character hexadecimal string
 */
export const mongoObjectId = () =>
  z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format: must be a 24-character hexadecimal string');

/**
 * Common ID parameter validation for MongoDB
 */
export const idParamSchema = z.object({
  params: z.object({
    id: mongoObjectId()
  })
});
```

## MongoDB ObjectId Format
- **Length**: Exactly 24 characters
- **Characters**: Hexadecimal (0-9, a-f, A-F)
- **Example**: `68d3ac53c3344f1c6bf75662`
- **Regex**: `/^[0-9a-fA-F]{24}$/`

## Testing
After this fix:
- ✅ Delete operations now work correctly
- ✅ Update operations work correctly
- ✅ Get by ID operations work correctly
- ✅ All ID validations accept MongoDB ObjectIds

## Files Modified
1. `/apps/api/src/routes/account.routes.ts` - Changed UUID to ObjectId validation
2. `/apps/api/src/routes/attendee.routes.ts` - Changed UUID to ObjectId validation
3. `/apps/api/src/validations/common.validation.ts` - Created reusable validation utilities

## Future Improvements
Consider importing and using the common validation utilities in route files:
```typescript
import { idParamSchema, mongoObjectId } from '../validations/common.validation.js';
```

This ensures consistency across all routes and makes it easier to maintain.

## Date
October 4, 2025
