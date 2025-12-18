import React, { useState, useRef } from 'react';
import { 
  Hourglass, TrendingDown, Upload, Loader2, 
  AlertTriangle, CheckCircle2, ListFilter, 
  Activity, Zap, Clock, Calendar, BarChart3,
  ThermometerSnowflake, FileText
} from 'lucide-react';
import { predictOutOfStock } from '../services/geminiService';
import { StockPrediction } from '../types';

const OOSPrediction: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<StockPrediction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runPrediction(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runPrediction = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Provide mock historical context
      const history = "Dairy aisle velocity: High. Sunday afternoon peak. Milk depletions average 15 units/hour during this window.";
      const result = await predictOutOfStock(file, history);
      setReport(result);
      
      // Parse predictions from text (simulated parsing)
      const resLower = result.toLowerCase();
      const newPredictions: StockPrediction[] = [];

      if (resLower.includes('milk') || resLower.includes('dairy')) {
        newPredictions.push({
          id: 'p1',
          productName: 'Whole Milk 2L',
          currentFillLevel: 15,
          estimatedTimeRemaining: '1h 12m',
          riskLevel: 'Critical',
          historicalVelocity: '15 units/hr',
          recommendation: 'Replenish within 45 minutes to maintain 100% availability.'
        });
      }
      if (resLower.includes('bread') || resLower.includes('bakery')) {
        newPredictions.push({
          id: 'p2',
          productName: 'Artisan Sourdough',
          currentFillLevel: 40,
          estimatedTimeRemaining: '4h 20m',
          riskLevel: 'Warning',
          historicalVelocity: '5 units/hr',
          recommendation: 'Schedule for next replenishment cycle (Batch B).'
        });
      }
      
      setPredictions(newPredictions);

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Predictive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <Hourglass size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stockout Window</p>
            <p className="text-lg font-bold text-slate-800">~72 mins</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Burn Rate</p>
            <p className="text-lg font-bold text-slate-800">12.4 u/hr</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</p>
            <p className="text-lg font-bold text-slate-800">94.2%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Urgency</p>
            <p className="text-lg font-bold text-slate-800">High</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Prediction Feed Area */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">Proactive Stock Analysis</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-md shadow-rose-100"
              >
                <Upload size={14} /> Upload Aisle Feed
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
            </div>
          </div>

          <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
            {selectedMedia ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={selectedMedia} alt="Prediction Context" className="max-h-full max-w-full object-contain rounded-lg opacity-60" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-xs font-bold tracking-[0.3em] uppercase drop-shadow-lg">Calculating Burn Rates...</p>
                  </div>
                )}
                
                {/* Visual Time-to-Zero Tags */}
                {!isAnalyzing && predictions.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[30%] left-[20%] p-2 bg-rose-600/90 text-white rounded-lg shadow-xl animate-bounce">
                       <p className="text-[10px] font-black uppercase tracking-tighter">OOS Prediction</p>
                       <p className="text-xl font-black">72m</p>
                    </div>
                    <div className="absolute bottom-[40%] right-[30%] p-2 bg-amber-500/90 text-white rounded-lg shadow-xl">
                       <p className="text-[10px] font-black uppercase tracking-tighter">Depletion Window</p>
                       <p className="text-xl font-black">4.3h</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <Hourglass className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload video/image to predict stock depletions.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">Uses Visual Fill + Velocity Data</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-rose-400" />
                 <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">AI Logistics Report</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Prediction Schedule Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ListFilter size={18} className="text-rose-600" />
              Depletion Queue
            </h3>
            <BarChart3 size={16} className="text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {predictions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Clock size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">No predictions made</p>
              </div>
            ) : (
              predictions.map((p) => (
                <div key={p.id} className={`p-4 rounded-xl border transition-all ${
                  p.riskLevel === 'Critical' ? 'bg-rose-50 border-rose-100 ring-1 ring-rose-200' : 'bg-white border-slate-200'
                }`}>
                   <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{p.productName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{p.historicalVelocity} burn</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        p.riskLevel === 'Critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.riskLevel}
                      </div>
                   </div>

                   <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                           <span>Visual Fill</span>
                           <span>{p.currentFillLevel}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                            className={`h-full ${p.riskLevel === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`} 
                            style={{ width: `${p.currentFillLevel}%` }}
                           ></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Out In</span>
                        <span className="text-lg font-black text-slate-800 leading-none">{p.estimatedTimeRemaining}</span>
                      </div>
                   </div>

                   <div className="p-2 bg-white/50 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed italic">
                      <Zap size={10} className="inline mr-1 text-rose-500" />
                      {p.recommendation}
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <ThermometerSnowflake size={14} /> 
                <span>Freezer Cabinets: Stable Fill</span>
             </div>
             <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                Optimize Replenishment Map
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OOSPrediction;