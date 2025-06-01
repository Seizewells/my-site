import React from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onEdit: (review: Review) => Promise<void>;
  onDelete: (reviewId: number) => Promise<void>;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {review.profiles?.username || 'Пользователь'}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                  locale: ru
                })}
              </div>
            </div>
            
            {currentUserId === review.user_id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(review)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
          
          <p className="mt-2 text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList