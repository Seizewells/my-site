import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, Review } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useNavigate } from 'react-router-dom';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  reviews?: Review[];
  isAuthenticated?: boolean;
  currentUserId?: string;
  onAddReview?: (productId: string, rating: number, text: string) => Promise<void>;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
  currentUserId?: string;
  onAddReview?: (productId: string, rating: number, text: string) => Promise<void>;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToFavorites,
  reviews = [],
  isAuthenticated = false,
  currentUserId,
  onAddReview = async () => {},
  onEditReview = () => {},
  onDeleteReview = () => {}
}) => {
  const [canShare, setCanShare] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews');

  useEffect(() => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href
    };

    setCanShare(
      typeof navigator !== 'undefined' && 
      navigator.share && 
      navigator.canShare && 
      navigator.canShare(shareData)
    );
  }, [product]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canShare) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Ошибка при попытке поделиться:', error);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X size={24} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg object-cover aspect-square mb-4"
              />
              <div className="grid grid-cols-4 gap-2">
                <img src={product.image} alt="" className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80" />
                <img src={product.image} alt="" className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80" />
                <img src={product.image} alt="" className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80" />
                <img src={product.image} alt="" className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">ORZAX Ocean</span>
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">Оригинал</span>
                {canShare && (
                  <button 
                    className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={handleShare}
                  >
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : i < product.rating
                          ? 'text-yellow-400 fill-yellow-400 opacity-50'
                          : 'text-gray-300'
                    }`}
                  />
                ))}
                <button 
                  onClick={() => {
                    const reviewsSection = document.getElementById('reviews-section');
                    reviewsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  {product.rating.toFixed(1)}
                </button>
                <span className="text-gray-400 select-none">•</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('reviews');
                    navigate(`/product/${product.id}/reviews`);
                  }}
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  3200 оценок
                </button>
                <span className="text-gray-400 select-none">•</span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('questions');
                    navigate(`/product/${product.id}/questions`);
                  }}
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  443 вопроса
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Артикул:</span>
                <span className="text-xs font-medium">{product.id}</span>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {product.price.toLocaleString()} ₽
                </div>
                {product.oldPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    {product.oldPrice.toLocaleString()} ₽
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-6">{product.description}</p>

              <div className="border-t border-gray-100 py-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Описание</h3>
                <div className="text-sm text-gray-600 space-y-4">
                  <p>Современный {product.name.toLowerCase()} с улучшенными характеристиками.</p>
                  <p>Особенности:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Высокое качество материалов</li>
                    <li>Надежная конструкция</li>
                    <li>Простота установки</li>
                    <li>Длительный срок службы</li>
                  </ul>
                </div>
              </div>
              
              {product.specifications && (
                <div className="border-t border-gray-100 py-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Характеристики</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-500 w-1/3">{key}</span>
                        <span className="text-sm text-gray-900 ml-4">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart size={20} />
                  <span>В корзину</span>
                </button>
                <button
                  onClick={() => onAddToFavorites(product)}
                  className="px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                </button>
              </div>
              
              <button className="w-full mt-3 text-purple-600 font-medium py-3 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                Купить сейчас
              </button>

              {product.isNew && (
                <div className="mt-3 inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Новинка
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Отзывы
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'questions'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('questions')}
                  >
                    Вопросы
                  </button>
                </div>
                
                <div className="mt-4">
                  {activeTab === 'reviews' ? (
                    <>
                      <div className="mb-6 space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center mb-2">
                            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg\" alt="Иван\" className="w-10 h-10 rounded-full object-cover" />
                            <div className="ml-3">
                              <div className="font-medium">Иван Петров</div>
                              <div className="text-sm text-gray-500">2 дня назад</div>
                            </div>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                          <p className="text-gray-600">Отличный товар! Качество на высоте, доставка быстрая. Рекомендую всем.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center mb-2">
                            <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" alt="Анна" className="w-10 h-10 rounded-full object-cover" />
                            <div className="ml-3">
                              <div className="font-medium">Анна Иванова</div>
                              <div className="text-sm text-gray-500">неделю назад</div>
                            </div>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                          <p className="text-gray-600">Хороший товар за свои деньги. Есть небольшие недочеты, но в целом я довольна покупкой.</p>
                        </div>
                      </div>
                      {isAuthenticated ? (
                        <div className="mb-6">
                          <ReviewForm
                            productId={product.id}
                            onSubmit={onAddReview}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">
                            Чтобы оставить отзыв,{' '}
                            <button
                              onClick={() => navigate('/login')}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              войдите
                            </button>
                            {' '}в аккаунт
                          </p>
                        </div>
                      )}
                      <ReviewList
                        reviews={reviews}
                        currentUserId={currentUserId}
                        onEdit={onEditReview}
                        onDelete={onDeleteReview}
                      />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" alt="Михаил" className="w-10 h-10 rounded-full object-cover" />
                          <div className="ml-3">
                            <div className="font-medium">Михаил Сидоров</div>
                            <div className="text-sm text-gray-500">3 дня назад</div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">Подскажите, есть ли гарантия на товар?</p>
                        <div className="pl-8 border-l-2 border-gray-100">
                          <div className="flex items-center mb-2">
                            <div className="bg-blue-100 text-blue-600 p-1 rounded">
                              <span className="text-xs font-medium">Менеджер</span>
                            </div>
                            <div className="ml-2 text-sm text-gray-500">2 дня назад</div>
                          </div>
                          <p className="text-gray-600">Да, на данный товар предоставляется гарантия 2 года.</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="Елена" className="w-10 h-10 rounded-full object-cover" />
                          <div className="ml-3">
                            <div className="font-medium">Елена Козлова</div>
                            <div className="text-sm text-gray-500">неделю назад</div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">Какие сроки доставки в Москву?</p>
                        <div className="pl-8 border-l-2 border-gray-100">
                          <div className="flex items-center mb-2">
                            <div className="bg-blue-100 text-blue-600 p-1 rounded">
                              <span className="text-xs font-medium">Менеджер</span>
                            </div>
                            <div className="ml-2 text-sm text-gray-500">6 дней назад</div>
                          </div>
                          <p className="text-gray-600">Доставка по Москве осуществляется в течение 1-2 рабочих дней.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;