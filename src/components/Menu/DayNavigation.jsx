import React from 'react';
import { menuData, dayKeys } from '../../data/menuData';

const DayNavigation = ({ selectedDay, onDaySelect }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Cardápio da Semana
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {dayKeys.map((dayKey) => (
          <button
            key={dayKey}
            onClick={() => onDaySelect(dayKey)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedDay === dayKey 
                ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
              }
            `}
          >
            {menuData[dayKey].name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayNavigation;

