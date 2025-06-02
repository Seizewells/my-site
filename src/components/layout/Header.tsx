import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import { CartItem } from '../../types';

interface HeaderProps {
  cartItems: CartItem[];
  favoritesCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItems, 
  favoritesCount, 
  isAuthenticated,
  isAdmin, 
  userEmail, 
  onLogout 
}) => {
  return (
    <div className="sticky top-0 z-30">
      <TopBar />
      <MainHeader 
        cartItems={cartItems} 
        favoritesCount={favoritesCount} 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        userEmail={userEmail}
        onLogout={onLogout}
      />
    </div>
  );
};

export default Header;