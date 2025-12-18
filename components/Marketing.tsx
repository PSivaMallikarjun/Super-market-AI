import React, { useState, useRef } from 'react';
import { 
  Megaphone, Image as ImageIcon, Copy, Check, Loader2, 
  PenTool, History, Upload, X, Search, Sparkles, 
  TrendingUp, Eye, Target, Zap, ShieldAlert,
  PlayCircle, RefreshCcw, Layout, FileText
} from 'lucide-react';
import { generateMarketingCampaign, analyzeMarketingCreative } from '../services/geminiService';
import { MarketingCampaign, CreativeAudit } from '../types';

const Marketing: React.FC = () => {
  // Tabs: Generation vs Audit
  const [activeTab, setActiveTab] = useState<'generate' | 'audit'>('generate');

  // Generation State
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [includeImage, setIncludeImage] = useState(true);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [history, setHistory] = useState<MarketingCampaign[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);

  // Audit State
  const [auditMedia, setAuditMedia] = useState<File | null>(null);
  const [auditPreview, setAuditPreview] = useState<string | null>(null);
  const [auditType, setAuditType] = useState<'image' | 'video' | null>(null);
  const [auditResult, setAuditResult] = useState<CreativeAudit | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auditInputRef = useRef<HTMLInputElement>(null);

  // --- Generation Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setProductImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGen(true);
    setCampaign(null);
    try {
      const result = await generateMarketingCampaign(productName, audience, includeImage, productImage || undefined);
      const newCampaign: MarketingCampaign = {
        id: Date.now().toString(),
        timestamp: new Date(),
        productName,
        targetAudience: audience,
        generatedCopy: result.copy || '',
        generatedImageUrl: result.imageUrl,
        uploadedImageUrl: productImagePreview || undefined
      };
      setCampaign(newCampaign);
      setHistory(prev => [newCampaign, ...prev]);
    } catch (error) { console.error(error); } finally { setLoadingGen(false); }
  };

  // --- Audit Handlers ---
  const handleAuditUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuditMedia(file);
      setAuditType(file.type.startsWith('video/') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAuditPreview(ev.target?.result as string);
        runAudit(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAudit = async (file: File) => {
    setLoadingAudit(true);
    setAuditResult(null);
    try {
      const result = await analyzeMarketingCreative(file);
      
      // Parse simulated data for metrics
      const resLower = result.toLowerCase();
      const suggestions = result.split('\n')
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('•') || l.match(/^\d+\./))
        .map(l => l.replace(/^[-•\d.]\s*/, '').trim())
        .slice(0, 4);

      setAuditResult({
        id: Date.now().toString(),
        timestamp: new Date(),
        roiScore: resLower.includes('high') ? 88 : 65,
        attentionScore: resLower.includes('stopping') ? 92 : 74,
        suggestions: suggestions.length > 0 ? suggestions : ['Bold headline placement', 'Increased color contrast', 'Add CTA button'],
        suppressionStrategy: "Exclude existing premium loyalty members to minimize CPA.",
        fullAnalysis: result
      });
    } catch (error) { console.error(error); } finally { setLoadingAudit(false); }
  };

  const handleCopy = () => {
    if (campaign?.generatedCopy) {
      navigator.clipboard.writeText(campaign.generatedCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Marketing Sub-Navigation */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'generate' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Sparkles size={16} /> Campaign Creator
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Target size={16} /> Creative Intelligence
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'generate' ? (
          <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Generation Form */}
            <div className="lg:w-1/3 space-y-6 overflow-y-auto pr-2">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wider text-sm">
                    <PenTool size={18} className="text-pink-600" /> AI Ad Studio
                 </h3>
                 <form onSubmit={handleGenSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Product Title</label>
                      <input
                        type="text" required value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g., Organic Avocado Sale"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Audience Profile</label>
                      <input
                        type="text" required value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g., Health-conscious millenials"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div className="pt-2">
                       <input 
                        type="file" ref={fileInputRef} className="hidden" accept="image/*"
                        onChange={handleImageUpload}
                       />
                       {!productImagePreview ? (
                         <button 
                          type="button" onClick={() => fileInputRef.current?.click()}
                          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center gap-1 hover:border-pink-300 hover:bg-pink-50 transition-all"
                         >
                            <Upload size={20} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500">Source Product Image</span>
                         </button>
                       ) : (
                         <div className="relative rounded-lg overflow-hidden border border-slate-200 h-32 group">
                            <img src={productImagePreview} className="w-full h-full object-cover" alt="Source" />
                            <button 
                              onClick={() => {setProductImage(null); setProductImagePreview(null);}}
                              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                         </div>
                       )}
                    </div>
                    <div className="flex items-center gap-2 py-2">
                       <input 
                        type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded"
                       />
                       <span className="text-xs font-bold text-slate-600">Generate Hero Graphic</span>
                    </div>
                    <button
                      type="submit" disabled={loadingGen}
                      className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg hover:bg-pink-700 transition-all flex justify-center items-center gap-2"
                    >
                      {loadingGen ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                      {loadingGen ? 'Brewing Ad...' : 'Launch AI Creator'}
                    </button>
                 </form>
              </div>

              {history.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                      <History size={14} /> Creative History
                   </h4>
                   <div className="space-y-2">
                      {history.slice(0, 3).map(h => (
                        <div key={h.id} className="flex gap-2 p-2 rounded-lg border border-slate-100 hover:border-pink-200 cursor-pointer transition-all" onClick={() => setCampaign(h)}>
                           <div className="w-10 h-10 bg-slate-100 rounded-md shrink-0 overflow-hidden">
                              <img src={h.generatedImageUrl || h.uploadedImageUrl} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[10px] font-bold truncate text-slate-800">{h.productName}</p>
                              <p className="text-[8px] text-slate-400">{h.timestamp.toLocaleDateString()}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Generation Results */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Campaign Draft Preview</h3>
                  <Layout size={18} className="text-slate-400" />
               </div>
               <div className="flex-1 p-8 bg-slate-100 overflow-y-auto">
                  {!campaign && !loadingGen ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                       <Megaphone size={48} className="opacity-20 mb-4" />
                       <p className="text-sm font-bold">Input details to generate a campaign.</p>
                    </div>
                  ) : loadingGen ? (
                    <div className="h-full flex flex-col items-center justify-center">
                       <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mb-4"></div>
                       <p className="text-sm font-bold text-pink-700 animate-pulse uppercase tracking-[0.2em]">Crafting Copy & Visuals</p>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-slate-100">
                       {campaign?.generatedImageUrl && (
                         <div className="relative h-64 bg-slate-200">
                            <img src={campaign.generatedImageUrl} className="w-full h-full object-cover" alt="Ad Visual" />
                            <div className="absolute top-4 right-4 bg-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">AI DESIGNED</div>
                         </div>
                       )}
                       <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                               <h4 className="text-2xl font-black text-slate-900">{campaign?.productName}</h4>
                               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Target: {campaign?.targetAudience}</p>
                            </div>
                            <button onClick={handleCopy} className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-pink-600">
                               {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 font-medium text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                             {campaign?.generatedCopy}
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                             <div className="flex gap-2">
                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">#SupermarketSmart</span>
                                <span className="text-[10px] font-black bg-pink-50 text-pink-600 px-3 py-1 rounded-full">#FlashSale</span>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400">{campaign?.timestamp.toLocaleTimeString()}</span>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Audit Workbench */}
            <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-indigo-600" />
                    <h3 className="font-bold text-slate-800 text-sm">Creative Performance Auditor</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => auditInputRef.current?.click()}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                    >
                      <Upload size={14} /> Audit Media
                    </button>
                    <input 
                      type="file" ref={auditInputRef} className="hidden" 
                      accept="image/*,video/*" onChange={handleAuditUpload} 
                    />
                  </div>
               </div>
               <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                  {auditPreview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                       {auditType === 'video' ? (
                         <video src={auditPreview} className="max-h-full max-w-full rounded-lg" controls autoPlay muted loop />
                       ) : (
                         <img src={auditPreview} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" alt="Audit Target" />
                       )}
                       
                       {loadingAudit && (
                         <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 animate-fade-in">
                            <RefreshCcw className="w-16 h-16 text-white animate-spin mb-4" />
                            <p className="text-white text-xs font-black tracking-[0.4em] uppercase drop-shadow-lg text-center">Auditing Sales Psychology & ROI...</p>
                         </div>
                       )}
                       
                       {!loadingAudit && auditResult && (
                         <div className="absolute inset-0 pointer-events-none z-10 p-6">
                            <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 animate-fade-in flex flex-col gap-2">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
                                  <div>
                                     <p className="text-[10px] font-black text-slate-400 uppercase leading-none">ROI Potential</p>
                                     <p className="text-xl font-black text-slate-800">{auditResult.roiScore}%</p>
                                  </div>
                               </div>
                            </div>
                            <div className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 animate-fade-in">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Eye size={20} /></div>
                                  <div>
                                     <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Attention Score</p>
                                     <p className="text-xl font-black text-slate-800">{auditResult.attentionScore}%</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="text-center">
                       <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner group cursor-pointer hover:border-indigo-500 transition-all" onClick={() => auditInputRef.current?.click()}>
                          <PlayCircle className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                       </div>
                       <p className="text-slate-400 text-sm font-medium">Upload Image or Video for Creative Audit</p>
                       <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-widest">Powered by Sales Intelligence</p>
                    </div>
                  )}
               </div>
               {auditResult && (
                 <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-40 overflow-y-auto">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-2 flex items-center gap-2 tracking-widest">
                       <FileText size={12} /> Optimization Report
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{auditResult.fullAnalysis}</p>
                 </div>
               )}
            </div>

            {/* Strategic Insights Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Zap size={18} className="text-indigo-600" /> Improvement Suggestions
                     </h3>
                     <TrendingUp size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {!auditResult ? (
                       <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-12">
                          <Search size={48} className="mb-4" />
                          <p className="text-sm font-bold">Analysis Ready</p>
                       </div>
                     ) : (
                       <>
                         <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Visual Optimization</p>
                            {auditResult.suggestions.map((s, idx) => (
                              <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex items-start gap-3 shadow-sm hover:border-indigo-200 transition-all">
                                 <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                                    {idx + 1}
                                 </div>
                                 <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{s}</p>
                              </div>
                            ))}
                         </div>
                         <div className="pt-4 space-y-3">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-100 pb-2">Suppression Insight</p>
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                               <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-1" />
                               <p className="text-[11px] font-bold text-rose-900 leading-relaxed">{auditResult.suppressionStrategy}</p>
                            </div>
                         </div>
                       </>
                     )}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-200">
                     <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-md">
                        Export Strategic Brief
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}
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

export default Marketing;