import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
  };
  created_at: string;
  updated_at: string;
  profiles?: {
    email: string;
    username: string | null;
  };
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            email,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Ошибка при загрузке заказов:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Eye size={16} />;
      case 'processing':
        return <Truck size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      await loadOrders();
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса');
    }
  };

  if (loading) return <div>Загрузка заказов...</div>;
  if (error) return (
    <div className="bg-red-50 text-red-500 p-3 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Управление заказами</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID заказа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Покупатель
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.shipping_address.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.profiles?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.total_amount.toLocaleString()} ₽
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="processing">Обработка</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменён</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(order.created_at), 'dd MMM yyyy', { locale: ru })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(order.created_at), 'HH:mm', { locale: ru })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Заказ #{selectedOrder.id}
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Информация о покупателе</h4>
                <p className="text-sm text-gray-600">{selectedOrder.shipping_address.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.shipping_address.phone}</p>
                <p className="text-sm text-gray-600">{selectedOrder.profiles?.email}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Адрес доставки</h4>
                <p className="text-sm text-gray-600">{selectedOrder.shipping_address.address}</p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Статус заказа</h4>
                <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1">
                    {selectedOrder.status === 'pending' && 'Ожидает'}
                    {selectedOrder.status === 'processing' && 'Обработка'}
                    {selectedOrder.status === 'shipped' && 'Отправлен'}
                    {selectedOrder.status === 'delivered' && 'Доставлен'}
                    {selectedOrder.status === 'cancelled' && 'Отменён'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Сумма заказа</h4>
                <p className="text-xl font-bold text-gray-900">
                  {selectedOrder.total_amount.toLocaleString()} ₽
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;