import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, Settings } from 'lucide-react';
import { CartItem } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import AuthButton from '../auth/AuthButton';

interface MainHeaderProps {
  cartItems: CartItem[];
  favoritesCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ 
  cartItems, 
  favoritesCount, 
  isAuthenticated,
  isAdmin, 
  userEmail, 
  onLogout 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                SHM <span className="text-teal-600">AQUA</span> <span className="text-gray-800">DEKOR</span>
              </Link>
              <span className="text-xs text-gray-600 -mt-1">Сантехника и товары для дома</span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-grow mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-blue-800 hover:text-blue-900 transition-all hover:glow-blue font-medium">
              О нас
            </Link>
            <Link to="/blog" className="text-blue-800 hover:text-blue-900 transition-all hover:glow-blue font-medium">Блог</Link>
            <Link to="/favorites" className="relative text-blue-800 hover:text-blue-900 transition-all hover:glow-blue">
              <Heart size={22} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-blue-800 hover:text-blue-900 transition-all hover:glow-blue">
              <ShoppingCart size={22} />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <AuthButton 
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              onLogout={onLogout}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4 text-gray-600">
              <ShoppingCart size={22} />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)} 
              className="text-gray-600 focus:outline-none"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-blue-800 hover:text-blue-900 transition-colors py-2 border-b border-gray-100 font-medium">О нас</Link>
              <Link to="/blog" className="text-blue-800 hover:text-blue-900 transition-colors py-2 border-b border-gray-100 font-medium">Блог</Link>
              <Link to="/favorites" className="flex justify-between items-center text-blue-800 hover:text-blue-900 transition-colors py-2 border-b border-gray-100">
                <span>Избранное</span>
                {favoritesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <AuthButton 
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                onLogout={onLogout}
              />
              <Link to="/admin/login" className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-md">
                <Settings size={18} />
                <span>Админ панель</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;