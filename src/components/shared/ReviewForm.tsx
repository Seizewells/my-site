import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onSubmit: (rating: number, text: string) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, text);
      setRating(0);
      setText('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Оценка
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`${
                  value <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Отзыв
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Поделитесь своими впечатлениями о товаре..."
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
};

export default ReviewForm