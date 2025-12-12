import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onAuthClick: () => void;
  onCartClick: () => void;
  onAdminClick?: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header = ({ onAuthClick, onCartClick, onAdminClick, currentView, onViewChange }: HeaderProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
      onViewChange('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Philippine Treasures
            </div>
          </button>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => onViewChange('home')}
              className={`${
                currentView === 'home' ? 'text-green-600' : 'text-gray-600'
              } hover:text-green-600 transition-colors`}
            >
              Shop
            </button>

            {isAdmin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-1 ${
                  currentView === 'admin' ? 'text-green-600' : 'text-gray-600'
                } hover:text-green-600 transition-colors`}
              >
                <LayoutDashboard size={20} />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={onCartClick}
              className="relative text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <User size={20} />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
