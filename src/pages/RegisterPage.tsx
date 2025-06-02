import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting registration process...');
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      console.log('Password validation failed: passwords do not match');
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up with Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log('Supabase signUp response:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          emailConfirmedAt: data.user.email_confirmed_at,
          userMetadata: data.user.user_metadata
        } : null,
        session: data.session ? 'Session exists' : 'No session',
        error
      });

      if (error) throw error;
      
      console.log('Registration successful, redirecting to login...');
      // После успешной регистрации показываем сообщение о необходимости подтверждения email
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Пожалуйста, проверьте вашу почту и подтвердите email перед входом в систему.' } 
      });

    } catch (err) {
      console.error('Detailed registration error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });

      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setError('Пользователь с таким email уже существует');
        } else {
          setError(err.message);
        }
      } else {
        setError('Произошла ошибка при регистрации');
      }
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
            Регистрация
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            
            <div className="text-center">
              <span className="text-gray-600">Уже есть аккаунт?</span>{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage