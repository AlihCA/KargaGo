import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onAuthClick={() => setShowAuthModal(true)}
            onCartClick={() => setShowCart(true)}
            currentView={currentView}
            onViewChange={(view) => setCurrentView(view as 'home' | 'admin')}
          />

          <main>
            {currentView === 'home' ? <ProductList /> : <AdminDashboard />}
          </main>

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />

          <CartDrawer
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            onCheckout={() => setShowCheckout(true)}
          />

          <Checkout
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
