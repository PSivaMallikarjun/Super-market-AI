import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Flame, Map, MousePointer2, Upload, 
  TrendingUp, Eye, Zap, Info, FileText, 
  BarChart2, Maximize2, RefreshCcw, Camera,
  Play, Pause, Layers, LayoutPanelLeft, Move
} from 'lucide-react';
import { analyzeCustomerBehaviour } from '../services/geminiService';
import { BehaviourInsight } from '../types';

const CustomerBehaviour: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [insights, setInsights] = useState<BehaviourInsight[]>([]);
  const [trafficVolume, setTrafficVolume] = useState<string>('Moderate');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(type);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCustomerBehaviour(file);
      setReport(result);
      
      const resLower = result.toLowerCase();
      const newInsights: BehaviourInsight[] = [];

      // Improved parsing simulation
      if (resLower.includes('hot zone') || resLower.includes('congregate')) {
        newInsights.push({
          id: 'b1',
          type: 'Hot Zone',
          location: 'End-cap Aisle 3',
          description: 'High dwell time detected. Customers often pause here for 15s+ to look at seasonal displays.',
          score: 88
        });
      }
      if (resLower.includes('attention') || resLower.includes('reach')) {
        newInsights.push({
          id: 'b2',
          type: 'High Interaction',
          location: 'Middle Shelf, Section B',
          description: 'Peak engagement zone. 70% of product reaches happen at this height.',
          score: 94
        });
      }
      if (resLower.includes('obstruction') || resLower.includes('dead zone') || resLower.includes('flow')) {
        newInsights.push({
          id: 'b3',
          type: 'Path Obstruction',
          location: 'Entry Lane',
          description: 'Flow bottleneck identified. Basket placement is hindering natural shopper paths.',
          score: 52
        });
      }

      setInsights(newInsights);
      setTrafficVolume(resLower.includes('high') || resLower.includes('busy') ? 'High' : 'Moderate');
      
      // Auto-enable heatmap if we found hot zones
      if (newInsights.some(i => i.type === 'Hot Zone')) {
        setShowHeatmap(true);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Behaviour Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shopper Density</p>
            <Users size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{trafficVolume}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-bold">
            <TrendingUp size={10} /> +12% vs Morning
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Dwell Time</p>
            <Flame size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">42.5s</p>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full">
            <div className="bg-red-500 h-full w-[65%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shelf Interaction</p>
            <MousePointer2 size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">18.5%</p>
          <p className="text-[10px] text-slate-400 mt-1">Conversions per Touch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Path Efficiency</p>
            <Move size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">B+</p>
          <p className="text-[10px] text-slate-400 mt-1">Aisle Flow Rating</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Visual Heatmap Area */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Map size={18} className="text-orange-600" />
                <h3 className="font-bold text-slate-800 text-sm">Visual Analytics Workbench</h3>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  showHeatmap ? 'bg-orange-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <Layers size={14} /> Thermal Heatmap
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-black transition-colors shadow-lg"
              >
                <Upload size={14} /> Analyze Feed
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
            </div>
          </div>

          <div className={`flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4 transition-all duration-500 ${showHeatmap ? 'hue-rotate-[180deg] saturate-200 contrast-125' : ''}`}>
            {selectedMedia ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video 
                    ref={videoRef}
                    src={selectedMedia} 
                    className="max-h-full max-w-full rounded-lg shadow-2xl" 
                    controls 
                    autoPlay 
                    muted 
                    loop
                  />
                ) : (
                  <img src={selectedMedia} alt="Aisle Feed" className="max-h-full max-w-full object-contain rounded-lg opacity-90 shadow-2xl" />
                )}
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                    <div className="w-64 h-1 bg-white/20 rounded-full relative overflow-hidden mb-6">
                       <div className="absolute inset-0 bg-orange-500 w-1/3 animate-[scan_2s_infinite]"></div>
                    </div>
                    <div className="flex flex-col items-center animate-pulse">
                      <RefreshCcw className="w-10 h-10 text-white animate-spin mb-4" />
                      <p className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Processing Shopper Biometrics</p>
                    </div>
                  </div>
                )}
                
                {/* Heatmap Layers */}
                {!isAnalyzing && showHeatmap && insights.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div className="absolute top-[25%] left-[40%] w-40 h-40 bg-red-600/50 rounded-full blur-[40px] animate-pulse"></div>
                    <div className="absolute top-[30%] left-[42%] w-20 h-20 bg-yellow-400/40 rounded-full blur-[25px] animate-ping"></div>
                    <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-orange-500/30 rounded-full blur-[35px]"></div>
                    
                    {/* Hotspot Indicators */}
                    <div className="absolute top-[20%] left-[38%] border border-white/50 bg-red-600/80 p-2 rounded-lg backdrop-blur-md shadow-2xl scale-[0.8] rotate-[180deg] hue-rotate-[-180deg]">
                       <p className="text-[10px] font-black text-white uppercase tracking-tighter">Engagement Spike</p>
                       <p className="text-sm font-black text-white">88% Interact</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner group cursor-pointer hover:border-orange-500 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload CCTV frame or mobile footage.</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded">MP4</span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded">JPG</span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded">MOV</span>
                </div>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-orange-500" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment Psychology Report</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Insight Stream Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Zap size={18} className="text-orange-600" />
              Strategic Insights
            </h3>
            <BarChart2 size={16} className="text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {insights.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Eye size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">Awaiting Observation</p>
                <p className="text-xs text-slate-400 mt-2 px-6">Upload media to begin spatial traffic analysis.</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div key={insight.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-lg transition-all group">
                   <div className="flex justify-between items-start mb-2">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        insight.type === 'Hot Zone' ? 'bg-red-100 text-red-700' :
                        insight.type === 'High Interaction' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.type}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{insight.location}</span>
                   </div>
                   
                   <p className="text-xs text-slate-600 leading-relaxed mb-3">{insight.description}</p>
                   
                   <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex-1 mr-4">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                            className={`h-full ${insight.score > 80 ? 'bg-red-500' : 'bg-orange-500'}`} 
                            style={{ width: `${insight.score}%` }}
                           ></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-800">{insight.score}% Impact</span>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-3 text-xs text-slate-700 font-bold mb-3">
                <LayoutPanelLeft size={16} className="text-orange-500 shrink-0" /> 
                Optimization Tasks
             </div>
             <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                  <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                  Relocate "Seasonal Snacks" to Hot Zone A
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  Clear entry obstruction for better flow
                </div>
             </div>
             <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md">
                <Maximize2 size={14} /> Download Full Layout Report
             </button>
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

export default CustomerBehaviour;