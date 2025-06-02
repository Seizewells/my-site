import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface AuthButtonProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isAuthenticated, userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <LogIn size={20} />
        <span className="hidden md:inline">Войти</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <User size={20} />
        <span className="hidden md:inline">{userEmail}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-40"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Мой профиль
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthButton;