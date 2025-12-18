import React, { useState, useRef } from 'react';
import { 
  PieChart as PieChartIcon, Ruler, Handshake, Upload, 
  BarChart3, RefreshCcw, Info, CheckCircle2, 
  AlertTriangle, FileText, ChevronRight, LayoutTemplate,
  Target, TrendingUp, Percent
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { analyzeShelfSpace } from '../services/geminiService';
import { BrandSpaceShare } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ShelfSpaceOptimisation: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [shares, setShares] = useState<BrandSpaceShare[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runSpaceAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runSpaceAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeShelfSpace(file);
      setReport(result);
      
      // Parse simulated data based on keywords in Gemini's response
      const resLower = result.toLowerCase();
      const newShares: BrandSpaceShare[] = [];

      if (resLower.includes('coca-cola') || resLower.includes('coke')) {
        newShares.push({
          brand: 'Coca-Cola',
          occupancyPercentage: 35,
          facings: 12,
          contractualTarget: 30,
          complianceStatus: 'Over-Represented'
        });
      }
      if (resLower.includes('pepsi')) {
        newShares.push({
          brand: 'PepsiCo',
          occupancyPercentage: 25,
          facings: 8,
          contractualTarget: 30,
          complianceStatus: 'Non-Compliant'
        });
      }
      if (resLower.includes('nestle') || resLower.includes('water')) {
        newShares.push({
          brand: 'Nestle',
          occupancyPercentage: 20,
          facings: 6,
          contractualTarget: 20,
          complianceStatus: 'Compliant'
        });
      }
      
      // Add a generic "Others" if we found something
      if (newShares.length > 0) {
        const currentTotal = newShares.reduce((acc, curr) => acc + curr.occupancyPercentage, 0);
        if (currentTotal < 100) {
          newShares.push({
            brand: 'Store Brand / Others',
            occupancyPercentage: 100 - currentTotal,
            facings: 4,
            contractualTarget: 20,
            complianceStatus: 'Compliant'
          });
        }
      }

      setShares(newShares);

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <LayoutTemplate size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Diversity</p>
            <p className="text-lg font-bold text-slate-800">{shares.length > 0 ? shares.length : '--'}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Score</p>
            <p className="text-lg font-bold text-slate-800">
              {shares.length > 0 ? `${Math.round((shares.filter(s => s.complianceStatus === 'Compliant').length / shares.length) * 100)}%` : '--'}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium Space Util.</p>
            <p className="text-lg font-bold text-slate-800">84%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Handshake size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Negot. Leverage</p>
            <p className="text-lg font-bold text-slate-800">High</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Spatial Analysis Workbench */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Linear Occupancy Workbench</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Upload size={14} /> Upload Shelf Feed
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
            </div>
          </div>

          <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
            {selectedMedia ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video src={selectedMedia} className="max-h-full max-w-full rounded-lg" controls autoPlay muted loop />
                ) : (
                  <img src={selectedMedia} alt="Shelf Feed" className="max-h-full max-w-full object-contain rounded-lg opacity-70" />
                )}
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <RefreshCcw className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-xs font-bold tracking-[0.3em] uppercase drop-shadow-lg">Calculating Brand Facings...</p>
                  </div>
                )}
                
                {/* Visual Bounding Boxes for Brands */}
                {!isAnalyzing && shares.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-[20%] left-[5%] w-[30%] h-[60%] border-2 border-blue-500 bg-blue-500/10 rounded-lg flex flex-col justify-end p-2">
                       <span className="text-[10px] bg-blue-600 text-white font-bold w-fit px-1.5 py-0.5 rounded shadow-sm">COCA-COLA (35%)</span>
                    </div>
                    <div className="absolute top-[20%] left-[37%] w-[25%] h-[60%] border-2 border-emerald-500 bg-emerald-500/10 rounded-lg flex flex-col justify-end p-2">
                       <span className="text-[10px] bg-emerald-600 text-white font-bold w-fit px-1.5 py-0.5 rounded shadow-sm">PEPSICO (25%)</span>
                    </div>
                    <div className="absolute top-[20%] left-[65%] w-[30%] h-[60%] border-2 border-amber-500 bg-amber-500/10 rounded-lg flex flex-col justify-end p-2">
                       <span className="text-[10px] bg-amber-600 text-white font-bold w-fit px-1.5 py-0.5 rounded shadow-sm">NESTLE (20%)</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <PieChartIcon className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload shelf media to calculate brand share.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">Linear Space & Facing Audit</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-blue-500" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category Management Insights</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Brand Distribution & Contractual Compliance */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden">
          
          {/* Share Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-1/2 overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Percent size={16} className="text-blue-500" />
              Space Occupancy Distribution
            </h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shares}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="occupancyPercentage"
                    nameKey="brand"
                  >
                    {shares.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contractual Compliance List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Handshake size={16} className="text-blue-500" />
                  Supplier Compliance
                </h4>
                <BarChart3 size={16} className="text-slate-400" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {shares.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <Info size={32} className="mb-2" />
                    <p className="text-xs font-bold">Waiting for Audit</p>
                  </div>
                ) : (
                  shares.map((s, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-black text-slate-800">{s.brand}</h5>
                          <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            s.complianceStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                            s.complianceStatus === 'Over-Represented' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {s.complianceStatus}
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Actual Share</span>
                            <span className="text-xs font-black text-slate-900">{s.occupancyPercentage}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Target Share</span>
                            <span className="text-xs font-black text-slate-500">{s.contractualTarget}%</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-50 pt-2">
                          {s.complianceStatus === 'Non-Compliant' ? (
                            <><AlertTriangle size={12} className="text-rose-500" /> <span>Negotiate for more facings</span></>
                          ) : s.complianceStatus === 'Over-Represented' ? (
                            <><TrendingUp size={12} className="text-amber-500" /> <span>Charge premium for excess space</span></>
                          ) : (
                            <><CheckCircle2 size={12} className="text-emerald-500" /> <span>Maintaining contract KPIs</span></>
                          )}
                          <ChevronRight size={12} className="ml-auto text-slate-300" />
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShelfSpaceOptimisation;