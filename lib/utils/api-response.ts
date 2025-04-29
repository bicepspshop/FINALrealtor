import { NextResponse } from 'next/server';
import { CachingStrategy, applyCacheHeaders, applyETag } from './api-cache';
import { PaginatedResponse } from './api-pagination';

/**
 * Interface for standard API response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Creates a standardized success response
 * @param data - The data to include in the response
 * @param options - Additional options for the response
 * @returns A NextResponse with standardized format
 */
export function createSuccessResponse<T>(
  data: T,
  options: {
    status?: number;
    message?: string;
    cacheStrategy?: CachingStrategy;
    addETag?: boolean;
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const { 
    status = 200, 
    message, 
    cacheStrategy, 
    addETag = false,
    headers = {}
  } = options;

  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  };

  let nextResponse = NextResponse.json(response, { status });
  
  // Apply cache headers if cache strategy specified
  if (cacheStrategy) {
    nextResponse = applyCacheHeaders(nextResponse, cacheStrategy);
  }
  
  // Apply ETag if requested
  if (addETag) {
    nextResponse = applyETag(nextResponse, data);
  }
  
  // Apply additional headers
  Object.entries(headers).forEach(([key, value]) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
}

/**
 * Creates a standardized success response for paginated data
 * @param paginatedResponse - The paginated response object
 * @param options - Additional options for the response
 * @returns A NextResponse with standardized format including pagination
 */
export function createPaginatedSuccessResponse<T>(
  paginatedResponse: PaginatedResponse<T>,
  options: {
    status?: number;
    message?: string;
    cacheStrategy?: CachingStrategy;
    addETag?: boolean;
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const { data, pagination } = paginatedResponse;
  
  // Create base success response with the data
  const response = createSuccessResponse(
    { items: data, pagination },
    options
  );
  
  // Add pagination headers
  Object.entries(pagination).forEach(([key, value]) => {
    response.headers.set(`X-Pagination-${key}`, value.toString());
  });
  
  return response;
}

/**
 * Creates a 204 No Content response
 * @returns A NextResponse with 204 status
 */
export function createNoContentResponse(): NextResponse {
  return NextResponse.json(null, { status: 204 });
}

/**
 * Creates a standardized accepted response (202)
 * @param message - Optional message to include
 * @returns A NextResponse with 202 status
 */
export function createAcceptedResponse(message?: string): NextResponse {
  return createSuccessResponse(
    null,
    { 
      status: 202,
      message: message || 'Request accepted and being processed'
    }
  );
}

/**
 * Creates a standardized created response (201)
 * @param data - The created resource data
 * @param options - Additional options for the response
 * @returns A NextResponse with 201 status
 */
export function createCreatedResponse<T>(
  data: T,
  options: {
    message?: string;
    location?: string;
  } = {}
): NextResponse {
  const response = createSuccessResponse(
    data, 
    { 
      status: 201,
      message: options.message || 'Resource created successfully'
    }
  );
  
  if (options.location) {
    response.headers.set('Location', options.location);
  }
  
  return response;
} 