import React, { useState, useRef } from 'react';
import { 
  ClipboardCheck, Target, Image as ImageIcon, Upload, 
  ArrowRightLeft, AlertCircle, CheckCircle2, Loader2, 
  FileSearch, History, PlayCircle, Layers
} from 'lucide-react';
import { auditPlanogramCompliance } from '../services/geminiService';

const PlanogramCompliance: React.FC = () => {
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [actualPreview, setActualPreview] = useState<string | null>(null);
  const [refFile, setRefFile] = useState<File | null>(null);
  const [actualFile, setActualFile] = useState<File | null>(null);
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  
  const refInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = useRef<HTMLInputElement>(null);

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setRefPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleActualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActualFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setActualPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAudit = async () => {
    if (!refFile || !actualFile) return;
    setIsAuditing(true);
    setAuditReport(null);
    try {
      const result = await auditPlanogramCompliance(refFile, actualFile);
      setAuditReport(result);
      
      // Attempt to extract score
      const scoreMatch = result.match(/(\d+)%/);
      if (scoreMatch) setScore(parseInt(scoreMatch[1]));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Top Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Status</p>
            <p className="text-lg font-bold text-slate-800">{auditReport ? 'Complete' : 'Pending'}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-lg ${score !== null ? (score > 90 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600') : 'bg-slate-100 text-slate-400'}`}>
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance</p>
            <p className="text-lg font-bold text-slate-800">{score !== null ? `${score}%` : '--%'}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aisle Audit</p>
            <p className="text-lg font-bold text-slate-800">4 / 24</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <History size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Audit</p>
            <p className="text-lg font-bold text-slate-800">2h ago</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Upload & Compare Workbench */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            
            {/* Reference Upload */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Target size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-700 uppercase">Master Planogram</span>
              </div>
              <div 
                onClick={() => refInputRef.current?.click()}
                className="flex-1 flex items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors group relative"
              >
                {refPreview ? (
                  <img src={refPreview} className="max-h-full max-w-full object-contain rounded" alt="Planogram" />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="mx-auto text-slate-300 group-hover:text-blue-400 transition-colors mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Upload Reference</p>
                  </div>
                )}
                <input type="file" ref={refInputRef} className="hidden" accept="image/*" onChange={handleRefUpload} />
              </div>
            </div>

            {/* Actual Upload */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <FileSearch size={16} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 uppercase">Actual Shelf (Img/Video)</span>
              </div>
              <div 
                onClick={() => actualInputRef.current?.click()}
                className="flex-1 flex items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors group relative"
              >
                {actualPreview ? (
                  <img src={actualPreview} className="max-h-full max-w-full object-contain rounded" alt="Actual" />
                ) : (
                  <div className="text-center">
                    <PlayCircle size={32} className="mx-auto text-slate-300 group-hover:text-indigo-400 transition-colors mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Capture Shelf Data</p>
                  </div>
                )}
                <input type="file" ref={actualInputRef} className="hidden" accept="image/*,video/*" onChange={handleActualUpload} />
              </div>
            </div>
          </div>

          <button
            onClick={runAudit}
            disabled={!refFile || !actualFile || isAuditing}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {isAuditing ? <Loader2 className="animate-spin" /> : <ArrowRightLeft size={20} />}
            {isAuditing ? 'Auditing Compliance...' : 'Analyze Planogram Compliance'}
          </button>
        </div>

        {/* Audit Results Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck size={18} className="text-green-600" />
              Compliance Report
            </h3>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {isAuditing ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-slate-700">Gemini AI Audit Engine</p>
                <p className="text-xs text-slate-500 mt-1">Detecting SKU discrepancies and facing errors...</p>
              </div>
            ) : auditReport ? (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className={`text-2xl font-black ${score !== null && score > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                    {score}%
                  </div>
                  <div className="h-8 w-px bg-blue-200"></div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase">
                    Calculated Compliance Score
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                  {auditReport}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <AlertCircle size={48} className="opacity-20 mb-3" />
                <p className="text-sm">Ready to begin audit</p>
                <p className="text-xs mt-1 max-w-[200px]">Upload planogram and shelf data to detect misplaced products.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Engine v2.4</span>
                <span className="text-[10px] text-slate-500 italic">Powered by Gemini Vision</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanogramCompliance;