import React from 'react';
import { Clock, User, MapPin, CreditCard, Smartphone } from 'lucide-react';

const OrderCard = ({ order, onUpdateStatus, onSendWhatsApp }) => {
  const getStatusColor = (status) => {
    const colors = {
      'received': 'bg-blue-100 text-blue-800 border-blue-200',
      'paid': 'bg-green-100 text-green-800 border-green-200',
      'preparing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ready': 'bg-orange-100 text-orange-800 border-orange-200',
      'delivering': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'received': 'Pedido Recebido',
      'paid': 'Pagamento Confirmado',
      'preparing': 'Em Preparo',
      'ready': 'Pronto para Entrega',
      'delivering': 'Saiu para Entrega',
      'delivered': 'Entregue'
    };
    return displays[status] || status;
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'received': 'paid',
      'paid': 'preparing',
      'preparing': 'ready',
      'ready': 'delivering',
      'delivering': 'delivered'
    };
    return flow[currentStatus];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
      {/* Header do Pedido */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Pedido #{order.id}
          </h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
          {getStatusDisplay(order.status)}
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">{order.customer_name}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
            <span>{order.customer_whatsapp}</span>
          </div>
          <div className="flex items-start text-gray-700">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
            <span className="text-sm">{order.customer_address}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">
              {order.payment_method === 'pix' ? 'Pix' : 'Cartão de Crédito'}
            </span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {formatPrice(order.total_price)}
          </div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Itens do Pedido:</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          {order.items && order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <div>
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({item.size}) x{item.quantity}
                </span>
                {item.removedIngredients && item.removedIngredients.length > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    Retirar: {item.removedIngredients.join(', ')}
                  </div>
                )}
                {item.observations && (
                  <div className="text-xs text-blue-600 mt-1">
                    Obs: {item.observations}
                  </div>
                )}
              </div>
              <span className="font-medium text-gray-800">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-2">
        {nextStatus && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Marcar como: {getStatusDisplay(nextStatus)}
          </button>
        )}
        
        <button
          onClick={() => onSendWhatsApp(order.id)}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Notificar Cliente
        </button>
      </div>
    </div>
  );
};

export default OrderCard;

