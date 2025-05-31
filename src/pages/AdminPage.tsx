import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingBag, Settings, LogOut, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductList from '../components/admin/ProductList';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Панель администратора
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} className="mr-2" />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                  activeTab === 'products'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package size={20} className="mr-3" />
                Товары
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                  activeTab === 'articles'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText size={20} className="mr-3" />
                Статьи
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag size={20} className="mr-3" />
                Заказы
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                  activeTab === 'users'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users size={20} className="mr-3" />
                Пользователи
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2 rounded-md text-left ${
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={20} className="mr-3" />
                Настройки
              </button>
            </nav>
          </div>

          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow p-6"
            >
              {activeTab === 'products' && (
                <ProductList />
              )}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Управление заказами</h2>
                  {/* Здесь будет компонент управления заказами */}
                </div>
              )}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
                  {/* Здесь будет компонент управления пользователями */}
                </div>
              )}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Настройки</h2>
                  {/* Здесь будет компонент настроек */}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;