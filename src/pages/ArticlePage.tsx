import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Article } from '../types';
import { AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ReactMarkdown from 'react-markdown';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
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
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Статья не найдена');
        
        setArticle(data);
      } catch (err) {
        console.error('Ошибка при загрузке статьи:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке статьи');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItems={[]} favoritesCount={0} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">Загрузка статьи...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItems={[]} favoritesCount={0} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-500 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              {error || 'Статья не найдена'}
            </div>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Вернуться к списку статей
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItems={[]} favoritesCount={0} />
      
      <main className="flex-grow">
        {article.image_url && (
          <div className="w-full h-[400px] relative">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center px-4">
                {article.title}
              </h1>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!article.image_url && (
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>
            )}
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
              {article.author?.username && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.author.username}</span>
                </>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            <div className="mt-8 pt-8 border-t">
              <button
                onClick={() => navigate('/blog')}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Вернуться к списку статей
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;