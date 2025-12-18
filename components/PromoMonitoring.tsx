import React, { useState, useRef } from 'react';
import { 
  Megaphone, ShieldCheck, Upload, RefreshCcw, 
  CheckCircle2, AlertTriangle, FileText, Info,
  LayoutGrid, Camera, Eye, Zap, ListChecks,
  Target, Sparkles
} from 'lucide-react';
import { monitorPromotionalDisplay } from '../services/geminiService';
import { PromoAudit } from '../types';

const PromoMonitoring: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<PromoAudit | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedMedia(ev.target?.result as string);
        setReport(null);
        runPromoAudit(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runPromoAudit = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await monitorPromotionalDisplay(file);
      setReport(result);
      
      const resLower = result.toLowerCase();
      
      // Simulated parsing of AI report for UI states
      let status: 'Compliant' | 'Partial' | 'Non-Compliant' = 'Compliant';
      if (resLower.includes('incorrect') || resLower.includes('misplaced') || resLower.includes('missing')) {
        status = 'Non-Compliant';
      } else if (resLower.includes('partial') || resLower.includes('almost') || resLower.includes('improvement')) {
        status = 'Partial';
      }

      const findings = result.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.match(/^\d+\./))
        .map(line => line.replace(/^[-•\d.]\s*/, '').trim())
        .slice(0, 5);

      setAuditResult({
        id: Date.now().toString(),
        timestamp: new Date(),
        campaignName: resLower.match(/brand|campaign:\s*([^\n]+)/i)?.[1] || 'Detected Campaign',
        location: 'End-cap Aisle 5',
        complianceStatus: status,
        findings: findings.length > 0 ? findings : ['Branding clearly visible', 'Stock levels adequate', 'Signage correctly placed']
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Campaign Execution Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Megaphone size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</p>
            <p className="text-lg font-bold text-slate-800">12</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Rate</p>
            <p className="text-lg font-bold text-slate-800">91.5%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Coverage</p>
            <p className="text-lg font-bold text-slate-800">84%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Health</p>
            <p className="text-lg font-bold text-slate-800">Excellent</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Visual Audit Workbench */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">Real-time Campaign Audit</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Upload size={14} /> Audit New Display
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
                  <img src={selectedMedia} alt="Display Feed" className="max-h-full max-w-full object-contain rounded-lg opacity-70" />
                )}
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-purple-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <RefreshCcw className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-xs font-bold tracking-[0.3em] uppercase drop-shadow-lg">Auditing Visual Branding...</p>
                  </div>
                )}
                
                {/* Visual Analysis Overlays */}
                {!isAnalyzing && auditResult && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-[10%] right-[10%] p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-purple-100 flex items-center gap-3 animate-fade-in">
                       <div className={`p-2 rounded-lg ${
                         auditResult.complianceStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-600' :
                         auditResult.complianceStatus === 'Partial' ? 'bg-amber-100 text-amber-600' :
                         'bg-rose-100 text-rose-600'
                       }`}>
                          {auditResult.complianceStatus === 'Compliant' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Status</p>
                          <p className="text-sm font-black text-slate-800">{auditResult.complianceStatus}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <LayoutGrid className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload promotional stand media to audit execution.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">End-cap & Stand Integrity Analysis</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileText size={16} className="text-purple-500" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trade Marketing Audit Log</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Campaign Scorecard Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ListChecks size={18} className="text-purple-600" />
              Campaign Scorecard
            </h3>
            <Eye size={16} className="text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {auditResult === null ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Zap size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">Awaiting Media</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                   <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Detected Campaign</p>
                   <h4 className="text-lg font-black text-slate-900 leading-tight">{auditResult.campaignName || 'General Promotion'}</h4>
                   <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{auditResult.location}</p>
                </div>

                <div className="space-y-3">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Verification Checklist</h5>
                   {auditResult.findings.map((finding, idx) => (
                     <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-slate-700 leading-relaxed">{finding}</p>
                     </div>
                   ))}
                </div>

                {auditResult.complianceStatus !== 'Compliant' && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 font-medium">Attention: Issues detected in stand assembly or signage. Corrective action advised.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <Info size={14} className="text-purple-500 shrink-0" /> 
                <span>Promotion ends in 4 days. Peak traffic expected this evening.</span>
             </div>
             <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                <RefreshCcw size={14} /> Rescan Display
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoMonitoring;