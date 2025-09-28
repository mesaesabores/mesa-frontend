import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import perfilImage from '../../assets/perfil.jpg';
import capaImage from '../../assets/capa.jpg';
import { serviceInfo } from '../../data/menuData';

const Header = () => {
  return (
    <header 
      className="relative text-white shadow-lg overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.8), rgba(234, 88, 12, 0.8)), url(${capaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="absolute top-4 right-4">
          <Link to="/vendedor" className="text-white text-sm font-medium hover:underline">
            Vendedor
          </Link>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={perfilImage} 
              alt="Mesa e Sabores Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Nome do serviço */}
          <h1 className="text-4xl font-bold tracking-wide drop-shadow-lg">
            {serviceInfo.name}
          </h1>
          
          {/* Informações de entrega */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm bg-black bg-opacity-20 rounded-lg px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Segunda a Sexta: {serviceInfo.deliveryHours.mondayFriday}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Sábado: {serviceInfo.deliveryHours.saturday}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Domingo: {serviceInfo.deliveryHours.sunday}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

