import { useState } from 'react';
import { Package, BarChart3 } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { Reports } from './Reports';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'reports'>('products');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your products and view reports</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Package size={20} />
            <span>Product Management</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'reports'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'products' ? <ProductManagement /> : <Reports />}
        </div>
      </div>
    </div>
  );
};
