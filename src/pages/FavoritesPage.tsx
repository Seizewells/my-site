import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Product } from '../types';
import { motion } from 'framer-motion';
import ProductCard from '../components/shared/ProductCard';

interface FavoritesPageProps {
  favorites: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromFavorites: (product: Product) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  favorites, 
  onAddToCart, 
  onRemoveFromFavorites 
}) => {
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItems={[]} favoritesCount={0} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Список избранного пуст</h1>
            <p className="text-gray-600 mb-8">Добавьте товары в избранное, чтобы сохранить их на потом</p>
            <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Перейти к покупкам
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItems={[]} favoritesCount={favorites.length} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Избранное</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToFavorites={onRemoveFromFavorites}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;