"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Check interval in milliseconds (10 seconds)
const CHECK_INTERVAL = 10000;

/**
 * This component periodically checks the user's subscription status
 * and redirects to the subscription page if it expires or becomes invalid.
 * 
 * It should be included in the layout of protected routes.
 */
export function SubscriptionStatusChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const [checkCount, setCheckCount] = useState(0);
  
  // Skip checks if already on subscription page to prevent redirect loops
  const isSubscriptionPage = pathname.startsWith('/dashboard/subscription');
  
  useEffect(() => {
    // Don't run on subscription page
    if (isSubscriptionPage) {
      return;
    }
    
    // Function to check subscription status
    const checkStatus = async () => {
      try {
        // Call our API endpoint with no-cache to ensure fresh data
        const response = await fetch('/api/subscription-status', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          console.error('Error checking subscription status');
          return;
        }
        
        const status = await response.json();
        
        // If subscription is not active, redirect to subscription page
        if (!status.isActive) {
          console.log('Subscription not active, redirecting to subscription page');
          router.push('/dashboard/subscription');
        }
        
        // Update check count for debugging purposes
        setCheckCount(prev => prev + 1);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };
    
    // Check immediately on component mount
    checkStatus();
    
    // Set up interval for periodic checks
    const interval = setInterval(checkStatus, CHECK_INTERVAL);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [router, isSubscriptionPage]);
  
  // This component doesn't render anything visible
  return null;
} 