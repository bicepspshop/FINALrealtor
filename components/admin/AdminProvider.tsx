'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminPanel from './AdminPanel';

type AdminProviderProps = {
  children: ReactNode;
};

export default function AdminProvider({ children }: AdminProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  // Check admin status on mount and path change
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First get current session
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (!sessionData.user?.id) {
          setUserId(null);
          setIsAdmin(false);
          return;
        }
        
        setUserId(sessionData.user.id);
        
        // Check if user is admin
        const adminCheckRes = await fetch('/api/admin/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: sessionData.user.id })
        });
        
        const adminData = await adminCheckRes.json();
        setIsAdmin(adminData.isAdmin === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [pathname]);

  return (
    <>
      {children}
      {userId && <AdminPanel userId={userId} isAdmin={isAdmin} />}
    </>
  );
} 