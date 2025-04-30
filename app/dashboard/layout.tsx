import { ReactNode } from 'react';
import { SubscriptionStatusChecker, SubscriptionStatusProvider } from '@/components/subscription-status-checker';
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
  
  return (
    <Suspense fallback={null}>
      <SubscriptionStatusProvider>
        {/* Legacy subscription checker for backward compatibility */}
        <SubscriptionStatusChecker />
        
        {/* Page content */}
        {children}
      </SubscriptionStatusProvider>
    </Suspense>
  );
} 