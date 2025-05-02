import { ReactNode } from 'react';
import { SubscriptionStatusProvider } from '@/components/subscription-status-checker';
import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
}

/**
 * Profile layout component that wraps the profile page
 * and includes the subscription status provider
 */
export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  // Get authenticated user with auth check
  await requireAuth();
  
  return (
    <Suspense fallback={null}>
      <SubscriptionStatusProvider>
        {children}
      </SubscriptionStatusProvider>
    </Suspense>
  );
} 