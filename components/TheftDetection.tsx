import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, Eye, Upload, RefreshCcw, 
  AlertTriangle, CheckCircle2, FileText, Info,
  Cctv, Zap, Shield, Siren, UserX,
  History, Bell, Radio, Hammer
} from 'lucide-react';
import { detectTheft } from '../services/geminiService';
import { SecurityIncident } from '../types';

const TheftDetection: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runTheftAudit(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runTheftAudit = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await detectTheft(file);
      setReport(result);
      
      const resLower = result.toLowerCase();
      const newIncidents: SecurityIncident[] = [];

      if (resLower.includes('shelf sweeping') || resLower.includes('rapidly')) {
        newIncidents.push({
          id: 'inc-' + Date.now(),
          timestamp: new Date(),
          location: 'Aisle 3 (Premium Spirits)',
          type: 'Shelf Sweeping',
          confidence: 92,
          status: 'Investigating',
          details: 'Suspicious rapid removal of high-value bottled inventory detected.'
        });
      }
      if (resLower.includes('concealment') || resLower.includes('bag') || resLower.includes('clothing')) {
        newIncidents.push({
          id: 'inc-' + (Date.now() + 1),
          timestamp: new Date(),
          location: 'Aisle 7 (Health & Beauty)',
          type: 'Concealment',
          confidence: 88,
          status: 'Investigating',
          details: 'Subject observed placing items into a personal backpack.'
        });
      }
      if (resLower.includes('unusual handling') || resLower.includes('tag')) {
        newIncidents.push({
          id: 'inc-' + (Date.now() + 2),
          timestamp: new Date(),
          location: 'Aisle 12 (Electronics)',
          type: 'Unusual Handling',
          confidence: 75,
          status: 'Investigating',
          details: 'Tampering with security tags on high-margin accessory identified.'
        });
      }

      setIncidents(prev => [...newIncidents, ...prev]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateStatus = (id: string, status: SecurityIncident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Loss Prevention Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <Bell size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Alerts</p>
            <p className="text-lg font-bold text-slate-800">{incidents.filter(i => i.status === 'Investigating' || i.status === 'Dispatched').length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shrinkage Risk</p>
            <p className="text-lg font-bold text-slate-800">Medium</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Radio size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guard Status</p>
            <p className="text-lg font-bold text-slate-800">Ready</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prevention Rate</p>
            <p className="text-lg font-bold text-slate-800">98.2%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Surveillance Workbench */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cctv size={18} className="text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">Security Vision Hub</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-lg"
              >
                <Upload size={14} /> Scan CCTV Feed
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
                  <img src={selectedMedia} alt="Surveillance Feed" className="max-h-full max-w-full object-contain rounded-lg opacity-60" />
                )}
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <RefreshCcw className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-xs font-bold tracking-[0.3em] uppercase drop-shadow-lg text-center px-4">Analyzing Behavioral Patterns...</p>
                  </div>
                )}
                
                {/* Visual Indicators for Suspicious Activity */}
                {!isAnalyzing && incidents.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-[20%] left-[25%] w-[150px] h-[150px] border-2 border-rose-500 bg-rose-500/10 rounded-full flex flex-col items-center justify-center p-2 animate-pulse">
                       <ShieldAlert size={32} className="text-rose-500 mb-1" />
                       <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded shadow-sm">SUSPICIOUS ACT</span>
                    </div>
                  </div>
                )}
                
                {/* Surveillance Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none opacity-50">
                   <div className="text-white font-mono text-[10px] flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      REC: STORE_CAM_24
                   </div>
                   <div className="text-white font-mono text-[10px]">
                      ISO: 800 | FPS: 30
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <Eye className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload CCTV footage to detect shelf sweeping or concealment.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">Loss Prevention Vision Engine</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-rose-500" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loss Prevention Report</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Incident Monitor Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Siren size={18} className="text-rose-600" />
              Incident Monitor
            </h3>
            <Zap size={16} className="text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {incidents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Shield size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">System Standby</p>
                <p className="text-xs text-slate-400 mt-2">Monitoring feeds for shrinkage patterns...</p>
              </div>
            ) : (
              incidents.map((inc) => (
                <div key={inc.id} className={`p-4 rounded-xl border transition-all ${
                  inc.status === 'Resolved' ? 'bg-slate-50 border-slate-200 opacity-60' : 
                  inc.status === 'Dispatched' ? 'bg-rose-50 border-rose-100 ring-1 ring-rose-300' : 'bg-white border-slate-200'
                }`}>
                   <div className="flex justify-between items-start mb-2">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        inc.status === 'Dispatched' ? 'bg-rose-600 text-white animate-pulse' : 
                        inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {inc.status}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <History size={10} /> {inc.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                   
                   <h5 className="text-xs font-black text-slate-800 mb-1">{inc.type}</h5>
                   <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tight">{inc.location}</p>
                   <p className="text-[11px] text-slate-600 leading-relaxed mb-4">{inc.details}</p>
                   
                   <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-rose-500 h-full" style={{ width: `${inc.confidence}%` }}></div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400">{inc.confidence}% Conf.</span>
                   </div>

                   {inc.status === 'Investigating' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => updateStatus(inc.id, 'Dispatched')}
                        className="py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Siren size={14} /> Dispatch
                      </button>
                      <button 
                        onClick={() => updateStatus(inc.id, 'False Alarm')}
                        className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        False Alarm
                      </button>
                    </div>
                   )}
                   
                   {inc.status === 'Dispatched' && (
                    <button 
                      onClick={() => updateStatus(inc.id, 'Resolved')}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} /> Resolve Incident
                    </button>
                   )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-bold">
                <Hammer size={16} className="text-rose-500 shrink-0" /> 
                Policy: Follow "Observe, Report, Assist" protocol.
             </div>
             <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-md">
                Generate Weekly Shrinkage Audit
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheftDetection;