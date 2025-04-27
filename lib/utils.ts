import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Converts a Punycode URL (xn--) to a human-readable URL with Cyrillic characters
 * @param url The URL to convert
 * @returns The human-readable URL
 */
export function toHumanReadableUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  
  try {
    // Handle URLs that might not have a protocol
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
    const urlToProcess = hasProtocol ? url : `https://${url}`;
    
    const urlObj = new URL(urlToProcess);
    
    // For the specific domain риелторпро.рф (xn--e1afkmafcebq.xn--p1ai)
    if (urlObj.hostname.includes('xn--e1afkmafcebq') || urlObj.hostname.includes('xn--p1ai')) {
      // Hardcoded conversion for our domain
      const cyrillicHostname = urlObj.hostname
        .replace('xn--e1afkmafcebq', 'риелторпро')
        .replace('xn--p1ai', 'рф');
      
      // Return with the converted hostname
      return hasProtocol ? 
        url.replace(urlObj.hostname, cyrillicHostname) : 
        urlToProcess.replace(urlObj.hostname, cyrillicHostname).replace(/^https:\/\//, '');
    }
    
    // For other xn-- domains, attempt standard conversion
    if (urlObj.hostname.includes('xn--')) {
      try {
        // Convert Punycode to Unicode
        // This is a best-effort approach using the browser's native handling
        const tempAnchor = document.createElement('a');
        tempAnchor.href = urlToProcess;
        // The browser will convert the hostname for display in textContent
        const humanReadableHostname = tempAnchor.hostname;
        
        // Return with the converted hostname
        return hasProtocol ? 
          url.replace(urlObj.hostname, humanReadableHostname) : 
          urlToProcess.replace(urlObj.hostname, humanReadableHostname).replace(/^https:\/\//, '');
      } catch (e) {
        console.warn('Error converting domain with DOM method:', e);
        // Return original URL if this method fails
        return url;
      }
    }
    
    // If no conversion needed, return original
    return url;
  } catch (e) {
    console.warn('Error converting URL to human-readable format:', e);
    return url; // Return original URL if conversion fails
  }
}
