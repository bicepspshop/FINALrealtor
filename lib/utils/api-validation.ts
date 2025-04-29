import { z } from 'zod';
import { NextRequest } from 'next/server';
import { badRequest } from './api-errors';

/**
 * Validates request data using a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data or throws an error
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodError(error);
      throw new ValidationError(formattedErrors);
    }
    throw error;
  }
}

/**
 * Validates request data and returns a friendly error response if validation fails
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data or null if validation fails
 */
export function validateRequestData<T extends z.ZodType>(
  schema: T,
  data: unknown
) {
  try {
    return { data: schema.parse(data), error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = formatZodError(error);
      return { 
        data: null, 
        error: badRequest('Validation error', { validationErrors: details }) 
      };
    }
    throw error;
  }
}

/**
 * Extracts and validates JSON from a NextRequest
 * @param req - The NextRequest object
 * @param schema - The Zod schema to validate against
 * @returns The validated data or null if validation fails
 */
export async function validateRequestJSON<T extends z.ZodType>(
  req: NextRequest,
  schema: T
) {
  try {
    const body = await req.json();
    return validateRequestData(schema, body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { 
        data: null, 
        error: badRequest('Invalid JSON in request body') 
      };
    }
    throw error;
  }
}

/**
 * Extracts and validates search params from a NextRequest
 * @param req - The NextRequest object
 * @param schema - The Zod schema to validate against
 * @returns The validated data or null if validation fails
 */
export function validateRequestParams<T extends z.ZodType>(
  req: NextRequest,
  schema: T
) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);
  return validateRequestData(schema, searchParams);
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * Formats a Zod error into a more user-friendly format
 * @param error - The Zod error to format
 * @returns An object with field paths as keys and arrays of error messages as values
 */
function formatZodError(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });
  
  return errors;
} 