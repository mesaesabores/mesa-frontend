import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const OrderSummary = ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout, totalPrice }) => {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Seu Pedido
        </h3>
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Seu carrinho está vazio</p>
          <p className="text-sm text-gray-400 mt-2">
            Adicione itens do cardápio para começar seu pedido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Seu Pedido ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.cartId} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
              <button
                onClick={() => onRemoveItem(item.cartId)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Tamanho:</span>
                <span className="font-medium">{item.size} - R$ {item.price.toFixed(2)}</span>
              </div>
              
              {item.removedIngredients && (
                <div className="flex justify-between">
                  <span>Retirar:</span>
                  <span className="font-medium text-red-600">{item.removedIngredients}</span>
                </div>
              )}
              
              {item.observations && (
                <div className="flex justify-between">
                  <span>Obs:</span>
                  <span className="font-medium">{item.observations}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <div className="font-bold text-orange-600">
                R$ {item.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Total:</span>
          <span className="text-xl font-bold text-orange-600">
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;

