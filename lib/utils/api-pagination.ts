import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateRequestParams } from './api-validation';

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1)
    .transform((val) => Math.max(1, val)),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .default(20)
    .transform((val) => Math.min(100, Math.max(1, val))),
});

/**
 * Extracts pagination parameters from a NextRequest
 * @param req - The NextRequest object
 * @returns Pagination parameters with page, pageSize, skip, and take values
 */
export function getPaginationParams(req: NextRequest): PaginationParams {
  const { data } = validateRequestParams(req, paginationSchema);
  
  // Default to page 1, pageSize 20 if validation fails (shouldn't happen due to defaults)
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 20;
  
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * Creates a paginated response object
 * @param data - The array of data items for the current page
 * @param totalItems - The total number of items across all pages
 * @param pagination - The pagination parameters from the request
 * @returns A standardized paginated response object
 */
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  pagination: PaginationParams
): PaginatedResponse<T> {
  const { page, pageSize } = pagination;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Adds pagination metadata to the headers of a response
 * @param headers - The headers object to add pagination metadata to
 * @param pagination - The pagination details to add to headers
 */
export function addPaginationHeaders(
  headers: Headers,
  pagination: PaginatedResponse<any>['pagination']
): void {
  headers.set('X-Total-Count', pagination.totalItems.toString());
  headers.set('X-Total-Pages', pagination.totalPages.toString());
  headers.set('X-Current-Page', pagination.page.toString());
  headers.set('X-Page-Size', pagination.pageSize.toString());
  headers.set('X-Has-Next-Page', pagination.hasNextPage.toString());
  headers.set('X-Has-Previous-Page', pagination.hasPreviousPage.toString());
} 