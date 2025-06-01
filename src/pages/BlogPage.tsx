import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Article } from '../types';
import { AlertCircle } from 'lucide-react';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            author:profiles (
              username,
              avatar_url
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Ошибка при загрузке статей:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке статей');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
          
          {loading ? (
            <div className="text-center py-12">Загрузка статей...</div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <motion.article
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      {article.author?.username && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{article.author.username}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    <a
                      href={`/blog/${article.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Читать далее →
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Нет опубликованных статей</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
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