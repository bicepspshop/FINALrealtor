"use client"

import { useState, useEffect, useMemo } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SubscriptionStatus } from "@/lib/subscription-service"

// Support both old and new prop interfaces during transition
interface SubscriptionBannerProps {
  initialStatus?: SubscriptionStatus;
  trialInfo?: any; // For backwards compatibility
}

export function SubscriptionBanner({ initialStatus, trialInfo }: SubscriptionBannerProps) {
  // Handle both new and legacy props
  const initialData = useMemo(() => {
    // If initialStatus is provided, use it (new format)
    if (initialStatus) {
      return initialStatus;
    }
    
    // Otherwise, convert from old trialInfo format
    if (trialInfo) {
      return {
        isActive: trialInfo.isActive || false,
        status: trialInfo.subscriptionStatus || 'unknown',
        trialEndTime: trialInfo.trialEndTime,
        remainingMinutes: trialInfo.remainingMinutes
      } as SubscriptionStatus;
    }
    
    // Default fallback
    return {
      isActive: false,
      status: 'unknown'
    } as SubscriptionStatus;
  }, [initialStatus, trialInfo]);

  const [status, setStatus] = useState<SubscriptionStatus>(initialData);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if we're on the clients page
  const isClientsPage = pathname.startsWith("/dashboard/clients");
  
  // Apply offset style when on clients page
  const containerStyles = useMemo(() => 
    isClientsPage ? { marginLeft: '-7px' } : {}, 
  [isClientsPage]);
  
  // Function to fetch the latest subscription status
  const refreshStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription-status', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const freshStatus = await response.json();
        setStatus(freshStatus);
        
        // If subscription just expired, reload the page to trigger middleware
        if (status?.isActive && !freshStatus.isActive) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate and update remaining time
  useEffect(() => {
    // Safety check to make sure status is defined and properly initialized
    if (!status || status.status !== 'trial' || !status.trialEndTime) {
      return;
    }
      
    const updateTimeDisplay = () => {
      const now = new Date();
      const endTime = new Date(status.trialEndTime as Date);
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setRemainingTime("0д 0ч 0м");
        refreshStatus(); // Check status when timer hits zero
        return;
      }
      
      const remainingMinutes = Math.floor(diff / (1000 * 60));
      const days = Math.floor(remainingMinutes / (60 * 24));
      const hours = Math.floor((remainingMinutes % (60 * 24)) / 60);
      const minutes = Math.floor(remainingMinutes % 60);
      
      setRemainingTime(`${days}д ${hours}ч ${minutes}м`);
    };
    
    // Initial update
    updateTimeDisplay();
    
    // Update countdown every minute
    const interval = setInterval(() => {
      updateTimeDisplay();
      
      // Every 5 minutes, also refresh the status from the server
      if (new Date().getMinutes() % 5 === 0) {
        refreshStatus();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [status]); // Simplified dependency array
  
  // Ensure status is defined before rendering
  if (!status) return null;

  // Don't render anything for active subscriptions
  if (status.status === 'active') {
    return null;
  }
  
  // Subscription expired banner
  if (status.status === 'expired') {
    return (
      <Alert 
        variant="destructive" 
        className="mb-8 rounded-sm border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 theme-transition"
        style={containerStyles}
      >
        <CreditCard className="h-4 w-4 text-red-600 dark:text-red-500 theme-transition" />
        <AlertTitle className="font-medium text-red-700 dark:text-red-500 theme-transition">Пробный период завершен</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-700/80 dark:text-red-500/90 theme-transition">
          <span>Для продолжения работы необходимо оформить подписку</span>
          <Link href="/dashboard/subscription">
            <Button variant="outline" className="whitespace-nowrap border-red-400 hover:border-red-500 dark:border-red-700 dark:hover:border-red-600 theme-transition">
              Оформить подписку
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    )
  }
  
  // Trial period banner
  return (
    <Alert 
      variant="default" 
      className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition relative"
      style={containerStyles}
    >
      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
      <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Пробный период</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-700/80 dark:text-amber-500/90 theme-transition">
        <span>Осталось времени: <strong>{remainingTime}</strong></span>
        <Link href="/dashboard/subscription">
          <Button variant="outline" className="whitespace-nowrap border-amber-400 hover:border-amber-500 dark:border-amber-700 dark:hover:border-amber-600 text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-medium theme-transition">
            Оформить подписку
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  )
} 