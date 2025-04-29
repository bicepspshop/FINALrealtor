import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Query optimization utility functions for Supabase
 */

type SupabaseRow = Record<string, any>;

/**
 * Chunked batch fetching helper for large data sets
 * Fetches data in smaller chunks to avoid overloading the connection
 */
export async function fetchInChunks<T extends SupabaseRow>(
  supabase: SupabaseClient,
  tableName: string,
  idField: string = 'id',
  chunkSize: number = 50,
  filter?: Record<string, any>,
  select?: string
): Promise<T[]> {
  let allResults: T[] = [];
  let lastId: string | null = null;
  let hasMore = true;
  
  while (hasMore) {
    let query = supabase
      .from(tableName)
      .select(select || '*')
      .order(idField, { ascending: true })
      .limit(chunkSize);
    
    // Apply filter conditions if provided
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // Add condition to start after last fetched ID
    if (lastId) {
      query = query.gt(idField, lastId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching chunk from ${tableName}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      // Type assertion: we know the structure matches T based on table schema
      const typedData = data as T[];
      allResults = [...allResults, ...typedData];
      
      const lastItem = typedData[typedData.length - 1];
      lastId = lastItem[idField] as string;
      
      // If we got fewer results than chunk size, we've reached the end
      if (data.length < chunkSize) {
        hasMore = false;
      }
    }
  }
  
  return allResults;
}

/**
 * Fetch related records with optimized JOIN-like syntax that ensures
 * we only request the fields we need
 */
export async function fetchWithRelations<T extends SupabaseRow>(
  supabase: SupabaseClient, 
  options: {
    table: string,
    select: string,
    relations: Array<{
      table: string,
      foreignKey: string,
      localKey?: string,
      select: string
    }>,
    filter?: Record<string, any>
  }
): Promise<T[]> {
  // First fetch main records
  let query = supabase
    .from(options.table)
    .select(options.select);
  
  // Apply filters if any
  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  const { data: mainData, error } = await query;
  
  if (error) {
    console.error(`Error fetching data from ${options.table}:`, error);
    throw error;
  }
  
  if (!mainData || mainData.length === 0) {
    return [];
  }
  
  // Type assertion: we know the structure matches T based on table schema
  const typedMainData = mainData as T[];
  
  // For each relation, fetch related data
  for (const relation of options.relations) {
    const localKey = relation.localKey || 'id';
    const localIds = typedMainData.map(item => item[localKey]);
    
    // Fetch related records
    const { data: relatedData, error: relatedError } = await supabase
      .from(relation.table)
      .select(relation.select)
      .in(relation.foreignKey, localIds);
    
    if (relatedError) {
      console.error(`Error fetching related data from ${relation.table}:`, relatedError);
      throw relatedError;
    }
    
    if (!relatedData) continue;
    
    // Group related data by foreign key
    const groupedRelated: Record<string, SupabaseRow[]> = {};
    
    for (const item of relatedData) {
      const key = item[relation.foreignKey] as string;
      if (!groupedRelated[key]) {
        groupedRelated[key] = [];
      }
      groupedRelated[key].push(item);
    }
    
    // Add related data to main records
    for (const item of typedMainData) {
      const id = item[localKey] as string;
      const relationName = relation.table.replace(/s$/, ''); // Simple pluralization handling
      item[`${relationName}s`] = groupedRelated[id] || [];
    }
  }
  
  return typedMainData;
}

/**
 * Implements debouncing for frequent operations that trigger Supabase queries
 */
export function debounceQuery<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: ReturnType<T>) => void) | null = null;
  let latestReject: ((reason: any) => void) | null = null;
  let latestArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    latestArgs = args;
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Create new promise
    return new Promise((resolve, reject) => {
      latestResolve = resolve as (value: ReturnType<T>) => void;
      latestReject = reject;
      
      timeoutId = setTimeout(async () => {
        try {
          if (latestArgs) {
            const result = await fn(...latestArgs);
            if (latestResolve) {
              latestResolve(result);
            }
          }
        } catch (error) {
          if (latestReject) {
            latestReject(error);
          }
        }
      }, delay);
    });
  };
}

/**
 * Progressive loading of data to improve perceived performance
 * First load critical fields, then load additional data
 */
export async function progressiveLoad<T extends SupabaseRow>(
  supabase: SupabaseClient,
  tableName: string,
  id: string,
  options: {
    criticalFields: string[],
    nonCriticalFields: string[]
  },
  onCriticalDataLoaded?: (data: Partial<T>) => void
): Promise<T> {
  // First load critical fields
  const { data: criticalData, error: criticalError } = await supabase
    .from(tableName)
    .select(options.criticalFields.join(','))
    .eq('id', id)
    .single();
  
  if (criticalError) {
    console.error(`Error loading critical data from ${tableName}:`, criticalError);
    throw criticalError;
  }
  
  // Callback with initial data
  if (onCriticalDataLoaded && criticalData) {
    onCriticalDataLoaded(criticalData as Partial<T>);
  }
  
  // Then load non-critical fields
  const { data: fullData, error: fullError } = await supabase
    .from(tableName)
    .select([...options.criticalFields, ...options.nonCriticalFields].join(','))
    .eq('id', id)
    .single();
  
  if (fullError) {
    console.error(`Error loading complete data from ${tableName}:`, fullError);
    throw fullError;
  }
  
  if (!fullData) {
    throw new Error(`No data found for ${tableName} with id ${id}`);
  }
  
  return fullData as T;
} 