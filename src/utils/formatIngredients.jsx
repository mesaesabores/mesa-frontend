import React from 'react';

// Função para formatar ingredientes com destaque visual
export const formatIngredients = (description) => {
  // Lista de ingredientes principais que devem ser destacados
  const mainIngredients = [
    'arroz', 'feijão', 'frango', 'filé de frango', 'peito de frango', 'fricassê de frango',
    'espaguete', 'bolonhesa', 'farofa', 'purê de batata', 'repolho', 'inhame', 'vagem'
  ];
  
  // Lista de saladas e vegetais
  const vegetables = [
    'alface', 'tomate', 'cenoura', 'pepino', 'milho verde', 'beterraba'
  ];
  
  // Separar por vírgulas e processar cada ingrediente
  const parts = description.split(',').map(part => part.trim());
  
  return parts.map((ingredient, index) => {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Verificar se é um ingrediente principal
    const isMainIngredient = mainIngredients.some(main => 
      lowerIngredient.includes(main.toLowerCase())
    );
    
    // Verificar se é vegetal/salada
    const isVegetable = vegetables.some(veg => 
      lowerIngredient.includes(veg.toLowerCase())
    );
    
    let className = 'inline-block px-2 py-1 rounded-md text-sm mr-1 mb-1 ';
    let emoji = '';
    
    if (isMainIngredient) {
      className += 'bg-orange-100 text-orange-800 font-medium border border-orange-200';
      emoji = '🍖 ';
    } else if (isVegetable) {
      className += 'bg-green-100 text-green-800 font-medium border border-green-200';
      emoji = '🥗 ';
    } else {
      className += 'bg-gray-100 text-gray-700 border border-gray-200';
      emoji = '🍽️ ';
    }
    
    return {
      text: ingredient,
      className,
      emoji,
      key: index
    };
  });
};

// Função para renderizar ingredientes formatados
export const renderFormattedIngredients = (description) => {
  const formattedIngredients = formatIngredients(description);
  
  return formattedIngredients.map(ingredient => (
    <span key={ingredient.key} className={ingredient.className}>
      {ingredient.emoji}{ingredient.text}
    </span>
  ));
};

