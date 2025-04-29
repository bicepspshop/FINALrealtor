# API Utilities

A collection of TypeScript utilities for building standardized, robust Next.js API routes.

## Overview

This utility library provides a set of tools to handle common API concerns including:

- Field selection
- Error handling
- Request validation
- Pagination
- Caching
- Response formatting

## Usage

Import the utilities directly from their respective files, or use the barrel export:

```typescript
import { 
  getSelectedFields, 
  badRequest, 
  validateRequestParams 
} from '@/lib/utils/api';
```

## Modules

### Field Selection (`api-fields.ts`)

Utilities for handling field selection in API responses, allowing clients to specify which fields they want included.

```typescript
// Example: GET /api/users?fields=id,name,email
const selectedFields = getSelectedFields(
  req, 
  ['id', 'name'], // Default fields
  ['id', 'name', 'email', 'role', 'createdAt'] // Allowed fields
);

// Filter object to only include requested fields
const filteredUser = filterObjectByFields(user, selectedFields);
```

### Error Handling (`api-errors.ts`)

Standardized error responses for API routes.

```typescript
// Create error responses
return badRequest('Invalid input', { details: { field: 'missing' } });
return notFound('User not found');
return unauthorized('Authentication required');
```

### Validation (`api-validation.ts`)

Request validation using Zod schemas.

```typescript
// Define schema
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// Validate request body
const { data, error } = await validateRequestJSON(req, schema);
if (error) return error;

// Validate query parameters
const { data, error } = validateRequestParams(req, schema);
if (error) return error;
```

### Pagination (`api-pagination.ts`)

Utilities for handling paginated responses.

```typescript
// Extract pagination params from request
const pagination = getPaginationParams(req);

// Apply pagination to database query
const { skip, take } = pagination;

// Create paginated response
const paginatedData = {
  data: items,
  pagination: {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pagination.pageSize),
    hasNextPage: pagination.page < Math.ceil(totalItems / pagination.pageSize),
    hasPreviousPage: pagination.page > 1
  }
};
```

### Caching (`api-cache.ts`)

Utilities for handling response caching.

```typescript
// Apply caching to response
return applyCacheHeaders(response, CachingStrategy.SHORT_TERM);

// Check if cache should be bypassed
if (shouldBypassCache(req)) {
  // Skip cache
}

// Apply ETag for client-side caching
return applyETag(response, data);
```

### Response Formatting (`api-response.ts`)

Standardized response formatting.

```typescript
// Create a success response
return createSuccessResponse(
  data,
  { 
    status: 200,
    message: 'Operation successful',
    cacheStrategy: CachingStrategy.SHORT_TERM,
    addETag: true
  }
);

// Create a created response
return createCreatedResponse(
  newItem,
  { 
    message: 'Item created',
    location: `/api/items/${newItem.id}`
  }
);

// Create a paginated response
return createPaginatedSuccessResponse(
  paginatedData,
  { 
    cacheStrategy: CachingStrategy.SHORT_TERM,
    addETag: true
  }
);
```

## Example API Route

See `app/api/examples/route.ts` for a complete example of using these utilities together. 