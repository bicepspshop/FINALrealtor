import { NextRequest, NextResponse } from 'next/server';

export enum CachingStrategy {
  NO_CACHE = 'no-cache',
  SHORT_TERM = 'short-term',
  MEDIUM_TERM = 'medium-term',
  LONG_TERM = 'long-term',
  STATIC = 'static',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
}

export interface CacheConfig {
  strategy: CachingStrategy;
  maxAge?: number;
  staleWhileRevalidate?: number;
  customDirectives?: string[];
}

// Default cache configurations
const DEFAULT_CACHE_CONFIGS: Record<CachingStrategy, CacheConfig> = {
  [CachingStrategy.NO_CACHE]: {
    strategy: CachingStrategy.NO_CACHE,
    customDirectives: ['no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate'],
  },
  [CachingStrategy.SHORT_TERM]: {
    strategy: CachingStrategy.SHORT_TERM,
    maxAge: 60, // 1 minute
  },
  [CachingStrategy.MEDIUM_TERM]: {
    strategy: CachingStrategy.MEDIUM_TERM,
    maxAge: 300, // 5 minutes
  },
  [CachingStrategy.LONG_TERM]: {
    strategy: CachingStrategy.LONG_TERM,
    maxAge: 3600, // 1 hour
  },
  [CachingStrategy.STATIC]: {
    strategy: CachingStrategy.STATIC,
    maxAge: 86400, // 1 day
  },
  [CachingStrategy.STALE_WHILE_REVALIDATE]: {
    strategy: CachingStrategy.STALE_WHILE_REVALIDATE,
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
  },
};

/**
 * Generates Cache-Control header value based on cache configuration
 * @param config - The cache configuration
 * @returns The Cache-Control header value
 */
export function generateCacheControlHeader(config: CacheConfig): string {
  const directives: string[] = [];

  // Base directives
  if (config.strategy === CachingStrategy.NO_CACHE) {
    return config.customDirectives!.join(', ');
  } else {
    directives.push('public');
  }

  // Max-age directive
  if (config.maxAge !== undefined) {
    directives.push(`max-age=${config.maxAge}`);
  }

  // Stale-while-revalidate directive
  if (config.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  // Add any custom directives
  if (config.customDirectives) {
    directives.push(...config.customDirectives);
  }

  return directives.join(', ');
}

/**
 * Creates a cache configuration object by extending default configs
 * @param strategy - The caching strategy to use
 * @param overrides - Optional overrides for the strategy's default values
 * @returns The complete cache configuration
 */
export function createCacheConfig(
  strategy: CachingStrategy,
  overrides?: Partial<CacheConfig>
): CacheConfig {
  const defaultConfig = DEFAULT_CACHE_CONFIGS[strategy];
  
  return {
    ...defaultConfig,
    ...overrides,
  };
}

/**
 * Applies caching headers to a NextResponse object
 * @param response - The Next.js response object
 * @param config - The cache configuration to apply
 * @returns The response with cache headers applied
 */
export function applyCacheHeaders(
  response: NextResponse,
  config: CacheConfig | CachingStrategy
): NextResponse {
  const cacheConfig = typeof config === 'string' 
    ? DEFAULT_CACHE_CONFIGS[config]
    : config;
    
  const cacheControlValue = generateCacheControlHeader(cacheConfig);
  
  response.headers.set('Cache-Control', cacheControlValue);
  
  return response;
}

/**
 * Determines if a request should bypass cache based on headers or query params
 * @param req - The Next.js request object
 * @returns Boolean indicating if cache should be bypassed
 */
export function shouldBypassCache(req: NextRequest): boolean {
  // Check for cache-busting query parameter
  if (req.nextUrl.searchParams.has('no-cache') || req.nextUrl.searchParams.has('refresh')) {
    return true;
  }
  
  // Check for cache-control header
  const cacheControl = req.headers.get('Cache-Control');
  if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
    return true;
  }
  
  return false;
}

/**
 * Applies ETag header to a response for client-side caching
 * @param response - The Next.js response object
 * @param data - The data to generate an ETag from
 * @returns The response with ETag header applied
 */
export function applyETag(response: NextResponse, data: any): NextResponse {
  // Generate a simple hash from the stringified data
  const hash = generateHash(JSON.stringify(data));
  response.headers.set('ETag', `"${hash}"`);
  
  return response;
}

/**
 * Generates a simple hash for ETag generation
 * @param str - The string to hash
 * @returns A hash string
 */
function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
} 