import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Смеситель для ванны Grohe Eurosmart',
    price: 12990,
    oldPrice: 15990,
    image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg',
    category: 'smesiteli',
    isBestSeller: true,
    inStock: true,
    rating: 4.5,
    description: 'Современный смеситель с керамическим картриджем и хромированным покрытием.',
    specifications: {
      'Производитель': 'Grohe',
      'Материал': 'Латунь',
      'Покрытие': 'Хром',
      'Гарантия': '5 лет',
      'Тип смесителя': 'Однорычажный',
      'Назначение': 'Для ванны',
      'Монтаж': 'Настенный',
      'Цвет': 'Хром'
    }
  },
  {
    id: '2',
    name: 'Акриловая ванна Ravak Classic 170x70',
    price: 28500,
    oldPrice: 32000,
    image: 'https://images.pexels.com/photos/7319316/pexels-photo-7319316.jpeg',
    category: 'vanny',
    isBestSeller: true,
    inStock: true,
    rating: 4.7,
    description: 'Прочная акриловая ванна с долгим сроком службы.',
    specifications: {
      'Производитель': 'Ravak',
      'Материал': 'Акрил',
      'Длина': '170 см',
      'Ширина': '70 см',
      'Глубина': '45 см',
      'Объем': '210 л',
      'Гарантия': '10 лет',
      'Цвет': 'Белый'
    }
  },
  {
    id: '3',
    name: 'Душевая кабина Niagara Premium',
    price: 56900,
    oldPrice: 64500,
    image: 'https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg',
    category: 'dushevye-kabiny',
    isNew: true,
    inStock: true,
    rating: 4.8,
    description: 'Просторная душевая кабина с тропическим душем и гидромассажем.',
    specifications: {
      'Производитель': 'Niagara',
      'Размеры': '90x90x215 см',
      'Форма': 'Квадратная',
      'Стекло': 'Закаленное 6 мм',
      'Поддон': 'Акриловый',
      'Профиль': 'Хром',
      'Гарантия': '3 года',
      'Дополнительно': 'Тропический душ, гидромассаж'
    }
  },
  {
    id: '4',
    name: 'Раковина подвесная Cersanit City 60',
    price: 4990,
    oldPrice: 5890,
    image: 'https://images.pexels.com/photos/6585753/pexels-photo-6585753.jpeg',
    category: 'rakoviny',
    isBestSeller: true,
    inStock: true,
    rating: 4.5,
    description: 'Стильная подвесная раковина из санфаянса.',
    specifications: {
      'Производитель': 'Cersanit',
      'Материал': 'Санфаянс',
      'Ширина': '60 см',
      'Тип монтажа': 'Подвесной',
      'Форма': 'Прямоугольная',
      'Цвет': 'Белый',
      'Гарантия': '2 года',
      'Страна': 'Польша'
    }
  },
  {
    id: '5',
    name: 'Унитаз-компакт Roca Gap',
    price: 19500,
    image: 'https://images.pexels.com/photos/6585748/pexels-photo-6585748.jpeg',
    category: 'unitazy',
    inStock: true,
    rating: 4.6,
    description: 'Компактный унитаз с системой двойного смыва.',
    specifications: {
      'Производитель': 'Roca',
      'Материал': 'Санфаянс',
      'Тип': 'Компакт',
      'Система смыва': 'Двойная',
      'Объем смыва': '3/6 л',
      'Сиденье': 'С микролифтом',
      'Гарантия': '10 лет',
      'Страна': 'Испания'
    }
  },
  {
    id: '6',
    name: 'Шкаф для ванной Aquanet Верона 90',
    price: 26790,
    oldPrice: 29990,
    image: 'https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg',
    category: 'mebel-dlya-vannoy',
    isNew: true,
    inStock: true,
    rating: 4.4,
    description: 'Вместительный шкаф с зеркалом и встроенной подсветкой.',
    specifications: {
      'Производитель': 'Aquanet',
      'Материал': 'ЛДСП',
      'Ширина': '90 см',
      'Высота': '85 см',
      'Глубина': '45 см',
      'Подсветка': 'LED',
      'Цвет': 'Белый',
      'Гарантия': '2 года'
    }
  },
  {
    id: '7',
    name: 'Полотенцесушитель электрический Тера Люкс',
    price: 8790,
    image: 'https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg',
    category: 'polotentsesushiteli',
    isBestSeller: true,
    inStock: true,
    rating: 4.3,
    description: 'Электрический полотенцесушитель с регулятором температуры.',
    specifications: {
      'Производитель': 'Тера',
      'Тип': 'Электрический',
      'Мощность': '100 Вт',
      'Размеры': '50x80 см',
      'Материал': 'Нержавеющая сталь',
      'Управление': 'Электронное',
      'Режимы': '4',
      'Гарантия': '3 года'
    }
  },
  {
    id: '8',
    name: 'Фильтр для воды Аквафор Кристалл',
    price: 3990,
    oldPrice: 4500,
    image: 'https://images.pexels.com/photos/6585752/pexels-photo-6585752.jpeg',
    category: 'filtry-dlya-vody',
    inStock: true,
    rating: 4.7,
    description: 'Надежный фильтр для очистки воды от примесей и хлора.',
    specifications: {
      'Производитель': 'Аквафор',
      'Тип': 'Проточный',
      'Количество ступеней': '3',
      'Ресурс картриджа': '6000 л',
      'Производительность': '2.5 л/мин',
      'Температура воды': 'от +5 до +38°C',
      'Давление': 'от 0.9 до 6.3 атм',
      'Гарантия': '1 год'
    }
  }
];

export const getBestSellers = () => products.filter(product => product.isBestSeller);
export const getNewArrivals = () => products.filter(product => product.isNew);