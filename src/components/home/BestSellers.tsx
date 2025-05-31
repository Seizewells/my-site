import React from 'react';
import ProductCard from '../shared/ProductCard';
import { getBestSellers } from '../../data/products';
import { Product } from '../../types';

interface BestSellersProps {
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({ onAddToCart, onAddToFavorites }) => {
  const bestSellers = getBestSellers();

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Хиты продаж</h2>
        <a href="/catalog" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Смотреть все
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bestSellers.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;