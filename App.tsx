import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, MessageSquare, 
  ShieldCheck, Megaphone, Menu, X, LayoutGrid, 
  ClipboardCheck, Tag, Box, Hourglass, Users,
  Ruler, Biohazard, MonitorPlay, ShieldAlert
} from 'lucide-react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import CustomerSupport from './components/CustomerSupport';
import Security from './components/Security';
import Marketing from './components/Marketing';
import ShelfMonitoring from './components/ShelfMonitoring';
import PlanogramCompliance from './components/PlanogramCompliance';
import PricingDetection from './components/PricingDetection';
import InventoryTracking from './components/InventoryTracking';
import OOSPrediction from './components/OOSPrediction';
import CustomerBehaviour from './components/CustomerBehaviour';
import ShelfSpaceOptimisation from './components/ShelfSpaceOptimisation';
import SpoilageDetection from './components/SpoilageDetection';
import PromoMonitoring from './components/PromoMonitoring';
import TheftDetection from './components/TheftDetection';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-2 px-2 mb-8 mt-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Supermarket<span className="text-blue-600">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={View.INVENTORY} icon={ShoppingCart} label="Inventory & Forecast" />
            <NavItem view={View.OOS_PREDICTION} icon={Hourglass} label="OOS Prediction" />
            <NavItem view={View.INVENTORY_TRACKING} icon={Box} label="Visual Tracking" />
            <NavItem view={View.SHELF_MONITORING} icon={LayoutGrid} label="Shelf Monitoring" />
            <NavItem view={View.PLANOGRAM_COMPLIANCE} icon={ClipboardCheck} label="Planogram Audit" />
            <NavItem view={View.PRICING_DETECTION} icon={Tag} label="Price Audit" />
            <NavItem view={View.SHELF_SPACE_OPTIMISATION} icon={Ruler} label="Shelf Space" />
            <NavItem view={View.CUSTOMER_BEHAVIOUR} icon={Users} label="Customer Behaviour" />
            <NavItem view={View.SPOILAGE_DETECTION} icon={Biohazard} label="Spoilage & Damage" />
            <NavItem view={View.PROMO_MONITORING} icon={MonitorPlay} label="Promo Monitoring" />
            <NavItem view={View.THEFT_DETECTION} icon={ShieldAlert} label="Theft & Shrinkage" />
            <NavItem view={View.SUPPORT} icon={MessageSquare} label="Customer Support" />
            <NavItem view={View.SECURITY} icon={ShieldCheck} label="Security & Vision" />
            <NavItem view={View.MARKETING} icon={Megaphone} label="Marketing Generator" />
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1">System Status</p>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Core Online
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-900">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-900">SupermarketAI</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-bold text-slate-800">
                {currentView === View.DASHBOARD && 'Business Dashboard'}
                {currentView === View.INVENTORY && 'Smart Inventory'}
                {currentView === View.SUPPORT && 'Customer Support AI'}
                {currentView === View.SECURITY && 'Security & Monitoring'}
                {currentView === View.MARKETING && 'AI Marketing Studio'}
                {currentView === View.SHELF_MONITORING && 'Real-time Shelf Monitoring'}
                {currentView === View.PLANOGRAM_COMPLIANCE && 'Planogram Audit & Compliance'}
                {currentView === View.PRICING_DETECTION && 'Pricing & Label Audit'}
                {currentView === View.INVENTORY_TRACKING && 'Visual Inventory Tracking'}
                {currentView === View.OOS_PREDICTION && 'Out of Stock Prediction'}
                {currentView === View.CUSTOMER_BEHAVIOUR && 'Customer Behaviour Analysis'}
                {currentView === View.SHELF_SPACE_OPTIMISATION && 'Shelf Space Optimisation'}
                {currentView === View.SPOILAGE_DETECTION && 'Spoilage & Quality Control'}
                {currentView === View.PROMO_MONITORING && 'Promotional Display Monitoring'}
                {currentView === View.THEFT_DETECTION && 'Theft & Shrinkage Detection'}
              </h2>
              <p className="text-slate-500">
                {currentView === View.DASHBOARD && 'Real-time overview of store performance and sales.'}
                {currentView === View.INVENTORY && 'Track stock levels and forecast demand with AI.'}
                {currentView === View.SUPPORT && 'Assist customers with queries and product recommendations.'}
                {currentView === View.SECURITY && 'Monitor shelf status and detect potential hazards.'}
                {currentView === View.MARKETING && 'Generate engaging ad copy and visuals instantly.'}
                {currentView === View.SHELF_MONITORING && 'AI-powered detection of empty spaces and shelf health.'}
                {currentView === View.PLANOGRAM_COMPLIANCE && 'Compare actual shelf layouts against master planograms.'}
                {currentView === View.PRICING_DETECTION && 'Use AI Vision to detect missing tags, incorrect prices, and expired promotions.'}
                {currentView === View.INVENTORY_TRACKING && 'Identify products by brand, SKU, and category using visual data.'}
                {currentView === View.OOS_PREDICTION && 'Analyze current fill levels and velocity to predict exactly when items will run out.'}
                {currentView === View.CUSTOMER_BEHAVIOUR && 'Analyze heatmaps, dwell time, and shelf attention to optimize store layout.'}
                {currentView === View.SHELF_SPACE_OPTIMISATION && 'Measure brand occupancy and contractual share-of-shelf compliance.'}
                {currentView === View.SPOILAGE_DETECTION && 'Detect damaged packaging, spills, contamination, and expired fresh products.'}
                {currentView === View.PROMO_MONITORING && 'Validate execution and compliance of promotional stands and end-caps.'}
                {currentView === View.THEFT_DETECTION && 'Detect suspicious removal of products, concealment, and shelf sweeping patterns.'}
              </p>
            </div>

            <div className="h-full animate-fade-in">
              {currentView === View.DASHBOARD && <Dashboard />}
              {currentView === View.INVENTORY && <Inventory />}
              {currentView === View.SUPPORT && <CustomerSupport />}
              {currentView === View.SECURITY && <Security />}
              {currentView === View.MARKETING && <Marketing />}
              {currentView === View.SHELF_MONITORING && <ShelfMonitoring />}
              {currentView === View.PLANOGRAM_COMPLIANCE && <PlanogramCompliance />}
              {currentView === View.PRICING_DETECTION && <PricingDetection />}
              {currentView === View.INVENTORY_TRACKING && <InventoryTracking />}
              {currentView === View.OOS_PREDICTION && <OOSPrediction />}
              {currentView === View.CUSTOMER_BEHAVIOUR && <CustomerBehaviour />}
              {currentView === View.SHELF_SPACE_OPTIMISATION && <ShelfSpaceOptimisation />}
              {currentView === View.SPOILAGE_DETECTION && <SpoilageDetection />}
              {currentView === View.PROMO_MONITORING && <PromoMonitoring />}
              {currentView === View.THEFT_DETECTION && <TheftDetection />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;