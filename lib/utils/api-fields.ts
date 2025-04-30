import { NextRequest } from 'next/server';

/**
 * Parses the 'fields' query parameter to determine which fields to include in response
 * @param request - The Next.js request object
 * @param defaultFields - Default fields to return if no fields specified
 * @param allowedFields - All fields that are allowed to be selected
 * @returns An object with selected fields as keys (all true)
 */
export function getSelectedFields(
  request: NextRequest,
  defaultFields: string[] = [],
  allowedFields: string[] = []
): Record<string, boolean> {
  const searchParams = request.nextUrl.searchParams;
  const fieldsParam = searchParams.get('fields');
  
  // If no fields parameter, return default fields
  if (!fieldsParam) {
    return defaultFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }
  
  // Parse fields parameter
  const requestedFields = fieldsParam.split(',').map(f => f.trim());
  
  // If allowedFields is provided, filter out any fields that aren't allowed
  const filteredFields = allowedFields.length > 0
    ? requestedFields.filter(field => allowedFields.includes(field))
    : requestedFields;
  
  // If no valid fields requested, return default fields
  if (filteredFields.length === 0) {
    return defaultFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }
  
  // Return object with requested fields
  return filteredFields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Checks if a specific field was requested
 * @param selectedFields - Object with selected fields
 * @param field - Field to check
 * @returns Boolean indicating if field was selected
 */
export function isFieldSelected(
  selectedFields: Record<string, boolean>,
  field: string
): boolean {
  return !!selectedFields[field];
}

/**
 * Filters an object to only include selected fields
 * @param obj - Object to filter
 * @param selectedFields - Fields to include
 * @returns Filtered object
 */
export function filterObjectByFields<T extends Record<string, any>>(
  obj: T,
  selectedFields: Record<string, boolean>
): Partial<T> {
  const result: Partial<T> = {};
  
  Object.keys(selectedFields).forEach(field => {
    if (field in obj) {
      result[field as keyof T] = obj[field];
    }
  });
  
  return result;
} 