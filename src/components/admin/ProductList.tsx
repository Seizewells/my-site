import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      
      // Создаем мапу категорий для быстрого доступа
      const categoriesMap: Record<number, string> = {};
      data?.forEach(product => {
        if (product.categories) {
          categoriesMap[product.categories.id] = product.categories.name;
        }
      });
      setCategories(categoriesMap);
    } catch (err) {
      console.error('Ошибка при загрузке товаров:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadProducts();
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при удалении товара');
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setSelectedProduct(undefined);
    await loadProducts();
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return (
    <div className="bg-red-50 text-red-500 p-3 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    </div>
  );

  if (showForm) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedProduct ? 'Редактировать товар' : 'Добавить товар'}
        </h2>
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedProduct(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Управление товарами</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Добавить товар
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image_url || ''}
                      alt={product.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price?.toLocaleString()} ₽
                  </div>
                  {product.old_price && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.old_price.toLocaleString()} ₽
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {categories[product.category_id] || 'Без категории'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;