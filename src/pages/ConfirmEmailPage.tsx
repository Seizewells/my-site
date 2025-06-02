import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const ConfirmEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Подтвердите ваш email
          </h1>
          
          <p className="text-gray-600 mb-6">
            На адрес <span className="font-medium text-gray-900">{email}</span> было отправлено письмо со ссылкой для подтверждения. 
            Пожалуйста, проверьте вашу почту и перейдите по ссылке для завершения регистрации.
          </p>

          <div className="space-y-4">
            <a
              href={`https://${email.split('@')[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Открыть почту
            </a>
            
            <button
              onClick={() => navigate('/login')}
              className="block w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Вернуться к входу
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmEmailPage;