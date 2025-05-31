import React, { useState } from 'react';
import { Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { AlertCircle } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [image, setImage] = useState(product?.image || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        name,
        price: parseFloat(price),
        old_price: oldPrice ? parseFloat(oldPrice) : null,
        description,
        category,
        image,
        updated_at: new Date()
      };

      if (product?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...productData, created_at: new Date() }]);

        if (error) throw error;
      }

      onSubmit();
    } catch (err) {
      console.error('Ошибка при сохранении товара:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название товара
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Старая цена
          </label>
          <input
            type="number"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Выберите категорию</option>
          <option value="santekhnika">Сантехника</option>
          <option value="vanny">Ванны</option>
          <option value="dushevye-kabiny">Душевые кабины</option>
          <option value="smesiteli">Смесители</option>
          <option value="rakoviny">Раковины</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL изображения
        </label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;