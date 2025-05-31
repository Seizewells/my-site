import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
    title: 'Стильная сантехника для вашего дома',
    subtitle: 'Скидки до 30% на премиальные коллекции',
    buttonText: 'Смотреть каталог'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/6492389/pexels-photo-6492389.jpeg',
    title: 'Новая коллекция ванн 2025',
    subtitle: 'Элегантность и комфорт в каждой детали',
    buttonText: 'Подробнее'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/7319304/pexels-photo-7319304.jpeg',
    title: 'Создайте ванную своей мечты',
    subtitle: 'Комплексные решения под ключ',
    buttonText: 'Заказать консультацию'
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden rounded-lg">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{slide.title}</h2>
            <p className="text-sm md:text-lg mb-4 md:mb-6">{slide.subtitle}</p>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm md:text-base">
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;