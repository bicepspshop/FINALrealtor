'use client';

import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { PlaySquare, Info, RefreshCw, Activity, AlertTriangle } from 'lucide-react';

type SystemTabProps = {
  userId: string;
};

const SystemTab = ({ userId }: SystemTabProps) => {
  const [actionResult, setActionResult] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  const supabase = getBrowserClient();

  const runAdminAction = async (action: string) => {
    setIsLoading(true);
    setActiveAction(action);
    setActionResult(null);
    
    try {
      let result;
      
      switch (action) {
        case 'update_expired_trials':
          // Update expired trials
          const response = await fetch('/api/update-expired-trials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_id: userId })
          });
          
          result = await response.json();
          break;
          
        case 'convert_trials_to_expired':
          // Convert all trial users to expired
          const { error: trialUpdateError, data: trialUpdateData, count: trialUpdateCount } = await supabase
            .from('users')
            .update({ subscription_status: 'expired' })
            .eq('subscription_status', 'trial')
            .select('id, email');
            
          result = {
            success: !trialUpdateError,
            updated: trialUpdateCount || 0,
            error: trialUpdateError,
            users: trialUpdateData || []
          };
          break;
          
        case 'convert_expired_to_trials':
          // Get current timestamp
          const now = new Date();
          // Set trial to 7 days by default
          const trialDuration = 10080; // 7 days in minutes
          
          // Convert all expired users to trial
          const { error: expiredUpdateError, data: expiredUpdateData, count: expiredUpdateCount } = await supabase
            .from('users')
            .update({ 
              subscription_status: 'trial',
              trial_start_time: now.toISOString(),
              trial_duration_minutes: trialDuration
            })
            .eq('subscription_status', 'expired')
            .select('id, email');
            
          result = {
            success: !expiredUpdateError,
            updated: expiredUpdateCount || 0,
            error: expiredUpdateError,
            users: expiredUpdateData || []
          };
          break;
          
        case 'get_system_stats':
          // Get system statistics
          const [usersResult, propertiesResult, paymentsResult] = await Promise.all([
            supabase.from('users').select('subscription_status').then(res => res.data),
            supabase.from('properties').select('property_status').then(res => res.data),
            supabase.from('payments').select('status, amount').then(res => res.data),
          ]);
          
          // Process user stats
          const userStats = {
            total: usersResult?.length || 0,
            active: usersResult?.filter(u => u.subscription_status === 'active').length || 0,
            trial: usersResult?.filter(u => u.subscription_status === 'trial').length || 0,
            expired: usersResult?.filter(u => u.subscription_status === 'expired').length || 0,
          };
          
          // Process property stats
          const propertyStats = {
            total: propertiesResult?.length || 0,
            available: propertiesResult?.filter(p => p.property_status === 'available').length || 0,
            sold: propertiesResult?.filter(p => p.property_status === 'sold').length || 0,
            reserved: propertiesResult?.filter(p => p.property_status === 'reserved').length || 0,
          };
          
          // Process payment stats
          const successfulPayments = paymentsResult?.filter(p => p.status === 'succeeded') || [];
          const paymentsStats = {
            total: paymentsResult?.length || 0,
            succeeded: successfulPayments.length,
            totalRevenue: successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
          };
          
          result = {
            users: userStats,
            properties: propertyStats,
            payments: paymentsStats,
            timestamp: new Date().toISOString(),
          };
          break;
          
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      setActionResult(result);
    } catch (error) {
      console.error(`Error executing admin action (${action}):`, error);
      setActionResult({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Системное управление</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Update expired trials */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start">
            <PlaySquare className="text-indigo-500 mr-3 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Обновить истекшие пробные периоды</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Обновляет статусы пользователей с истекшими пробными периодами на "expired"
              </p>
              <button
                onClick={() => runAdminAction('update_expired_trials')}
                disabled={isLoading && activeAction === 'update_expired_trials'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading && activeAction === 'update_expired_trials' ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Выполняется...
                  </span>
                ) : 'Выполнить'}
              </button>
            </div>
          </div>
          
          {activeAction === 'update_expired_trials' && actionResult && (
            <div className="mt-3 text-sm border-t pt-3 border-gray-200 dark:border-gray-700">
              <div className="font-medium">Результат:</div>
              <pre className="mt-1 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                {JSON.stringify(actionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {/* Convert trials to expired */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="text-orange-500 mr-3 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Сделать все пробные периоды истекшими</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Изменит статус всех пользователей с 'trial' на 'expired'
              </p>
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите завершить все пробные периоды? Это прервет доступ для всех пользователей с пробным периодом.')) {
                    runAdminAction('convert_trials_to_expired');
                  }
                }}
                disabled={isLoading && activeAction === 'convert_trials_to_expired'}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading && activeAction === 'convert_trials_to_expired' ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Выполняется...
                  </span>
                ) : 'Выполнить'}
              </button>
            </div>
          </div>
          
          {activeAction === 'convert_trials_to_expired' && actionResult && (
            <div className="mt-3 text-sm border-t pt-3 border-gray-200 dark:border-gray-700">
              <div className="font-medium">Результат:</div>
              <pre className="mt-1 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                {JSON.stringify(actionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {/* Convert expired to trials */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start">
            <PlaySquare className="text-green-500 mr-3 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Активировать пробный период для всех</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Изменит статус всех пользователей с 'expired' на 'trial' и даст 7 дней пробного периода
              </p>
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите активировать пробный период для всех пользователей с истекшим доступом?')) {
                    runAdminAction('convert_expired_to_trials');
                  }
                }}
                disabled={isLoading && activeAction === 'convert_expired_to_trials'}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading && activeAction === 'convert_expired_to_trials' ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Выполняется...
                  </span>
                ) : 'Выполнить'}
              </button>
            </div>
          </div>
          
          {activeAction === 'convert_expired_to_trials' && actionResult && (
            <div className="mt-3 text-sm border-t pt-3 border-gray-200 dark:border-gray-700">
              <div className="font-medium">Результат:</div>
              <pre className="mt-1 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                {JSON.stringify(actionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {/* System statistics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start">
            <Activity className="text-green-500 mr-3 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Статистика системы</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Отображает основные статистические данные о пользователях, объектах и платежах
              </p>
              <button
                onClick={() => runAdminAction('get_system_stats')}
                disabled={isLoading && activeAction === 'get_system_stats'}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading && activeAction === 'get_system_stats' ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Загрузка...
                  </span>
                ) : 'Показать статистику'}
              </button>
            </div>
          </div>
          
          {activeAction === 'get_system_stats' && actionResult && (
            <div className="mt-3 text-sm border-t pt-3 border-gray-200 dark:border-gray-700">
              <div className="font-medium mb-2">Статистика системы:</div>
              
              {actionResult.users && (
                <div className="mb-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300">Пользователи:</div>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
                      <div className="text-xs text-blue-600 dark:text-blue-300">Всего</div>
                      <div className="font-bold text-blue-800 dark:text-blue-200">{actionResult.users.total}</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
                      <div className="text-xs text-green-600 dark:text-green-300">Активных</div>
                      <div className="font-bold text-green-800 dark:text-green-200">{actionResult.users.active}</div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded text-center">
                      <div className="text-xs text-yellow-600 dark:text-yellow-300">Пробный</div>
                      <div className="font-bold text-yellow-800 dark:text-yellow-200">{actionResult.users.trial}</div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded text-center">
                      <div className="text-xs text-red-600 dark:text-red-300">Истекших</div>
                      <div className="font-bold text-red-800 dark:text-red-200">{actionResult.users.expired}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {actionResult.properties && (
                <div className="mb-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300">Объекты:</div>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
                      <div className="text-xs text-blue-600 dark:text-blue-300">Всего</div>
                      <div className="font-bold text-blue-800 dark:text-blue-200">{actionResult.properties.total}</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
                      <div className="text-xs text-green-600 dark:text-green-300">Доступных</div>
                      <div className="font-bold text-green-800 dark:text-green-200">{actionResult.properties.available}</div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded text-center">
                      <div className="text-xs text-yellow-600 dark:text-yellow-300">Зарезер.</div>
                      <div className="font-bold text-yellow-800 dark:text-yellow-200">{actionResult.properties.reserved}</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded text-center">
                      <div className="text-xs text-purple-600 dark:text-purple-300">Проданных</div>
                      <div className="font-bold text-purple-800 dark:text-purple-200">{actionResult.properties.sold}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {actionResult.payments && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Платежи:</div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
                      <div className="text-xs text-blue-600 dark:text-blue-300">Всего</div>
                      <div className="font-bold text-blue-800 dark:text-blue-200">{actionResult.payments.total}</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
                      <div className="text-xs text-green-600 dark:text-green-300">Успешных</div>
                      <div className="font-bold text-green-800 dark:text-green-200">{actionResult.payments.succeeded}</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded text-center">
                      <div className="text-xs text-purple-600 dark:text-purple-300">Доход</div>
                      <div className="font-bold text-purple-800 dark:text-purple-200">
                        {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(actionResult.payments.totalRevenue || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-3">
                Обновлено: {new Date(actionResult.timestamp).toLocaleString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemTab; 