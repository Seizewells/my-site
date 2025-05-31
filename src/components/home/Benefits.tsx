import React from 'react';
import { Truck, CreditCard, RefreshCcw, Clock } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      id: 1,
      icon: <Truck className="w-10 h-10 text-blue-600" />,
      title: 'Бесплатная доставка',
      description: 'При заказе от 5000 ₽'
    },
    {
      id: 2,
      icon: <CreditCard className="w-10 h-10 text-blue-600" />,
      title: 'Удобная оплата',
      description: 'Картой или наличными'
    },
    {
      id: 3,
      icon: <RefreshCcw className="w-10 h-10 text-blue-600" />,
      title: 'Возврат и обмен',
      description: 'В течение 14 дней'
    },
    {
      id: 4,
      icon: <Clock className="w-10 h-10 text-blue-600" />,
      title: 'Поддержка 24/7',
      description: 'Ответим на все вопросы'
    }
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {benefits.map((benefit) => (
          <div 
            key={benefit.id} 
            className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3">{benefit.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;