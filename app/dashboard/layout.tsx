import { ReactNode } from 'react';
import { SubscriptionStatusChecker } from '@/components/subscription-status-checker';
import { requireAuth } from '@/lib/auth';
import { SubscriptionService } from '@/lib/subscription-service';
import { Suspense } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard layout component that wraps all dashboard pages
 * and includes the subscription status checker
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Get authenticated user with auth check
  const user = await requireAuth();
  
  // Get subscription status for the initial render
  let subscriptionStatus = null;
  try {
    if (user.id) {
      subscriptionStatus = await SubscriptionService.getSubscriptionStatus(user.id);
    }
  } catch (error) {
    console.error('Error getting subscription status for layout:', error);
  }
  
  // We need to enhance the children with subscription status data
  // For this, we'll use context or prop drilling based on the app's structure
  
  return (
    <>
      {/* Real-time subscription status checker */}
      <Suspense fallback={null}>
        <SubscriptionStatusChecker />
      </Suspense>
      
      {/* Page content */}
      {children}
    </>
  );
} 