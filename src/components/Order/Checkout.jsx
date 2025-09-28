import React, { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, MessageSquare, CreditCard, QrCode } from 'lucide-react';
import { serviceInfo } from '../../data/menuData';

const Checkout = ({ cartItems, totalPrice, onBack }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    whatsapp: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState(''); // 'pix' or 'credit_card'

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatWhatsAppMessage = () => {
    let message = `🍽️ *PEDIDO - MESA E SABORES*\n\n`;
    message += `👤 *Cliente:* ${customerData.name}\n`;
    message += `📱 *WhatsApp:* ${customerData.whatsapp}\n`;
    message += `📍 *Endereço:* ${customerData.address}\n\n`;
    
    message += `📋 *ITENS DO PEDIDO:*\n`;
    cartItems.forEach((item, index) => {
      message += `\n${index + 1}. *${item.title}*\n`;
      message += `   Tamanho: ${item.size} - R$ ${item.price.toFixed(2)}\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      if (item.removedIngredients) {
        message += `   Retirar: ${item.removedIngredients}\n`;
      }
      if (item.observations) {
        message += `   Obs: ${item.observations}\n`;
      }
      message += `   Subtotal: R$ ${item.totalPrice.toFixed(2)}\n`;
    });
    
    message += `\n💰 *TOTAL: R$ ${totalPrice.toFixed(2)}*\n`;
    message += `💳 *Forma de Pagamento:* ${paymentMethod === 'pix' ? 'Pix' : 'Cartão de Crédito'}\n\n`;

    if (paymentMethod === 'pix') {
      message += `*Instruções Pix:*\n`;
      message += `Chave Pix: ${serviceInfo.pixKey}\n`;
      message += `Por favor, confirme o pedido e envie o comprovante de pagamento via WhatsApp.\n\n`;
    } else if (paymentMethod === 'credit_card') {
      message += `*Instruções Cartão de Crédito:*\n`;
      message += `O entregador levará a máquina de cartão para pagamento presencial.\n\n`;
    }

    message += `⏰ Horário do pedido: ${new Date().toLocaleString('pt-BR')}`;
    
    return encodeURIComponent(message);
  };

  const handleConfirmOrder = async () => {
    if (!customerData.name || !customerData.whatsapp || !customerData.address || !paymentMethod) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione a forma de pagamento.');
      return;
    }

    try {
      // Preparar dados do pedido para o backend
      const orderData = {
        customer_name: customerData.name,
        customer_whatsapp: customerData.whatsapp.replace(/\D/g, ''), // Remove caracteres não numéricos
        customer_address: customerData.address,
        payment_method: paymentMethod,
        items: cartItems,
        total_price: totalPrice
      };

      // Enviar pedido para o backend
      const response = await fetch('https://8xhpiqcv1693.manus.space/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar pedido');
      }

      const result = await response.json();
      console.log('Pedido criado:', result);

      // Usar a URL do WhatsApp retornada pelo backend se disponível
      if (result.whatsapp_url && result.whatsapp_success) {
        window.open(result.whatsapp_url, '_blank');
        alert('Pedido enviado com sucesso! Você será redirecionado para o WhatsApp para notificar o vendedor.');
      } else {
        // Fallback para o método anterior
        const message = formatWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${serviceInfo.whatsapp}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        alert('Pedido criado com sucesso! Você será redirecionado para o WhatsApp.');
      }
      
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      
      // Em caso de erro, ainda permite enviar via WhatsApp
      const message = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${serviceInfo.whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      alert('Pedido enviado via WhatsApp. (Erro ao salvar no sistema, mas o pedido foi processado)');
    }
  };

  const isFormValid = customerData.name && customerData.whatsapp && customerData.address && paymentMethod;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Cardápio
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Dados para Entrega
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={customerData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Endereço de Entrega *
                </label>
                <textarea
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro, complemento..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Opções de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pagamento *
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      paymentMethod === 'pix' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    Pix
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      paymentMethod === 'credit_card' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Cartão de Crédito
                  </button>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                    <div className="flex items-start gap-3">
                      <QrCode className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">💰 Pagamento via Pix</h4>
                        <p className="text-blue-700 text-sm mb-2">
                          <strong>Chave Pix:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{serviceInfo.pixKey}</span>
                        </p>
                        <p className="text-blue-600 text-sm">
                          ✅ Após confirmar o pedido, faça o pagamento e envie o comprovante via WhatsApp para agilizar sua entrega!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === 'credit_card' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">💳 Pagamento no Cartão</h4>
                        <p className="text-green-600 text-sm">
                          ✅ Nosso entregador levará a máquina de cartão até você. Pagamento rápido e seguro na hora da entrega!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Resumo do Pedido
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {cartItems.map((item, index) => (
                <div key={item.cartId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <span className="font-bold text-orange-600">
                      R$ {item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Tamanho: {item.size} - Quantidade: {item.quantity}</p>
                    {item.removedIngredients && (
                      <p className="text-red-600">Retirar: {item.removedIngredients}</p>
                    )}
                    {item.observations && (
                      <p>Observações: {item.observations}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total:</span>
                <span className="text-orange-600">R$ {totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={!isFormValid}
                className={`
                  w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${isFormValid 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <MessageSquare className="w-5 h-5" />
                Confirmar Pedido via WhatsApp
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Você será redirecionado para o WhatsApp para finalizar o pedido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

