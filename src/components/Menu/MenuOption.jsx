import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { prices, getCurrentDay } from '../../data/menuData';
import disponivelEmBreveImage from '../../assets/disponivel-em-breve.jpg';
import { renderFormattedIngredients } from '../../utils/formatIngredients.jsx';

const MenuOption = ({ option, optionNumber, onAddToCart, selectedDay }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [removedIngredients, setRemovedIngredients] = useState('');
  const [observations, setObservations] = useState('');

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (option.title === 'Cardápio disponível em breve') {
      return;
    }

    const cartItem = {
      id: option.id,
      title: `Opção ${optionNumber < 10 ? '0' + optionNumber : optionNumber}`,
      description: option.description,
      image: option.image,
      quantity,
      size,
      price: prices[size],
      totalPrice: prices[size] * quantity,
      removedIngredients,
      observations
    };

    onAddToCart(cartItem);
    
    // Reset form
    setQuantity(1);
    setSize('M');
    setRemovedIngredients('');
    setObservations('');
  };

  const isAvailable = option.title !== 'Cardápio disponível em breve';
  const isCurrentDay = selectedDay === getCurrentDay();
  const canAddToCart = isAvailable && isCurrentDay;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Imagem */}
        <div className="md:w-1/3">
          {option.image ? (
            <img
              src={option.image}
              alt={option.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <img
              src={disponivelEmBreveImage}
              alt="Cardápio disponível em breve"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Conteúdo */}
        <div className="md:w-2/3 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🍽 {option.title}
            </h3>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
              <div className="flex flex-wrap gap-1">
                {renderFormattedIngredients(option.description)}
              </div>
            </div>
          </div>

          {isAvailable && (
            <>
              {/* Controles de quantidade e tamanho */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={!canAddToCart}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      canAddToCart 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={!canAddToCart}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      canAddToCart 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Tamanho:</span>
                  {Object.keys(prices).map((sizeKey) => (
                    <button
                      key={sizeKey}
                      onClick={() => setSize(sizeKey)}
                      disabled={!canAddToCart}
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${!canAddToCart 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : size === sizeKey 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-orange-100'
                        }
                      `}
                    >
                      {sizeKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos de personalização */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retirar ingredientes:
                  </label>
                  <input
                    type="text"
                    value={removedIngredients}
                    onChange={(e) => setRemovedIngredients(e.target.value)}
                    placeholder="Ex: cebola, tomate..."
                    disabled={!canAddToCart}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      !canAddToCart ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações:
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Alguma observação especial..."
                    rows="2"
                    disabled={!canAddToCart}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                      !canAddToCart ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Preço total e botão */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-lg font-bold text-orange-600">
                  Total: R$ {(prices[size] * quantity).toFixed(2)}
                </div>
                {canAddToCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar ao Pedido
                  </button>
                ) : (
                  <div className="text-sm text-gray-500 text-center">
                    {!isCurrentDay ? 'Disponível apenas no dia atual' : 'Não disponível'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuOption;

