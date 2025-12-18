import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Filter, AlertCircle, TrendingUp, Package, RefreshCw, ChevronRight } from 'lucide-react';
import { getInventoryForecast } from '../services/geminiService';

const initialProducts: Product[] = [
  { id: '1', name: 'Organic Bananas', category: 'Produce', stock: 120, price: 0.99, lastSold: '10 mins ago', status: 'In Stock' },
  { id: '2', name: 'Whole Milk', category: 'Dairy', stock: 15, price: 3.49, lastSold: '2 mins ago', status: 'Low Stock' },
  { id: '3', name: 'Sourdough Bread', category: 'Bakery', stock: 0, price: 4.99, lastSold: '1 hour ago', status: 'Out of Stock' },
  { id: '4', name: 'Chicken Breast', category: 'Meat', stock: 45, price: 8.99, lastSold: '15 mins ago', status: 'In Stock' },
  { id: '5', name: 'Avocados', category: 'Produce', stock: 8, price: 1.50, lastSold: '5 mins ago', status: 'Low Stock' },
];

const Inventory: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const handleForecast = async (product: Product) => {
    if (selectedProduct?.id === product.id && forecast) return; // Already selected and loaded
    
    setSelectedProduct(product);
    setLoadingForecast(true);
    setForecast(null);
    try {
      // Simulating sales history for the forecast
      const mockProductData = {
        product: product.name,
        currentStock: product.stock,
        avgDailySales: Math.floor(Math.random() * 50) + 10,
        seasonalFactor: 1.2,
        upcomingPromotions: false
      };
      
      const result = await getInventoryForecast(mockProductData);
      setForecast(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Product List */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-semibold text-slate-800">Inventory Management</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  onClick={() => handleForecast(product)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedProduct?.id === product.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <td className="p-4 font-medium text-slate-800">{product.name}</td>
                  <td className="p-4 text-slate-600">{product.category}</td>
                  <td className="p-4 text-slate-600">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`text-[10px] font-bold uppercase transition-opacity ${selectedProduct?.id === product.id ? 'opacity-100 text-blue-600' : 'opacity-0'}`}>Selected</span>
                      <ChevronRight size={18} className={`${selectedProduct?.id === product.id ? 'text-blue-600 translate-x-1' : 'text-slate-300'} transition-all`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Forecast Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <RefreshCw size={18} className={`text-blue-600 ${loadingForecast ? 'animate-spin' : ''}`}/> 
            Demand Forecast
          </h2>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          {!selectedProduct ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center animate-pulse">
              <Package size={64} className="mb-4 opacity-20"/>
              <p className="font-medium">Select a product from the list</p>
              <p className="text-xs mt-1">Click any row to generate an AI demand forecast.</p>
            </div>
          ) : loadingForecast ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-slate-800 font-bold uppercase tracking-widest text-[10px]">AI Processing</p>
              <p className="text-slate-500 text-sm mt-2">Analyzing {selectedProduct.name} metrics...</p>
            </div>
          ) : forecast ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{selectedProduct.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Prediction Engine v4.0</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                  Verified
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{forecast.analysis}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Forecast Demand</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{forecast.predictedDemand}</span>
                    <span className="text-xs font-bold text-slate-400">units</span>
                  </div>
                </div>
                <div className={`border p-4 rounded-2xl shadow-sm ${forecast.reorderRecommendation ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Auto Reorder</p>
                  <p className={`text-xl font-black ${forecast.reorderRecommendation ? 'text-red-700' : 'text-emerald-700'}`}>
                    {forecast.reorderRecommendation ? 'URGENT' : 'STABLE'}
                  </p>
                </div>
              </div>
              
              {forecast.reorderRecommendation && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 text-xs uppercase tracking-widest">Supply Chain Action</h4>
                    <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                      Recommended batch size: <span className="font-black underline">{forecast.suggestedOrderQuantity} units</span>.
                    </p>
                    <button className="mt-3 text-[10px] font-black text-white bg-amber-600 px-3 py-1.5 rounded-lg uppercase hover:bg-amber-700 transition-colors">
                      Execute Order Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-red-500 p-6">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p className="font-bold">Forecast Failure</p>
              <p className="text-xs mt-2">The AI model encountered an error analyzing this product. Please try again.</p>
              <button onClick={() => selectedProduct && handleForecast(selectedProduct)} className="mt-4 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg">Retry Analysis</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;