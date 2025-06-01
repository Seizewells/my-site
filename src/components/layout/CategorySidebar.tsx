import React from 'react';
import { ChevronRight, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке категорий');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShowAll = () => {
    if (onSelectCategory) {
      onSelectCategory('');
      onClose();
      scrollToCatalog();
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
      onClose();
      scrollToCatalog();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <aside 
        className={`
          fixed md:sticky top-[80px] left-0 h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] z-40 md:z-10
          w-64 md:w-full bg-white shadow-lg md:shadow-none 
          transition-all duration-300 ease-in-out transform
          overflow-y-auto overscroll-contain
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="sticky top-0 p-3 md:py-2 md:px-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="flex justify-between items-center md:hidden">
            <h2 className="font-semibold text-gray-800">Категории товаров</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <h2 className="hidden md:block font-semibold text-gray-800">Категории</h2>
        </div>
        
        <nav className="p-1 pb-safe relative">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Загрузка категорий...</div>
          ) : error ? (
            <div className="p-3 bg-red-50 text-red-500 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            </div>
          ) : (
          <ul>
            <li>
              <button
                onClick={handleShowAll}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-white bg-black/90 hover:bg-gray-800 transition-colors text-sm font-medium w-full sticky top-[48px] z-10 shadow-md backdrop-blur-sm"
              >
                <span>Показать все</span>
                <ChevronRight size={16} className="text-white" />
              </button>
            </li>
            {categories.length > 0 ? categories.map((category) => (
              <li key={category.id}>
                <button 
                  onClick={() => handleCategoryClick(category.slug)}
                  className="flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                >
                  <span>{category.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </li>
            )) : (
              <li className="p-3 text-center text-gray-500">
                Нет доступных категорий
              </li>
            )}
          </ul>
          )}
        </nav>
      </aside>
    </>
  );
};

export default CategorySidebar;