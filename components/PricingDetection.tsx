import React, { useState, useRef } from 'react';
import { 
  Tag, Ticket, AlertCircle, CheckCircle2, Upload, 
  Search, ScanLine, FileText, Banknote, History, 
  Trash2, Check, Clock, Eye, AlertTriangle 
} from 'lucide-react';
import { detectPricingIssues } from '../services/geminiService';
import { PricingIssue } from '../types';

const PricingDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [issues, setIssues] = useState<PricingIssue[]>([]);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setReport(null);
        analyzePricing(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePricing = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await detectPricingIssues(file);
      setReport(result);
      
      // Parse issues from AI response (simulated logic for UI)
      const newIssues: PricingIssue[] = [];
      const resLower = result.toLowerCase();

      if (resLower.includes('missing tag')) {
        newIssues.push({
          id: Date.now().toString() + '-miss',
          timestamp: new Date(),
          issueType: 'Missing Tag',
          priority: 'High',
          details: 'Product detected without visible pricing label in Frozen Foods.',
          isResolved: false
        });
      }
      if (resLower.includes('incorrect price') || resLower.includes('wrong')) {
        newIssues.push({
          id: Date.now().toString() + '-inc',
          timestamp: new Date(),
          productName: 'Store Brand Milk 1L',
          detectedPrice: '$4.99',
          issueType: 'Incorrect Price',
          priority: 'Medium',
          details: 'Shelf tag shows $4.99 but system expected $3.49.',
          isResolved: false
        });
      }
      if (resLower.includes('expired') || resLower.includes('promo')) {
        newIssues.push({
          id: Date.now().toString() + '-promo',
          timestamp: new Date(),
          issueType: 'Expired Promotion',
          priority: 'Low',
          details: '"Weekly Special" label still visible after promotion ended Sunday.',
          isResolved: false
        });
      }
      
      setIssues(prev => [...newIssues, ...prev]);

      // Extract accuracy score if provided (e.g., "Score: 85%")
      const scoreMatch = result.match(/(\d+)%/);
      if (scoreMatch) {
        setAccuracyScore(parseInt(scoreMatch[1]));
      } else {
        setAccuracyScore(Math.floor(Math.random() * 15) + 80); // Mock fallback
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resolveIssue = (id: string) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, isResolved: true } : i));
  };

  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Metrics & Capture Area */}
      <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
        
        {/* Pricing Metrics Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing Accuracy</p>
              <Banknote size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-black ${
                accuracyScore && accuracyScore > 90 ? 'text-green-600' : 'text-slate-900'
              }`}>
                {accuracyScore !== null ? `${accuracyScore}%` : '--'}
              </span>
              <span className="text-xs text-slate-400 mb-1">Target: 99%</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  accuracyScore && accuracyScore > 90 ? 'bg-green-500' : 'bg-amber-500'
                }`} 
                style={{ width: `${accuracyScore || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Coverage</p>
              <ScanLine size={16} className="text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">12/48</span>
              <span className="text-xs text-blue-500 mb-1 font-medium italic">Aisles Today</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Next Audit: Aisle 5 (Bakery)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Price Flags</p>
              <Ticket size={16} className="text-orange-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">
                {issues.filter(i => !i.isResolved).length}
              </span>
              <span className="text-xs text-orange-600 mb-1 font-bold">Unresolved</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Legal Compliance Risk: Low</p>
          </div>
        </div>

        {/* Capture Feed */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="font-bold text-slate-800 text-sm">Aisle Audit Snapshot</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Upload size={14} /> Upload Frame
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
                <img src={selectedImage} alt="Pricing Scan" className="w-full h-full object-contain rounded-lg opacity-80" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[2px] flex flex-col items-center justify-center animate-pulse">
                    <div className="w-48 h-1 bg-emerald-500 relative overflow-hidden rounded-full mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <div className="absolute inset-0 bg-white w-1/3 animate-[scan_2s_infinite]"></div>
                    </div>
                    <p className="text-white text-sm font-bold tracking-[0.2em] uppercase drop-shadow-md">OCR Price Verification</p>
                  </div>
                )}
                {/* Simulated OCR Boxes if not analyzing */}
                {!isAnalyzing && report && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[30%] w-20 h-10 border-2 border-emerald-400 bg-emerald-400/10 flex items-center justify-center">
                       <span className="text-[8px] font-bold text-white bg-emerald-600 px-1">$2.99</span>
                    </div>
                    <div className="absolute top-[45%] left-[60%] w-20 h-10 border-2 border-red-400 bg-red-400/10 flex items-center justify-center">
                       <span className="text-[8px] font-bold text-white bg-red-600 px-1">ERR</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Tag className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">Upload an aisle photo to audit prices and labels.</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                    <FileText size={12}/> Detailed Pricing Audit
                 </h4>
                 <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">OCR Enabled</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Passed</span>
                 </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium font-mono">
                {report}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Audit List Sidebar */}
      <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-600" />
            Pricing Corrections
          </h3>
          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">
            Action Needed
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {issues.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
              <CheckCircle2 size={48} className="text-emerald-300 mb-2" />
              <p className="text-sm font-medium text-slate-500">No pricing issues</p>
              <p className="text-xs text-slate-400">System matches shelf labels perfectly.</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div 
                key={issue.id}
                className={`group p-4 rounded-xl border transition-all ${
                  issue.isResolved 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : issue.priority === 'High'
                    ? 'bg-red-50 border-red-100'
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    issue.issueType === 'Missing Tag' ? 'bg-red-100 text-red-700' :
                    issue.issueType === 'Incorrect Price' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {issue.issueType}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {issue.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button onClick={() => deleteIssue(issue.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                   {issue.productName || 'Aisle 2, Row 3'}
                </h4>
                
                {issue.detectedPrice && (
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] text-slate-400 uppercase font-bold">Detected:</span>
                     <span className="text-xs font-mono font-bold text-slate-700">{issue.detectedPrice}</span>
                  </div>
                )}

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{issue.details}</p>
                
                {!issue.isResolved ? (
                  <button 
                    onClick={() => resolveIssue(issue.id)}
                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={14} className="text-emerald-600" />
                    Verify Update
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold py-1">
                    <CheckCircle2 size={14} /> Corrected
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
             <History size={14} /> View Audit History
          </button>
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

export default PricingDetection;