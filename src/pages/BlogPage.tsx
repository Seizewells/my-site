import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: 'Как выбрать идеальную ванну: полное руководство',
    image: 'https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg',
    excerpt: 'Подробное руководство по выбору ванны с учетом размера помещения, материала и стиля интерьера.',
    date: '15 марта 2025',
    readTime: '8 мин'
  },
  {
    id: 2,
    title: 'Тренды в дизайне ванных комнат 2025',
    image: 'https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg',
    excerpt: 'Обзор последних тенденций в оформлении ванных комнат: цвета, материалы, планировки.',
    date: '10 марта 2025',
    readTime: '6 мин'
  },
  {
    id: 3,
    title: 'Экономия воды: современные технологии',
    image: 'https://images.pexels.com/photos/6585753/pexels-photo-6585753.jpeg',
    excerpt: 'Как современные технологии помогают экономить воду без ущерба комфорту.',
    date: '5 марта 2025',
    readTime: '5 мин'
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItems={[]} favoritesCount={0} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Блог</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <motion.article
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <a
                    href={`/blog/${article.id}`}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Читать далее →
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;