import React, { useState } from 'react';
import ProductCard from '../shared/ProductCard';
import { Product } from '../../types';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  products: Product[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart, onAddToFavorites, products }) => {
  const [sortBy, setSortBy] = useState('default');

  const getSortedProducts = () => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'new':
        return [...products].sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <div id="product-catalog" className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          {products.length > 0 ? 'Каталог товаров' : 'Товары не найдены'}
        </h2>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Сортировать:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена (по возрастанию)</option>
            <option value="price-desc">Цена (по убыванию)</option>
            <option value="rating">По рейтингу</option>
            <option value="new">Сначала новинки</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
          Загрузить еще
        </button>
      </div>
    </div>
  );
};

export default ProductCatalog;