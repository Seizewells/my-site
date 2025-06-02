import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import CategorySidebar from '../components/layout/CategorySidebar';
import HeroSlider from '../components/home/HeroSlider';
import BestSellersSlider from '../components/home/BestSellersSlider';
import BestSellers from '../components/home/BestSellers';
import ProductCatalog from '../components/home/ProductCatalog';
import Footer from '../components/layout/Footer';
import MarqueeText from '../components/shared/MarqueeText';
import ProductModal from '../components/shared/ProductModal';
import { Product, CartItem } from '../types';
import { Menu, ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 0.6
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

interface HomePageProps {
  cartItems: CartItem[];
  favorites: Product[];
  isAuthenticated: boolean;
  currentUserId?: string;
  isAdmin: boolean;
  userEmail?: string;
  onLogout: () => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  cartItems,
  favorites,
  isAuthenticated,
  currentUserId,
  isAdmin,
  userEmail,
  onLogout,
  onAddToCart,
  onToggleFavorite,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Получаем все товары
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(slug)')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Получаем хиты продаж
        const { data: bestsellersData, error: bestsellersError } = await supabase
          .from('products')
          .select('*, categories(slug)')
          .eq('is_bestseller', true)
          .limit(4);

        if (bestsellersError) throw bestsellersError;

        setProducts(productsData || []);
        setBestSellers(bestsellersData || []);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке товаров');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(product => 
      product.categories?.slug === selectedCategory
    );
  }, [products, selectedCategory]);

  const bestSeller = bestSellers[0];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        cartItems={cartItems} 
        favoritesCount={favorites.length}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <MarqueeText />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row">
            {/* Mobile Category Toggle */}
            <div className="md:hidden mb-4">
              <button 
                onClick={() => setShowMobileSidebar(true)}
                className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm text-gray-700"
              >
                <Menu size={20} className="mr-2" />
                <span>Категории</span>
              </button>
            </div>
            
            {/* Sidebar - Hidden on mobile unless toggled */}
            <div className="md:w-1/5 md:pr-4 mb-6 md:mb-0">
              <CategorySidebar 
                isOpen={showMobileSidebar} 
                onClose={() => setShowMobileSidebar(false)} 
                onSelectCategory={handleCategorySelect}
              />
            </div>
            
            {/* Main Content */}
            <motion.div
              className="md:w-[85%]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
              whileInView="visible"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <motion.div className="lg:col-span-2 w-full" variants={itemVariants}>
                  <HeroSlider />
                </motion.div>
                <motion.div variants={itemVariants} className="hidden lg:block flex items-center h-[450px] w-full">
                  {bestSeller && (
                    <div className="bg-gray-900 rounded-lg overflow-hidden relative border border-gray-700 transition-all cursor-pointer shadow-sm hover:shadow-md h-full">
                      <div className="p-2 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-gray-100">Товар дня</h2>
                      </div>
                      <div 
                        className="p-3 flex flex-col h-[calc(100%-48px)] cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(bestSeller);
                          setIsModalOpen(true);
                        }}
                      >
                        <span className="text-xs text-gray-500 block mb-2">Артикул: {bestSeller.id}</span>
                        <div className="relative h-[250px] mb-4">
                          <img
                            src={bestSeller.image_url || ''}
                            alt={bestSeller.name}
                            className="w-full h-full object-cover rounded object-center"
                          />
                          {bestSeller.old_price && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{Math.round(((bestSeller.old_price - bestSeller.price) / bestSeller.old_price) * 100)}%
                            </div>
                          )}
                          <button 
                            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(bestSeller);
                            }}
                          >
                            <Heart size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        <div className="flex flex-col justify-between flex-grow">
                          <h3 className="font-medium text-gray-100 mb-2 line-clamp-2 text-sm">{bestSeller.name}</h3>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < Math.floor(bestSeller.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : i < bestSeller.rating
                                      ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                      : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">{bestSeller.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between items-end mt-auto">
                            <div>
                              <div className="text-base font-bold text-gray-100">{bestSeller.price.toLocaleString()} ₽</div>
                              {bestSeller.old_price && (
                                <div className="text-sm text-white/70 line-through">
                                  {bestSeller.old_price.toLocaleString()} ₽
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(bestSeller);
                              }}
                              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              <ShoppingCart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants}>
                <BestSellersSlider 
                  onAddToCart={onAddToCart}
                  onAddToFavorites={onToggleFavorite}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ProductCatalog 
                  onAddToCart={onAddToCart}
                  onAddToFavorites={onToggleFavorite}
                  products={filteredProducts}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      <>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddToCart={onAddToCart}
            onAddToFavorites={onToggleFavorite}
            isAuthenticated={isAuthenticated}
            currentUserId={currentUserId}
          />
        )}
        {isAdmin && selectedProduct && (
          <AdminBar
            currentProduct={selectedProduct}
            onProductUpdate={() => {
              // Обновляем список товаров после изменений
              window.location.reload();
            }}
          />
        )}
      </>
    </div>
  );
};

export default HomePage;