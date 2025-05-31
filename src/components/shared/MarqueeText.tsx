import React from 'react';
import { motion } from 'framer-motion';

const MarqueeText: React.FC = () => {
  const text = 'ПРОДАЖА КАЧЕСТВЕННОЙ САНТЕХНИКИ И ТОВАРОВ ДЛЯ ДОМА ПО ЛУЧШИМ ЦЕНАМ В ГОРОДЕ!';

  return (
    <div className="relative overflow-hidden border-y border-gray-200">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-600 bg-[length:200%_100%] animate-gradient" 
        style={{
          transform: 'skew(-12deg)',
          backgroundSize: '200% 100%'
        }}
      />

      <div className="relative flex whitespace-nowrap font-semibold overflow-hidden py-2">
        <motion.div
          animate={{
            x: [0, '-50%']
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="flex items-center space-x-4"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-block text-white px-4">{text}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeText;