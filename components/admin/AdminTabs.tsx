'use client';

import { useState } from 'react';
import UsersTab from './tabs/UsersTab';
import PropertiesTab from './tabs/PropertiesTab';
import SystemTab from './tabs/SystemTab';

type AdminTabsProps = {
  userId: string;
};

const AdminTabs = ({ userId }: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState('users');
  
  const tabs = [
    { id: 'users', label: 'Пользователи' },
    { id: 'properties', label: 'Объекты' },
    { id: 'system', label: 'Система' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'users' && <UsersTab userId={userId} />}
        {activeTab === 'properties' && <PropertiesTab userId={userId} />}
        {activeTab === 'system' && <SystemTab userId={userId} />}
      </div>
    </div>
  );
};

export default AdminTabs; 