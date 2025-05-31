import React, { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/shared/LoadingSpinner';
import AdminBar from './components/admin/AdminBar';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Product, CartItem } from './types';
import { checkAdminStatus, supabase } from './lib/supabase';

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | undefined>();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [favorites, setFavorites] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const checkAdmin = async () => {
      const isAdminUser = await checkAdminStatus();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(isAdminUser);
      setUserEmail(session?.user?.email);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const isAdminUser = await checkAdminStatus();
        setIsAdmin(isAdminUser);
        setUserEmail(session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserEmail(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserEmail(undefined);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity === 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleToggleFavorite = (product: Product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(item => item.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(item => item.id !== product.id);
      }
      return [...prevFavorites, product];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <BrowserRouter>
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.5 }
              }} 
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <Routes>
                <Route path="/" element={
                  <HomePage 
                    cartItems={cartItems}
                    favorites={favorites}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isAdmin={isAdmin}
                    userEmail={userEmail}
                    onLogout={handleLogout}
                  />
                } />
                <Route path="/about" element={
                  <AboutPage 
                    isAdmin={isAdmin} 
                    userEmail={userEmail} 
                    onLogout={handleLogout}
                  />
                } />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/cart" element={
                  <CartPage 
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                } />
                <Route path="/favorites" element={
                  <FavoritesPage 
                    favorites={favorites}
                    onAddToCart={handleAddToCart}
                    onRemoveFromFavorites={handleToggleFavorite}
                  />
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
              </Routes>
              {isAdmin && <AdminBar />}
            </motion.div>
          )}
        </BrowserRouter>
      </AnimatePresence>
    </div>
  );
}

export default App;