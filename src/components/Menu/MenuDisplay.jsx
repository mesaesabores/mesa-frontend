import React from 'react';
import { menuData } from '../../data/menuData';
import MenuOption from './MenuOption';

const MenuDisplay = ({ selectedDay, onAddToCart }) => {
  const dayMenu = menuData[selectedDay];

  if (!dayMenu) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cardápio não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📋 Cardápio {dayMenu.name}
      </h2>
      
      <div className="space-y-6">
        {dayMenu.options.map((option, index) => (
          <MenuOption
            key={option.id}
            option={option}
            optionNumber={index + 1}
            onAddToCart={onAddToCart}
            selectedDay={selectedDay}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;

