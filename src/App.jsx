import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header/Header';
import DayNavigation from './components/Menu/DayNavigation';
import MenuDisplay from './components/Menu/MenuDisplay';
import OrderSummary from './components/Order/OrderSummary';
import Checkout from './components/Order/Checkout';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import VendorDashboard from './components/VendorDashboard';
import { getCurrentDay } from './data/menuData';
import './App.css';

function AppContent() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const handleRemoveFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleUpdateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartId);
      return;
    }
    
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId 
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleBackToMenu = () => {
    setShowCheckout(false);
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Checkout 
          cartItems={cartItems}
          totalPrice={getTotalPrice()}
          onBack={handleBackToMenu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <DayNavigation 
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuDisplay 
              selectedDay={selectedDay}
              onAddToCart={handleAddToCart}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={() => setShowCheckout(true)}
              totalPrice={getTotalPrice()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/vendedor" element={<VendorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

