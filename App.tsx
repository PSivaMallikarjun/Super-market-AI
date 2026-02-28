import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, MessageSquare, 
  ShieldCheck, Megaphone, Menu, X, LayoutGrid, 
  ClipboardCheck, Tag, Box, Hourglass, Users,
  Ruler, Biohazard, MonitorPlay, ShieldAlert,
  PlayCircle, Info, Lightbulb, Star, Sparkles
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
import AppTour from './components/AppTour';
import StorefrontDesigner from './components/StorefrontDesigner';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.ABOUT); // Changed initial view to View.ABOUT
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label, color = 'blue' }: { view: View, icon: any, label: string, color?: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? `bg-${color}-600 text-white shadow-lg shadow-${color}-100` 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Inter']">
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
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">Supermarket<span className="text-indigo-600">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            <div className="px-3 mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Hub</p>
            </div>
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" color="indigo" />
            {/* Changed from View.DEMO to View.ABOUT, now for App Tour */}
            <NavItem view={View.ABOUT} icon={Info} label="App Tour & Features" color="indigo" /> 
            <NavItem view={View.STOREFRONT_DESIGNER} icon={Sparkles} label="Storefront Designer" color="purple" />
            
            <div className="px-3 mt-6 mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Ops</p>
            </div>
            <NavItem view={View.INVENTORY} icon={ShoppingCart} label="Inventory & Forecast" />
            <NavItem view={View.OOS_PREDICTION} icon={Hourglass} label="OOS Prediction" />
            <NavItem view={View.INVENTORY_TRACKING} icon={Box} label="Visual Tracking" />
            <NavItem view={View.SHELF_MONITORING} icon={LayoutGrid} label="Shelf Monitoring" />
            
            <div className="px-3 mt-6 mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance & Quality</p>
            </div>
            <NavItem view={View.PLANOGRAM_COMPLIANCE} icon={ClipboardCheck} label="Planogram Audit" />
            <NavItem view={View.PRICING_DETECTION} icon={Tag} label="Price Audit" />
            <NavItem view={View.SHELF_SPACE_OPTIMISATION} icon={Ruler} label="Shelf Space" />
            <NavItem view={View.SPOILAGE_DETECTION} icon={Biohazard} label="Spoilage & Damage" />
            
            <div className="px-3 mt-6 mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security & Strategy</p>
            </div>
            <NavItem view={View.CUSTOMER_BEHAVIOUR} icon={Users} label="Customer Behaviour" />
            <NavItem view={View.PROMO_MONITORING} icon={MonitorPlay} label="Promo Monitoring" />
            <NavItem view={View.THEFT_DETECTION} icon={ShieldAlert} label="Theft & Shrinkage" />
            <NavItem view={View.SUPPORT} icon={MessageSquare} label="Customer Support" />
            <NavItem view={View.SECURITY} icon={ShieldCheck} label="Security & Vision" />
            <NavItem view={View.MARKETING} icon={Megaphone} label="Marketing Generator" />
          </nav>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-black uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Gemini Core Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter">Supermarket<span className="text-indigo-600">AI</span></h1>
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
            {/* Adjusted header condition: no longer excludes View.DEMO but now includes View.ABOUT */}
            {currentView !== View.ABOUT && ( 
              <div className="mb-8 hidden lg:block">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {currentView === View.DASHBOARD && 'Business Intelligence Dashboard'}
                  {currentView === View.INVENTORY && 'AI Inventory Forecasting'}
                  {currentView === View.SUPPORT && 'Customer Support Assistant'}
                  {currentView === View.SECURITY && 'AI Vision Security'}
                  {currentView === View.MARKETING && 'Ad Creative Studio'}
                  {currentView === View.SHELF_MONITORING && 'Live Shelf Health Monitor'}
                  {currentView === View.PLANOGRAM_COMPLIANCE && 'Planogram Audit Engine'}
                  {currentView === View.PRICING_DETECTION && 'Price Accuracy Control'}
                  {currentView === View.INVENTORY_TRACKING && 'Visual Asset Tracking'}
                  {currentView === View.OOS_PREDICTION && 'Out-of-Stock Predictive Engine'}
                  {currentView === View.CUSTOMER_BEHAVIOUR && 'Behavioural Traffic Heatmaps'}
                  {currentView === View.SHELF_SPACE_OPTIMISATION && 'Brand Share Analysis'}
                  {currentView === View.SPOILAGE_DETECTION && 'Quality & Damage Control'}
                  {currentView === View.PROMO_MONITORING && 'Promotional Execution Monitor'}
                  {currentView === View.THEFT_DETECTION && 'Loss Prevention AI'}
                  {currentView === View.STOREFRONT_DESIGNER && 'AI Storefront Designer'}
                </h2>
                <p className="text-slate-500 font-medium text-lg mt-1">
                  {currentView === View.DASHBOARD && 'Real-time performance analytics and store health.'}
                  {currentView === View.INVENTORY && 'Automated demand prediction and reorder logic.'}
                  {currentView === View.SUPPORT && 'Engage customers with intelligent AI support.'}
                  {currentView === View.SECURITY && 'Proactive security monitoring and hazard detection.'}
                  {currentView === View.MARKETING && 'Generate conversion-optimized campaigns in seconds.'}
                  {currentView === View.SHELF_MONITORING && 'Real-time visual checks of stock levels and shelf integrity.'}
                  {currentView === View.PLANOGRAM_COMPLIANCE && 'Ensure visual merchandising matches your corporate plan.'}
                  {currentView === View.PRICING_DETECTION && 'Zero-error price tag and promotion label auditing.'}
                  {currentView === View.INVENTORY_TRACKING && 'Autonomous SKU recognition via visual feeds.'}
                  {currentView === View.OOS_PREDICTION && 'Predict exactly when shelves will go empty.'}
                  {currentView === View.CUSTOMER_BEHAVIOUR && 'Optimize store layouts based on customer movement.'}
                  {currentView === View.SHELF_SPACE_OPTIMISATION && 'Manage supplier contracts and space share metrics.'}
                  {currentView === View.SPOILAGE_DETECTION && 'Identify spills, damaged boxes, and expired produce.'}
                  {currentView === View.PROMO_MONITORING && 'Audit the setup and branding of your end-caps.'}
                  {currentView === View.THEFT_DETECTION && 'Identify suspicious patterns before loss occurs.'}
                  {currentView === View.STOREFRONT_DESIGNER && 'Visually redesign and optimize your store exterior.'}
                </p>
              </div>
            )}
            {currentView === View.ABOUT && (
              <div className="mb-8 hidden lg:block">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">SupermarketAI Guided Tour</h2>
                <p className="text-slate-500 font-medium text-lg mt-1">Explore our innovative AI features and their retail value.</p>
              </div>
            )}

            <div className="h-full">
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
              {currentView === View.STOREFRONT_DESIGNER && <StorefrontDesigner />}
              {/* Render AppTour here, passing setCurrentView */}
              {currentView === View.ABOUT && <AppTour setCurrentView={setCurrentView} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;