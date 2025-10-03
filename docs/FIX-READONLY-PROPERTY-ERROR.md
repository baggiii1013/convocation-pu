# Fix: "Attempted to assign to readonly property" Error

## Issue
When accessing `/api/v1/accounts`, the server returned a 500 error with the message:
```
ERROR: Unexpected validation error {"error":"Attempted to assign to readonly property."}
```

## Root Cause
The error occurred because the validation middleware was trying to assign transformed query parameters back to `req.query`, which is a **readonly property** in Express.

In the validation schema, we were using `.transform(Number)` to convert string query parameters to numbers:
```typescript
page: z.string().regex(/^\d+$/).transform(Number).optional()
```

The validation middleware then attempted to assign the transformed result back to `req.query`, causing the error.

## Solution

### 1. Updated Validation Schema (`apps/api/src/routes/account.routes.ts`)
Removed the `.transform(Number)` from query parameters since the controller already handles parsing:

**Before:**
```typescript
const getAllQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).refine(val => val <= 100).optional(),
    // ...
  })
});
```

**After:**
```typescript
const getAllQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    // ...
  })
});
```

### 2. Updated Validation Middleware (`apps/api/src/middleware/validate.ts`)
Modified the middleware to skip reassigning `req.query` since it's readonly:

**Before:**
```typescript
if (result.query) {
  req.query = result.query;
}
```

**After:**
```typescript
// Skip updating req.query as it's readonly in Express
// Query parameters should be parsed in controllers instead of transformed in validation
```

### 3. Controller Already Handles Parsing
The controller (`apps/api/src/controllers/account.controller.ts`) already properly parses query parameters:
```typescript
const page = parseInt(req.query.page as string) || 1;
const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
```

## Why This Works
1. **Validation** - Zod still validates that query parameters match the expected format (e.g., numeric strings)
2. **Transformation** - The controller handles type conversion from string to number
3. **No Readonly Assignment** - We avoid trying to assign to the readonly `req.query` property

## Testing
After this fix, the endpoint should work correctly:
- ✅ Query parameters are validated for format
- ✅ Query parameters are parsed to correct types in the controller
- ✅ No "readonly property" errors

## Files Modified
1. `/apps/api/src/routes/account.routes.ts` - Removed `.transform()` from query schema
2. `/apps/api/src/routes/attendee.routes.ts` - Removed `.transform()` from query schema
3. `/apps/api/src/middleware/validate.ts` - Skipped reassigning to `req.query`

## Note
This fix was applied to **all route files** that use query parameter validation to prevent similar issues across the entire API.

## Date
October 4, 2025
