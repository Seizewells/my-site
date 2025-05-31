import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItems={[]} favoritesCount={0} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">О компании SHM AQUA DEKOR</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <img
                src="https://images.pexels.com/photos/3288102/pexels-photo-3288102.jpeg"
                alt="Наш шоурум"
                className="rounded-lg shadow-lg w-full h-[300px] object-cover"
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ваш надежный партнер с 2010 года</h2>
              <p className="text-gray-600 mb-4">
                SHM AQUA DEKOR - это ведущий поставщик сантехники и товаров для дома в России. 
                Мы специализируемся на продаже высококачественной продукции от лучших мировых производителей.
              </p>
              <p className="text-gray-600">
                Наша миссия - делать качественную сантехнику доступной для каждого дома, 
                предоставляя профессиональную консультацию и безупречный сервис.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">15+ лет опыта</h3>
              <p className="text-gray-600">Более 15 лет успешной работы на рынке сантехники и товаров для дома</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">50,000+ клиентов</h3>
              <p className="text-gray-600">Тысячи довольных клиентов по всей России выбирают нас</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">100% гарантия</h3>
              <p className="text-gray-600">Гарантия качества на все товары и профессиональная поддержка</p>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Почему выбирают нас</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Широкий ассортимент</h3>
                <p className="text-gray-600">Более 10,000 наименований товаров в наличии</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Профессиональная консультация</h3>
                <p className="text-gray-600">Опытные специалисты помогут с выбором</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Быстрая доставка</h3>
                <p className="text-gray-600">Доставка по всей России в кратчайшие сроки</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Гарантия качества</h3>
                <p className="text-gray-600">Только сертифицированная продукция</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;