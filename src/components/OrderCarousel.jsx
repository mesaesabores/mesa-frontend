import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, MapPin, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderCarousel = ({ orders, onUpdateStatus, onSendWhatsApp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const statusOptions = [
    { value: 'received', label: 'Pedido Recebido', color: 'bg-blue-600' },
    { value: 'paid', label: 'Pagamento Confirmado', color: 'bg-green-600' },
    { value: 'preparing', label: 'Em Preparo', color: 'bg-yellow-600' },
    { value: 'ready', label: 'Pronto para Entrega', color: 'bg-orange-600' },
    { value: 'delivering', label: 'Saiu para Entrega', color: 'bg-purple-600' },
    { value: 'delivered', label: 'Entregue', color: 'bg-gray-600' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const nextOrder = () => {
    setCurrentIndex((prev) => (prev + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex((prev) => (prev - 1 + orders.length) % orders.length);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Não há pedidos no momento.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Cliente
          </Link>
        </div>
      </div>
    );
  }

  const currentOrder = orders[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Cliente
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Painel do Vendedor</h1>
              <p className="text-sm text-gray-600">
                Pedido {currentIndex + 1} de {orders.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {/* Navegação */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevOrder}
              disabled={orders.length <= 1}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Anterior
            </button>
            
            <div className="flex space-x-2">
              {orders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextOrder}
              disabled={orders.length <= 1}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {/* Card do Pedido */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            {/* Header do Pedido */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Pedido #{currentOrder.id}
                </h3>
                <p className="text-gray-500 flex items-center mt-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(currentOrder.created_at)}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(currentOrder.status)}`}>
                {getStatusDisplay(currentOrder.status)}
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-medium text-lg">{currentOrder.customer_name}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Smartphone className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{currentOrder.customer_whatsapp}</span>
                </div>
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                  <span>{currentOrder.customer_address}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-medium">
                    {currentOrder.payment_method === 'pix' ? 'Pix' : 'Cartão de Crédito'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(currentOrder.total_price)}
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Itens do Pedido:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {currentOrder.items && currentOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">{item.title}</span>
                        <span className="text-gray-600 ml-3">
                          ({item.size}) x{item.quantity}
                        </span>
                      </div>
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <div className="text-sm text-red-600 mt-1">
                          <strong>Retirar:</strong> {item.removedIngredients.join(', ')}
                        </div>
                      )}
                      {item.observations && (
                        <div className="text-sm text-blue-600 mt-1">
                          <strong>Observações:</strong> {item.observations}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-gray-800 text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seleção de Status */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Atualizar Status:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onUpdateStatus(currentOrder.id, option.value)}
                    className={`p-3 rounded-lg text-white font-medium transition-colors hover:opacity-90 ${
                      currentOrder.status === option.value 
                        ? `${option.color} ring-2 ring-offset-2 ring-blue-500` 
                        : option.color
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ação WhatsApp */}
            <div className="flex justify-center">
              <button
                onClick={() => onSendWhatsApp(currentOrder.id)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center text-lg"
              >
                <Smartphone className="w-5 h-5 mr-3" />
                Notificar Cliente via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCarousel;

