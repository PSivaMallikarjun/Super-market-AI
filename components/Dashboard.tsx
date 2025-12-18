import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Sparkles, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { getBusinessInsights } from '../services/geminiService';
import { SalesData } from '../types';

const mockSalesData: SalesData[] = [
  { name: 'Mon', sales: 4000, revenue: 2400 },
  { name: 'Tue', sales: 3000, revenue: 1398 },
  { name: 'Wed', sales: 2000, revenue: 9800 },
  { name: 'Thu', sales: 2780, revenue: 3908 },
  { name: 'Fri', sales: 1890, revenue: 4800 },
  { name: 'Sat', sales: 2390, revenue: 3800 },
  { name: 'Sun', sales: 3490, revenue: 4300 },
];

const StatCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
        {icon}
      </div>
    </div>
    <p className="text-sm text-green-600 mt-4 flex items-center font-medium">
      <TrendingUp size={16} className="mr-1" />
      {trend} <span className="text-slate-400 ml-1 font-normal">vs last week</span>
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const generateInsights = async () => {
    setLoadingInsights(true);
    try {
      const data = await getBusinessInsights(mockSalesData);
      setInsights(data.insights);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <button 
          onClick={generateInsights}
          disabled={loadingInsights}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loadingInsights ? 'Analyzing Data...' : 'Generate AI Insights'}
        </button>
      </div>

      {insights.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in">
          <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600"/> Gemini Analysis
          </h3>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-indigo-800 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$54,230" icon={<DollarSign size={24}/>} trend="+12.5%" />
        <StatCard title="Total Sales" value="1,430" icon={<ShoppingCart size={24}/>} trend="+8.2%" />
        <StatCard title="Active Customers" value="892" icon={<Users size={24}/>} trend="+5.4%" />
        <StatCard title="Avg. Order Value" value="$38.50" icon={<DollarSign size={24}/>} trend="+2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Sales Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
