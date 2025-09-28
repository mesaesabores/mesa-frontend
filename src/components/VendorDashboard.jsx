import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import VendorLogin from './VendorLogin';
import VendorPanel from './VendorPanel';

const VendorDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // URL base da API - ajuste conforme necessário
  const API_BASE = 'mesa-backend.vercel.app/api';

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      // Usar a nova rota do vendedor que busca do Supabase
      const response = await fetch(`${API_BASE}/vendor/orders`);
      
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Usar a nova rota do vendedor que atualiza no Supabase
      const response = await fetch(`${API_BASE}/vendor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // Recarregar pedidos
      await fetchOrders();
      
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
    if (isAuthenticated) {
      const loadData = async () => {
        setLoading(true);
        await fetchOrders();
        setLoading(false);
      };

      loadData();
    }
  }, [isAuthenticated]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <VendorLogin onLogin={handleLogin} />;
  }

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
    <VendorPanel
      orders={orders}
      onUpdateStatus={updateOrderStatus}
      onSendWhatsApp={sendWhatsAppNotification}
      onRefresh={fetchOrders}
    />
  );
};

export default VendorDashboard;

