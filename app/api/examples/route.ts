import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  // Field selection utilities
  getSelectedFields,
  filterObjectByFields,
  
  // Error handling
  badRequest,
  notFound,
  
  // Validation
  validateRequestParams,
  
  // Pagination
  getPaginationParams,
  createPaginatedSuccessResponse,
  
  // Caching
  CachingStrategy,
  
  // Response builders
  createSuccessResponse,
} from '@/lib/utils/api';

// Example data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2023-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2023-01-02' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2023-01-03' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'manager', createdAt: '2023-01-04' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', createdAt: '2023-01-05' },
];

// Search params schema
const searchParamsSchema = z.object({
  role: z.string().optional(),
  nameContains: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // 1. Validate search parameters
    const { data: params, error: validationError } = validateRequestParams(
      req,
      searchParamsSchema
    );
    
    if (validationError) {
      return validationError;
    }
    
    // 2. Get field selection from request
    const selectedFields = getSelectedFields(req, 
      ['id', 'name', 'email'], // Default fields
      ['id', 'name', 'email', 'role', 'createdAt'] // Allowed fields
    );
    
    // 3. Get pagination parameters
    const pagination = getPaginationParams(req);
    
    // 4. Filter data based on search params
    let filteredUsers = [...users];
    
    if (params?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params?.nameContains) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(params.nameContains!.toLowerCase())
      );
    }
    
    // 5. Get total count before pagination
    const totalItems = filteredUsers.length;
    
    // 6. Apply pagination
    const paginatedUsers = filteredUsers.slice(
      pagination.skip,
      pagination.skip + pagination.take
    );
    
    // 7. Apply field selection to each item
    const formattedUsers = paginatedUsers.map(user => 
      filterObjectByFields(user, selectedFields)
    );
    
    // 8. Create paginated response with the correct structure
    const paginatedData = {
      data: formattedUsers,
      pagination: { 
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pagination.pageSize),
        hasNextPage: pagination.page < Math.ceil(totalItems / pagination.pageSize),
        hasPreviousPage: pagination.page > 1
      }
    };
    
    // 9. Create a paginated success response
    return createPaginatedSuccessResponse(
      paginatedData,
      { 
        cacheStrategy: CachingStrategy.SHORT_TERM,
        addETag: true
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return badRequest('An error occurred while processing your request');
  }
}

export async function POST(req: NextRequest) {
  // This is just a demonstration endpoint
  return createSuccessResponse(
    { message: 'This is a POST endpoint example' },
    { status: 200 }
  );
} 