import React, { useState } from 'react';
import { Settings, X, Plus, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from './ProductForm';
import { Product } from '../../types';

interface AdminBarProps {
  onProductUpdate?: () => void;
  currentProduct?: Product;
}

const AdminBar: React.FC<AdminBarProps> = ({ onProductUpdate, currentProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <Settings size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Панель управления</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {currentProduct ? (
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={18} />
                    Редактировать товар
                  </button>
                ) : (
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    Добавить товар
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentProduct ? 'Редактировать товар' : 'Добавить товар'}
            </h2>
            <ProductForm
              product={currentProduct}
              onSubmit={() => {
                setShowProductForm(false);
                if (onProductUpdate) onProductUpdate();
              }}
              onCancel={() => setShowProductForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBar;