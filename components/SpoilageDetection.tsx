import React, { useState, useRef } from 'react';
import { 
  Biohazard, GlassWater, Trash2, ThermometerSun, Upload, 
  AlertTriangle, CheckCircle2, RefreshCcw, Info, 
  FileText, ShieldAlert, Sparkles, Clock, MapPin
} from 'lucide-react';
import { detectSpoilage } from '../services/geminiService';
import { SpoilageAlert } from '../types';

const SpoilageDetection: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<SpoilageAlert[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runSpoilageAudit(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runSpoilageAudit = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await detectSpoilage(file);
      setReport(result);
      
      const resLower = result.toLowerCase();
      const newAlerts: SpoilageAlert[] = [];

      if (resLower.includes('damaged') || resLower.includes('crushed') || resLower.includes('packaging')) {
        newAlerts.push({
          id: 's1',
          timestamp: new Date(),
          location: 'Aisle 2, Bottom Shelf',
          type: 'Damaged Packaging',
          severity: 'Medium',
          details: 'Dented canned goods detected. Potential compromise of seal integrity.',
          isResolved: false
        });
      }
      if (resLower.includes('spill') || resLower.includes('leak') || resLower.includes('liquid')) {
        newAlerts.push({
          id: 's2',
          timestamp: new Date(),
          location: 'Dairy Aisle, Row 4',
          type: 'Spill/Contamination',
          severity: 'Critical',
          details: 'Liquid spill detected near milk refrigeration unit. Immediate cleanup required to prevent slips.',
          isResolved: false
        });
      }
      if (resLower.includes('expired') || resLower.includes('past date')) {
        newAlerts.push({
          id: 's3',
          timestamp: new Date(),
          location: 'Bakery, Fresh Rack',
          type: 'Expired Product',
          severity: 'High',
          details: 'Pre-packaged bread identified with expiration date of yesterday.',
          isResolved: false
        });
      }

      setAlerts(prev => [...newAlerts, ...prev]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <Biohazard size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Risks</p>
            <p className="text-lg font-bold text-slate-800">{alerts.filter(a => !a.isResolved).length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <GlassWater size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spill Incidents</p>
            <p className="text-lg font-bold text-slate-800">{alerts.filter(a => a.type === 'Spill/Contamination').length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ThermometerSun size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Score</p>
            <p className="text-lg font-bold text-slate-800">92.4</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Status</p>
            <p className="text-lg font-bold text-slate-800">Stable</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Visual Inspection Workbench */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">AI Quality Control Scanner</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-lg"
              >
                <Upload size={14} /> Inspect Media
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
                  <img src={selectedMedia} alt="Quality Feed" className="max-h-full max-w-full object-contain rounded-lg opacity-60" />
                )}
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <RefreshCcw className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-xs font-bold tracking-[0.3em] uppercase drop-shadow-lg text-center px-4">Detecting Hazards & Spoilage...</p>
                  </div>
                )}
                
                {/* Visual Indicators for Hazards */}
                {!isAnalyzing && alerts.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-[25%] left-[20%] w-[120px] h-[100px] border-2 border-rose-500 bg-rose-500/10 rounded-lg flex flex-col justify-end p-2 animate-pulse">
                       <span className="text-[10px] bg-rose-600 text-white font-bold w-fit px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <Biohazard size={10} /> DAMAGED PKG
                       </span>
                    </div>
                    <div className="absolute bottom-[15%] right-[30%] w-[180px] h-[80px] border-2 border-blue-500 bg-blue-500/10 rounded-lg flex flex-col justify-end p-2">
                       <span className="text-[10px] bg-blue-600 text-white font-bold w-fit px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <GlassWater size={10} /> SPILL DETECTED
                       </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <Biohazard className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload shelf footage to detect damage or leaks.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">Quality Assurance Vision Core</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-rose-500" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safety Inspection Log</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Action Queue Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Trash2 size={18} className="text-rose-600" />
              Cleanup Queue
            </h3>
            <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">
              Urgent
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <CheckCircle2 size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">No Spoilage Detected</p>
              </div>
            ) : (
              alerts.map((a) => (
                <div key={a.id} className={`p-4 rounded-xl border transition-all ${
                  a.isResolved ? 'bg-slate-50 border-slate-200 opacity-60' : 
                  a.severity === 'Critical' ? 'bg-rose-50 border-rose-100 ring-1 ring-rose-200' : 'bg-white border-slate-200'
                }`}>
                   <div className="flex justify-between items-start mb-2">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        a.severity === 'Critical' ? 'bg-rose-600 text-white animate-pulse' : 
                        a.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {a.severity} Risk
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                   
                   <h5 className="text-xs font-black text-slate-800 mb-1 flex items-center gap-1">
                      <MapPin size={10} className="text-rose-500" /> {a.location}
                   </h5>
                   <p className="text-[11px] font-bold text-rose-700 mb-2">{a.type}</p>
                   <p className="text-[11px] text-slate-600 leading-relaxed mb-4">{a.details}</p>
                   
                   {!a.isResolved ? (
                    <button 
                      onClick={() => resolveAlert(a.id)}
                      className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" /> Mark Resolved
                    </button>
                   ) : (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold justify-center bg-emerald-50 py-1 rounded-lg">
                      <CheckCircle2 size={12} /> Hazards Cleared
                    </div>
                   )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <Info size={14} className="text-rose-500" /> 
                <span>AI Prediction: Spill probability increases near unit H7 during rush hour.</span>
             </div>
             <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                Full Sanitary Audit
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpoilageDetection;