import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { AlertCircle, Camera } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  wallet_balance: number;
  total_spent: number;
  viewed_products: Array<{id: string, viewed_at: string}>;
  cart_items: Array<CartItem>;
  favorite_items: Array<Product>;
  is_admin: boolean;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_profile');

      if (error) throw error;

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке профиля');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSuccess(true);
      await loadProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItems={[]} favoritesCount={0} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Мой профиль</h1>

            {error && (
              <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-md">
                Профиль успешно обновлен
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фото профиля
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Аватар" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera size={32} className="text-gray-400" />
                        )}
                      </div>
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="URL изображения"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Как к вам обращаться?"
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white py-2 rounded-md transition-colors ${
                      loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </form>
              </div>

              {/* Статистика */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Статистика</h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Баланс кошелька</span>
                      <div className="text-2xl font-bold text-gray-900">
                        <span className="text-xs text-gray-500 mr-1">{profile?.is_admin ? '(Админ)' : ''}</span>
                        {profile?.wallet_balance?.toLocaleString() || 0} ₽
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Потрачено всего</span>
                      <div className="text-2xl font-bold text-gray-900">
                        {profile?.total_spent?.toLocaleString() || 0} ₽
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Недавно просмотренные</h2>
                  {profile?.viewed_products?.length ? (
                    <div className="space-y-2">
                      {profile.viewed_products.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.id}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.viewed_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Нет просмотренных товаров</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;