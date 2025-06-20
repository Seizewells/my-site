import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import ProductModal from '../shared/ProductModal';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BestSellersSliderProps {
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  isAuthenticated?: boolean;
  currentUserId?: string;
}

const BestSellersSlider: React.FC<BestSellersSliderProps> = ({ 
  onAddToCart, 
  onAddToFavorites,
  isAuthenticated,
  currentUserId
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [bestSellers, setBestSellers] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const slidesToShow = 3;
  const maxSlides = Math.ceil(bestSellers.length / slidesToShow) - 1;

  React.useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .limit(4);

        if (error) throw error;
        setBestSellers(data || []);
      } catch (err) {
        console.error('Ошибка при загрузке хитов продаж:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке хитов продаж');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);
  const nextSlide = () => {
    setCurrentSlide(current => current === maxSlides ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(current => current === 0 ? maxSlides : current - 1);
  };

  return (
    <div className="py-4 bg-white rounded-lg shadow-sm mx-auto mb-6">
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-2xl font-bold text-gray-800">Хиты продаж</h2>
        <div className="flex gap-1">
          <button
            onClick={prevSlide}
            className="p-0.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={nextSlide}
            className="p-0.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden px-2">
        <motion.div
          className="flex gap-1"
          animate={{
            x: `-${currentSlide * 100}%`
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {bestSellers.map((product) => (
            <div key={product.id} className="w-full md:w-1/3 flex-shrink-0 p-0.5">
              <div 
                className="bg-gray-900 rounded-lg overflow-hidden relative border border-gray-700 transition-all text-sm cursor-pointer shadow-sm hover:shadow-md h-[320px]"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative">
                  <img 
                    src={product.image_url || ''} 
                    alt={product.name} 
                    className="w-full aspect-square object-cover"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-white p-3 shadow-lg">
                  <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-xs">
                    {product.name}
                  </h3>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-base text-gray-900">{product.price.toLocaleString()} ₽</div>
                      <div className="text-xs text-gray-500 line-through">
                        {product.old_price ? `${product.old_price.toLocaleString()} ₽` : ''}
                      </div>
                    </div>
                    <button 
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
                {product.old_price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isAuthenticated={isAuthenticated}
          currentUserId={currentUserId}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
        />
      )}
    </div>
  );
};

export default BestSellersSlider;