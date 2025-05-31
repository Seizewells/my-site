import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { LogIn, AlertCircle } from 'lucide-react';
import { checkAdminStatus } from '../lib/supabase';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Неверный email или пароль');
        }
        throw new Error(signInError.message);
      }

      if (!data.session?.user) {
        throw new Error('Ошибка аутентификации: сессия не создана');
      }

      const isAdmin = await checkAdminStatus();

      if (!isAdmin) {
        throw new Error('Доступ запрещен. У вас нет прав администратора.');
      }

      navigate('/admin');
    } catch (err) {
      console.error('Подробная ошибка входа:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при входе');
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Вход в панель администратора
          </h1>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <LogIn size={18} />
              Войти через профиль пользователя
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;