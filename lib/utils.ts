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
    
    // If hostname doesn't contain 'xn--', no conversion needed
    if (!urlObj.hostname.includes('xn--')) {
      return url;
    }
    
    // Use internationalized domain name API
    const humanReadableHostname = urlObj.hostname
      .split('.')
      .map(part => {
        try {
          // This will convert xn-- domains to their Unicode representation
          return decodeURIComponent(part)
            .normalize('NFC');
        } catch (e) {
          return part;
        }
      })
      .join('.');
    
    // Return the URL with the converted hostname
    return hasProtocol ? 
      url.replace(urlObj.hostname, humanReadableHostname) : 
      urlToProcess.replace(urlObj.hostname, humanReadableHostname).replace(/^https:\/\//, '');
  } catch (e) {
    console.warn('Error converting URL to human-readable format:', e);
    return url; // Return original URL if conversion fails
  }
}
