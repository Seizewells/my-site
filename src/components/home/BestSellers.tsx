import React, { useState, useEffect } from 'react';
import ProductCard from '../shared/ProductCard';
import { Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { AlertCircle } from 'lucide-react';

interface BestSellersProps {
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({ onAddToCart, onAddToFavorites }) => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .order('rating', { ascending: false })
          .limit(8);

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

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">Загрузка хитов продаж...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (bestSellers.length === 0) {
    return null;
  }

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