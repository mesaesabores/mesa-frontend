import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, Clock, CheckCircle, Truck, Calendar, Filter, ArrowLeft, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorPanel = ({ orders, onUpdateStatus, onSendWhatsApp, onRefresh }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const getStatusColor = (status) => {
    const colors = {
      'received': 'bg-blue-50 border-blue-200',
      'paid': 'bg-green-50 border-green-200',
      'preparing': 'bg-yellow-50 border-yellow-200',
      'ready': 'bg-orange-50 border-orange-200',
      'delivering': 'bg-purple-50 border-purple-200',
      'delivered': 'bg-gray-50 border-gray-200'
    };
    return colors[status] || 'bg-white border-gray-200';
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
    { value: 'all', label: 'Todos os Pedidos', icon: Package, color: 'bg-gray-600' },
    { value: 'received', label: 'Pedido Recebido', icon: Clock, color: 'bg-blue-600' },
    { value: 'paid', label: 'Pagamento Confirmado', icon: CheckCircle, color: 'bg-green-600' },
    { value: 'preparing', label: 'Em Preparo', icon: Clock, color: 'bg-yellow-600' },
    { value: 'ready', label: 'Pronto para Entrega', icon: CheckCircle, color: 'bg-orange-600' },
    { value: 'delivering', label: 'Saiu para Entrega', icon: Truck, color: 'bg-purple-600' },
    { value: 'delivered', label: 'Entregue', icon: CheckCircle, color: 'bg-gray-600' }
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

  const isToday = (dateString) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    return today.toDateString() === orderDate.toDateString();
  };

  const isYesterday = (dateString) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const orderDate = new Date(dateString);
    return yesterday.toDateString() === orderDate.toDateString();
  };

  useEffect(() => {
    let filtered = orders;

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filtrar por data
    if (selectedDate === 'today') {
      filtered = filtered.filter(order => isToday(order.created_at));
    } else if (selectedDate === 'yesterday') {
      filtered = filtered.filter(order => isYesterday(order.created_at));
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100" style={{ zoom: '0.85' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Cliente
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Mesa e Sabores</h1>
              <p className="text-sm text-gray-600">Painel do Vendedor</p>
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filtro por Status */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Filtrar por Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Data */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Filtrar por Data
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Dias</option>
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos Empilhados */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600">
                Não há pedidos com os filtros selecionados.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`rounded-lg shadow-sm border-2 p-6 transition-all duration-300 ${getStatusColor(order.status)}`}
              >
                {/* Header do Pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {formatPrice(order.total_price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.payment_method === 'pix' ? 'Pix' : 'Cartão de Crédito'}
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-white bg-opacity-50 rounded-lg p-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cliente:</h4>
                    <p className="text-gray-700">{order.customer_name}</p>
                    <p className="text-gray-600">{order.customer_whatsapp}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Endereço:</h4>
                    <p className="text-gray-700 text-sm">{order.customer_address}</p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Itens do Pedido:</h4>
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-gray-600 ml-2">
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
                        <span className="font-semibold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Status */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Atualizar Status:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {statusOptions.slice(1).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onUpdateStatus(order.id, option.value)}
                        className={`p-2 rounded-lg text-white font-medium transition-colors hover:opacity-90 text-sm ${
                          order.status === option.value 
                            ? `${option.color} ring-2 ring-offset-2 ring-blue-500` 
                            : option.color
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <div className="flex justify-center">
                  <button
                    onClick={() => onSendWhatsApp(order.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Notificar Cliente via WhatsApp
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPanel;

