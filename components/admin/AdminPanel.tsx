'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AdminTabs from './AdminTabs';
import { usePathname } from 'next/navigation';

type AdminPanelProps = {
  userId: string;
  isAdmin: boolean;
};

const AdminPanel = ({ userId, isAdmin }: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  // Close panel on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Only render if user is admin
  if (!isAdmin) return null;

  return (
    <>
      {/* Admin toggle button - fixed position at bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </button>

      {/* Admin panel drawer */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div 
            className={`bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 max-h-full overflow-hidden flex flex-col
              ${isMinimized 
                ? 'w-[300px] h-[50px]' 
                : 'w-[90vw] md:w-[600px] lg:w-[800px] h-[85vh]'}`}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
              <h2 className="text-lg font-semibold">Панель администратора</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-indigo-700 rounded"
                >
                  {isMinimized ? 'Развернуть' : 'Свернуть'}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-indigo-700 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Panel content */}
            {!isMinimized && (
              <div className="flex-1 overflow-auto p-4">
                <AdminTabs userId={userId} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel; 