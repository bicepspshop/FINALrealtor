import { NextResponse } from 'next/server';

export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Creates a standardized error response for API routes
 * @param code - The error code
 * @param message - The error message
 * @param status - The HTTP status code
 * @param details - Additional error details (optional)
 * @returns A NextResponse with standardized error format
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}

/**
 * Creates a 400 Bad Request error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function badRequest(
  message = 'Bad Request',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.BAD_REQUEST, message, 400, details);
}

/**
 * Creates a 401 Unauthorized error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function unauthorized(
  message = 'Unauthorized',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.UNAUTHORIZED, message, 401, details);
}

/**
 * Creates a 403 Forbidden error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function forbidden(
  message = 'Forbidden',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.FORBIDDEN, message, 403, details);
}

/**
 * Creates a 404 Not Found error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function notFound(
  message = 'Not Found',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.NOT_FOUND, message, 404, details);
}

/**
 * Creates a 405 Method Not Allowed error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function methodNotAllowed(
  message = 'Method Not Allowed',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.METHOD_NOT_ALLOWED, message, 405, details);
}

/**
 * Creates a 409 Conflict error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function conflict(
  message = 'Conflict',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.CONFLICT, message, 409, details);
}

/**
 * Creates a 500 Internal Server Error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function internalServerError(
  message = 'Internal Server Error',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message, 500, details);
}

/**
 * Creates a 503 Service Unavailable error response
 * @param message - The error message
 * @param details - Additional error details (optional)
 */
export function serviceUnavailable(
  message = 'Service Unavailable',
  details?: Record<string, any>
): NextResponse<ErrorResponse> {
  return createErrorResponse(ErrorCode.SERVICE_UNAVAILABLE, message, 503, details);
} 