import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, User, UserCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  isAdmin: boolean;
  userEmail?: string;
  onLogout: () => void;
}

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ isAdmin, userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .single();
      
      if (data) {
        setProfile(data);
      }
    };
    
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.display_name || userEmail} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} />
          )}
        </div>
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
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{profile?.display_name || 'Пользователь'}</div>
                  <div className="text-xs text-gray-500">{userEmail}</div>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <UserCircle size={16} className="mr-2" />
                  Мой профиль
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings size={16} className="mr-2" />
                    Панель управления
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
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

export default UserMenu;