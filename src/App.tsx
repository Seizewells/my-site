import React, { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/shared/LoadingSpinner';
import AdminBar from './components/admin/AdminBar';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Product, CartItem } from './types';
import { checkAdminStatus, supabase, isAuthenticated } from './lib/supabase';
import { AlertCircle } from 'lucide-react';

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
  const [isUserAuthenticated, setIsUserAuthenticated] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>();
  const [userEmail, setUserEmail] = React.useState<string | undefined>();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [favorites, setFavorites] = React.useState<Product[]>([]);
  const [cartLoading, setCartLoading] = React.useState(false);
  const [favoritesLoading, setFavoritesLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const checkAdmin = async () => {
      const isAdminUser = await checkAdminStatus();
      const userIsAuthenticated = await isAuthenticated();
      const { data: { session } } = await supabase.auth.getSession();
      
      setIsAdmin(isAdminUser);
      setIsUserAuthenticated(userIsAuthenticated);
      setCurrentUserId(session?.user?.id);
      setUserEmail(session?.user?.email);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const isAdminUser = await checkAdminStatus();
        const userIsAuthenticated = await isAuthenticated();
        
        setIsAdmin(isAdminUser);
        setIsUserAuthenticated(userIsAuthenticated);
        setCurrentUserId(session?.user?.id);
        setUserEmail(session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setIsUserAuthenticated(false);
        setCurrentUserId(undefined);
        setUserEmail(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Загрузка корзины и избранного при авторизации
  React.useEffect(() => {
    const loadUserData = async () => {
      if (!currentUserId) {
        setCartItems([]);
        setFavorites([]);
        return;
      }

      try {
        setCartLoading(true);
        setFavoritesLoading(true);

        // Загрузка корзины
        const { data: cartData, error: cartError } = await supabase
          .from('cart_items')
          .select(`
            quantity,
            products (*)
          `)
          .eq('user_id', currentUserId);

        if (cartError) throw cartError;

        const formattedCartItems = cartData
          .filter(item => item.products)
          .map(item => ({
            ...item.products,
            quantity: item.quantity
          }));

        setCartItems(formattedCartItems);

        // Загрузка избранного
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('products (*)')
          .eq('user_id', currentUserId);

        if (favoritesError) throw favoritesError;

        const formattedFavorites = favoritesData
          .filter(item => item.products)
          .map(item => item.products);

        setFavorites(formattedFavorites);
      } catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных пользователя');
      } finally {
        setCartLoading(false);
        setFavoritesLoading(false);
      }
    };

    loadUserData();
  }, [currentUserId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserEmail(undefined);
    setCartItems([]);
    setFavorites([]);
  };

  const handleAddToCart = async (product: Product) => {
    if (!currentUserId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', currentUserId)
          .eq('product_id', product.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUserId,
            product_id: product.id,
            quantity: 1
          });

        if (error) throw error;
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      });
    } catch (err) {
      console.error('Ошибка при добавлении в корзину:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении в корзину');
    }
  };

  const handleUpdateCartQuantity = async (productId: number, quantity: number) => {
    if (!currentUserId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      if (quantity === 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', currentUserId)
          .eq('product_id', productId);

        if (error) throw error;

        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', currentUserId)
          .eq('product_id', productId);

        if (error) throw error;

        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (err) {
      console.error('Ошибка при обновлении количества:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении количества');
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (!currentUserId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('product_id', productId);

      if (error) throw error;

      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (err) {
      console.error('Ошибка при удалении из корзины:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при удалении из корзины');
    }
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!currentUserId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      const isAlreadyFavorite = favorites.some(item => item.id === product.id);

      if (isAlreadyFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('product_id', product.id);

        if (error) throw error;

        setFavorites(prevFavorites => 
          prevFavorites.filter(item => item.id !== product.id)
        );
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: currentUserId,
            product_id: product.id
          });

        if (error) throw error;

        setFavorites(prevFavorites => [...prevFavorites, product]);
      }
    } catch (err) {
      console.error('Ошибка при обновлении избранного:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении избранного');
    }
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
              {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-50 text-red-500 p-3 rounded-md shadow-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                </div>
              )}

              <Routes>
                <Route path="/" element={
                  <HomePage 
                    cartItems={cartItems}
                    favorites={favorites}
                    isAuthenticated={isUserAuthenticated}
                    currentUserId={currentUserId}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isAuthenticated={isUserAuthenticated}
                    currentUserId={currentUserId}
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
                <Route path="/blog/:slug" element={<ArticlePage />} />
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
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
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