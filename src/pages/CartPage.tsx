import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CartItem } from '../types';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveFromCart }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItems={cartItems} favoritesCount={0} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
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
      <Header cartItems={cartItems} favoritesCount={0} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Корзина</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {item.price.toLocaleString()} ₽
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(Number(item.id), Math.max(0, item.quantity - 1))}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(Number(item.id), item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(Number(item.id))}
                        className="p-1 rounded-md hover:bg-gray-100 ml-4"
                      >
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Итого</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Товары ({cartItems.length})</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>К оплате</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-md mt-6 hover:bg-blue-700 transition-colors">
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;