import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="hidden md:block bg-gray-100 py-2 border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-6 text-sm">
          <a href="mailto:info@shmaquadekor.com" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Mail size={14} className="mr-1" />
            <span>info@shmaquadekor.com</span>
          </a>
          <a href="tel:+78001234567" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Phone size={14} className="mr-1" />
            <span>8 (800) 123-45-67</span>
          </a>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className="mr-1" />
          <span>Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;