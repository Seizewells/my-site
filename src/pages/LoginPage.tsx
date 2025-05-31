import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { AlertCircle, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const { state } = window.history.state || {};
    if (state?.message) {
      setSuccess(state.message);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Неверный email или пароль');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email не подтвержден. Пожалуйста, проверьте вашу почту.');
        }
        throw error;
      }

      if (!session) {
        throw new Error('Ошибка входа: сессия не создана');
      }

      // После успешного входа перенаправляем на главную
      navigate('/');
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
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
            Вход в аккаунт
          </h1>
          
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
              {success}
            </div>
          )}
          
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
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
            >
              <span className="inline-flex items-center">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </span>
            </button>
            
            <div className="text-center">
              <span className="text-gray-600">Нет аккаунта?</span>{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;