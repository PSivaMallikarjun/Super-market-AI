import React, { useState, useRef } from 'react';
import { 
  Scan, AlertCircle, CheckCircle2, LayoutGrid, Upload, 
  RefreshCcw, Info, ArrowUpRight, Check, Trash2, Clock 
} from 'lucide-react';
import { monitorShelfStock } from '../services/geminiService';
import { ShelfAlert } from '../types';

const ShelfMonitoring: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<ShelfAlert[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setReport(null);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await monitorShelfStock(file);
      setReport(result);
      
      // Parse alerts from text (simplified mock parsing for UI simulation)
      const newAlerts: ShelfAlert[] = [];
      if (result.toLowerCase().includes('empty') || result.toLowerCase().includes('out of stock')) {
        newAlerts.push({
          id: Date.now().toString() + '-oos',
          timestamp: new Date(),
          location: 'Aisle 4, Section B',
          type: 'Out of Stock',
          priority: 'High',
          details: 'Multiple empty spots detected on middle shelf.',
          isResolved: false
        });
      }
      if (result.toLowerCase().includes('low') || result.toLowerCase().includes('back')) {
        newAlerts.push({
          id: Date.now().toString() + '-low',
          timestamp: new Date(),
          location: 'Aisle 4, Section B',
          type: 'Low Stock',
          priority: 'Medium',
          details: 'Products pushed to back, replenishment suggested.',
          isResolved: false
        });
      }
      if (result.toLowerCase().includes('misplaced') || result.toLowerCase().includes('planogram')) {
        newAlerts.push({
          id: Date.now().toString() + '-plano',
          timestamp: new Date(),
          location: 'Aisle 4, Section B',
          type: 'Planogram Mismatch',
          priority: 'Low',
          details: 'Incorrect product SKU found in facial tissue section.',
          isResolved: false
        });
      }
      
      setAlerts(prev => [...newAlerts, ...prev]);

      // Extract score if present
      const scoreMatch = result.match(/(\d+)\s*\/\s*100/);
      if (scoreMatch) {
        setHealthScore(parseInt(scoreMatch[1]));
      } else {
        setHealthScore(Math.floor(Math.random() * 20) + 70); // Fallback
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Metrics & Feed Area */}
      <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
        
        {/* Health Metrics Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shelf Health</p>
              <LayoutGrid size={16} className="text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-black ${
                healthScore && healthScore > 80 ? 'text-green-600' : healthScore && healthScore > 50 ? 'text-amber-500' : 'text-slate-900'
              }`}>
                {healthScore !== null ? `${healthScore}%` : '--'}
              </span>
              <span className="text-xs text-slate-400 mb-1">Target: 95%</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  healthScore && healthScore > 80 ? 'bg-green-500' : 'bg-amber-500'
                }`} 
                style={{ width: `${healthScore || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Alerts</p>
              <AlertCircle size={16} className="text-red-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">
                {alerts.filter(a => !a.isResolved).length}
              </span>
              <span className="text-xs text-red-500 mb-1 flex items-center gap-0.5">
                Critical <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Requires immediate staff attention</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Planogram Compliance</p>
              <Scan size={16} className="text-indigo-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">92%</span>
              <span className="text-xs text-green-500 mb-1 font-medium">Optimal</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Weekly average: 89%</p>
          </div>
        </div>

        {/* Monitoring Feed */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h3 className="font-bold text-slate-800 text-sm">Vision Feed: Aisle 4 (Ambient)</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Upload size={14} /> New Scan
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
            {selectedImage ? (
              <div className="relative w-full h-full">
                <img src={selectedImage} alt="Shelf Scan" className="w-full h-full object-contain rounded-lg opacity-90" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[2px] flex flex-col items-center justify-center animate-pulse">
                    <div className="w-48 h-1 bg-indigo-500 relative overflow-hidden rounded-full mb-4">
                      <div className="absolute inset-0 bg-white w-1/3 animate-[scan_2s_infinite]"></div>
                    </div>
                    <p className="text-white text-sm font-bold tracking-widest uppercase">AI Stock Analysis In Progress</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Upload className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">No feed selected. Upload a frame to start monitoring.</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <Info size={12}/> Analysis Findings
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Restock Alerts Sidebar */}
      <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <RefreshCcw size={18} className="text-indigo-600" />
            Restock Queue
          </h3>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
            Real-time
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {alerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
              <CheckCircle2 size={48} className="text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-500">No active alerts</p>
              <p className="text-xs text-slate-400">Shelves appear compliant and stocked.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`group p-4 rounded-xl border transition-all ${
                  alert.isResolved 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : alert.priority === 'High'
                    ? 'bg-red-50 border-red-100'
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    alert.type === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                    alert.type === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {alert.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button onClick={() => deleteAlert(alert.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 mb-1">{alert.location}</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{alert.details}</p>
                
                {!alert.isResolved ? (
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={14} className="text-green-600" />
                    Mark Restocked
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-green-600 font-bold py-1">
                    <CheckCircle2 size={14} /> Completed
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">System Uptime</span>
            <span className="font-bold text-slate-700">99.98%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { left: -33%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ShelfMonitoring;