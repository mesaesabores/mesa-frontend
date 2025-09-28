import segundaopcao1 from '../assets/segundaopcao1.jpg';
import segundaopcao2 from '../assets/segundaopcao2.jpg';
import tercaopcao1 from '../assets/tercaopcao1.jpg';
import tercaopcao2 from '../assets/tercaopcao2.jpg';
import quartaopcao1 from '../assets/quartaopcao1.jpg';
import quartaopcao2 from '../assets/quartaopcao2.jpg';
import quintaopcao1 from '../assets/quintaopcao1.jpg';
import quintaopcao2 from '../assets/quintaopcao2.jpg';

export const serviceInfo = {
  name: "Mesa e Sabores",
  deliveryHours: {
    mondayFriday: "11h às 14h",
    saturday: "11h às 13h",
    sunday: "Fechado"
  },
  whatsapp: "5532984218936",
  pixKey: "32984218936"
};

export const prices = {
  P: 16.00,
  M: 20.00,
  G: 26.00
};

export const menuData = {
  segunda: {
    name: "Segunda-feira",
    options: [
      {
        id: "segunda_indisponivel",
        title: "Cardápio disponível em breve",
        description: "Nosso cardápio de segunda-feira ficará disponível em breve.",
        image: null
      }
    ]
  },
  terca: {
    name: "Terça-feira",
    options: [
      {
        id: "terca_indisponivel",
        title: "Cardápio disponível em breve",
        description: "Nosso cardápio de terça-feira ficará disponível em breve.",
        image: null
      }
    ]
  },
  quarta: {
    name: "Quarta-feira",
    options: [
      {
        id: "quarta_indisponivel",
        title: "Cardápio disponível em breve",
        description: "Nosso cardápio de quarta-feira ficará disponível em breve.",
        image: null
      }
    ]
  },
  quinta: {
    name: "Quinta-feira",
    options: [
      {
        id: "quinta_opcao_1",
        title: "Opção 01",
        description: "Arroz, feijão, pernil assado, creme de milho, farofa, salada de alface, tomate, pepino.",
        image: quintaopcao1
      },
      {
        id: "quinta_opcao_2",
        title: "Opção 02",
        description: "Arroz, feijão, peito de frango refogado, brócolis cozido, couve-flor cozida, salada de alface, tomate, cenoura ralada.",
        image: quintaopcao2
      }
    ]
  },
  sexta: {
    name: "Sexta-feira",
    options: [
      {
        id: "quinta_opcao_1",
        title: "Opção 01",
        description: "Arroz, feijão, pernil assado, creme de milho, farofa, salada de alface, tomate, pepino.",
        image: quintaopcao1
      },
      {
        id: "quinta_opcao_2",
        title: "Opção 02",
        description: "Arroz, feijão, peito de frango refogado, brócolis cozido, couve-flor cozida, salada de alface, tomate, cenoura ralada.",
        image: quintaopcao2
      }
    ]
  },
  sabado: {
    name: "Sábado",
    options: [
      {
        id: "quinta_opcao_1",
        title: "Opção 01",
        description: "Arroz, feijão, pernil assado, creme de milho, farofa, salada de alface, tomate, pepino.",
        image: quintaopcao1
      },
      {
        id: "quinta_opcao_2",
        title: "Opção 02",
        description: "Arroz, feijão, peito de frango refogado, brócolis cozido, couve-flor cozida, salada de alface, tomate, cenoura ralada.",
        image: quintaopcao2
      }
    ]
  }
};

export const dayKeys = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export const getCurrentDay = () => {
  const today = new Date().getDay();
  const dayMap = {
    1: 'segunda',
    2: 'terca',
    3: 'quarta',
    4: 'quinta',
    5: 'sexta',
    6: 'sabado',
    0: 'segunda' // domingo volta para segunda
  };
  return dayMap[today] || 'segunda';
};

