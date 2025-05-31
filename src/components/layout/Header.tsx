import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import { CartItem } from '../../types';

interface HeaderProps {
  cartItems: CartItem[];
  favoritesCount: number;
  isAdmin: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItems, favoritesCount, isAdmin, userEmail, onLogout }) => {
  return (
    <div className="sticky top-0 z-30">
      <TopBar />
      <MainHeader 
        cartItems={cartItems} 
        favoritesCount={favoritesCount} 
        isAdmin={isAdmin}
        userEmail={userEmail}
        onLogout={onLogout}
      />
    </div>
  );
};

export default Header;