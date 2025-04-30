"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Check interval in milliseconds (10 seconds)
const CHECK_INTERVAL = 10000;

// Create subscription context
interface SubscriptionContextType {
  isActive: boolean;
  status: 'trial' | 'active' | 'expired' | 'unknown';
  trialEndTime?: Date;
  remainingMinutes?: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

// Hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionStatusProvider');
  }
  return context;
}

interface SubscriptionStatusProviderProps {
  children: ReactNode;
}

export function SubscriptionStatusProvider({ children }: SubscriptionStatusProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkCount, setCheckCount] = useState(0);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionContextType>({
    isActive: true,
    status: 'unknown'
  });
  
  // Skip checks if already on subscription page to prevent redirect loops
  const isSubscriptionPage = pathname.startsWith('/dashboard/subscription');
  
  useEffect(() => {
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
        setSubscriptionState(status);
        
        // If subscription is not active and not on subscription page, redirect
        if (!status.isActive && !isSubscriptionPage) {
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
  }, [router, isSubscriptionPage, pathname]);
  
  return (
    <SubscriptionContext.Provider value={subscriptionState}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * This component periodically checks the user's subscription status
 * and redirects to the subscription page if it expires or becomes invalid.
 * 
 * It should be included in the layout of protected routes.
 */
export function SubscriptionStatusChecker() {
  // This is now just a wrapper for the provider for backward compatibility
  return null;
} 