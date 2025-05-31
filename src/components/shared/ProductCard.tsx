import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToFavorites }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg overflow-hidden relative border-2 border-black transition-all text-sm cursor-pointer shadow-sm hover:shadow-md hover:border-gray-900 flex flex-col h-[400px]"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full aspect-square object-cover"
            loading="lazy"
            decoding="async"
          />
          {product.oldPrice && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
          )}
          {product.isNew && (
            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Новинка
            </div>
          )}
          <button 
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites(product);
            }}
          >
            <Heart size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </div>
    
        <div className="p-3 flex-1 flex flex-col">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Артикул: {product.id}</span>
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
          </div>
      
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : i < product.rating 
                      ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                      : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
          </div>
      
          <div className="flex justify-between items-center mt-auto">
            <div>
              <div className="font-bold text-base sm:text-lg text-gray-900">{product.price.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-500 line-through h-5">
                {product.oldPrice ? `${product.oldPrice.toLocaleString()} ₽` : ''}
              </div>
            </div>
        
            <button 
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
        onAddToFavorites={onAddToFavorites}
      />
    </>
  );
};

export default ProductCard;