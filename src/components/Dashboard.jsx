import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import OrderCard from './OrderCard';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // URL base da API - ajuste conforme necessário
  const API_BASE = 'http://localhost:5001/api';

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const statusParam = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
      const response = await fetch(`${API_BASE}/orders${statusParam}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      alert('Erro ao carregar pedidos. Verifique se o backend está rodando.');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders/stats`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // Recarregar pedidos e estatísticas
      await Promise.all([fetchOrders(), fetchStats()]);
      
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido.');
    }
  };

  const sendWhatsAppNotification = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/whatsapp-message`);
      
      if (!response.ok) {
        throw new Error('Erro ao gerar mensagem');
      }
      
      const data = await response.json();
      
      // Abrir WhatsApp com a mensagem
      window.open(data.whatsapp_url, '_blank');
    } catch (error) {
      console.error('Erro ao gerar mensagem WhatsApp:', error);
      alert('Erro ao gerar mensagem do WhatsApp.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchStats()]);
      setLoading(false);
    };

    loadData();
  }, [selectedStatus]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedStatus]);

  const statusOptions = [
    { value: 'all', label: 'Todos os Pedidos', icon: Package },
    { value: 'received', label: 'Recebidos', icon: Clock },
    { value: 'paid', label: 'Pagos', icon: CheckCircle },
    { value: 'preparing', label: 'Em Preparo', icon: Clock },
    { value: 'ready', label: 'Prontos', icon: CheckCircle },
    { value: 'delivering', label: 'Para Entrega', icon: Truck }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mesa e Sabores</h1>
              <p className="text-gray-600">Painel do Vendedor</p>
            </div>
            <button
              onClick={() => {
                fetchOrders();
                fetchStats();
              }}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {stats.stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(stats.stats).map(([status, data]) => (
              <div key={status} className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{data.count}</div>
                <div className="text-sm text-gray-600">{data.display}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    selectedStatus === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600">
                {selectedStatus === 'all' 
                  ? 'Não há pedidos no momento.'
                  : `Não há pedidos com status "${statusOptions.find(s => s.value === selectedStatus)?.label}".`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onSendWhatsApp={sendWhatsAppNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

