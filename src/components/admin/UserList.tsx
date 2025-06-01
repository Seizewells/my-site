import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Shield, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  is_admin: boolean;
  created_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      console.error('Ошибка при обновлении статуса администратора:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса администратора');
    }
  };

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return (
    <div className="bg-red-50 text-red-500 p-3 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username || 'Аватар'}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {(user.username || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username || 'Без имени'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.full_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_admin
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.is_admin ? 'Администратор' : 'Пользователь'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.created_at), 'dd MMM yyyy', { locale: ru })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                      user.is_admin
                        ? 'border-red-300 text-red-700 hover:bg-red-50'
                        : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {user.is_admin ? (
                      <>
                        <ShieldOff size={16} className="mr-1" />
                        Снять права админа
                      </>
                    ) : (
                      <>
                        <Shield size={16} className="mr-1" />
                        Сделать админом
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;