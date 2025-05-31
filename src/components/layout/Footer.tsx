import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SHM AQUA DEKOR</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Качественная сантехника и товары для дома от ведущих производителей.
              Гарантия качества и лучшие цены.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Категории</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Сантехника</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Ванны</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Душевые кабины</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Смесители</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Мебель для ванной</a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">О компании</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Доставка и оплата</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Возврат и обмен</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Блог</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Контакты</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">8 (800) 123-45-67</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">info@shmaquadekor.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">г. Москва, ул. Примерная, д. 123</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 SHM AQUA DEKOR. Все права защищены.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;