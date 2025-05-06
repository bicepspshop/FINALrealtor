'use client';

import { useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Search, ArrowDown, ArrowUp } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  subscription_end_date: string | null;
  is_admin: boolean;
  created_at: string;
};

type UsersTabProps = {
  userId: string;
};

const UsersTab = ({ userId }: UsersTabProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof User>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const supabase = getBrowserClient();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, subscription_status, subscription_end_date, is_admin, created_at')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: isAdmin } : user
      ));
      
      toast.success(`Права администратора ${isAdmin ? 'предоставлены' : 'удалены'}`);
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast.error('Не удалось обновить статус администратора');
    }
  };
  
  const extendSubscription = async (userId: string, days: number) => {
    try {
      const { data, error } = await supabase.rpc('extend_user_subscription', { 
        user_id_param: userId, 
        days_to_add: days 
      });
      
      if (error) throw error;
      
      // Refresh user data after update
      fetchUsers();
      toast.success(`Подписка продлена на ${days} дней`);
    } catch (error) {
      console.error('Error extending subscription:', error);
      toast.error('Не удалось продлить подписку');
    }
  };
  
  const cancelSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          subscription_status: 'cancelled',
          subscription_end_date: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Refresh user data after update
      fetchUsers();
      toast.success('Подписка отменена');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Не удалось отменить подписку');
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.subscription_status?.toLowerCase().includes(query)
    );
  });
  
  // Handle sorting
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const renderSortIndicator = (field: keyof User) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Управление пользователями</h2>
      
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск пользователей..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Имя</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('email')}>
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {renderSortIndicator('email')}
                </div>
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('subscription_status')}>
                <div className="flex items-center space-x-1">
                  <span>Статус подписки</span>
                  {renderSortIndicator('subscription_status')}
                </div>
              </th>
              <th className="px-4 py-2">Администратор</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">Загрузка...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">Пользователи не найдены</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{user.name || '—'}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscription_status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      user.subscription_status === 'trial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {user.subscription_status === 'active' ? 'Активна' :
                       user.subscription_status === 'trial' ? 'Пробный период' :
                       user.subscription_status === 'expired' ? 'Истекла' : 
                       user.subscription_status}
                    </span>
                    {user.subscription_end_date && (
                      <span className="ml-2 text-xs text-gray-500">
                        до {new Date(user.subscription_end_date).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="checkbox" 
                      checked={user.is_admin || false}
                      onChange={() => updateUserAdmin(user.id, !user.is_admin)}
                      disabled={user.id === userId} // Don't allow changing your own admin status
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => extendSubscription(user.id, 30)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        +30 дней
                      </button>
                      <button
                        onClick={() => extendSubscription(user.id, 365)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        +1 год
                      </button>
                      {user.subscription_status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (confirm('Вы уверены, что хотите отменить подписку этого пользователя?')) {
                              cancelSubscription(user.id);
                            }
                          }}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab; 