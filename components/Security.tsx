import React, { useState, useRef } from 'react';
import { Camera, ShieldAlert, CheckCircle, AlertTriangle, Upload, Eye } from 'lucide-react';
import { analyzeSecurityFeed } from '../services/geminiService';

const Security: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
      // Trigger analysis immediately
      handleAnalyze(file);
    }
  };

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSecurityFeed(file);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      setAnalysisResult("Error analyzing image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Camera Grid (Mock) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <Camera size={20} className="text-slate-500"/> Live Store Feeds
           </h2>
           <div className="grid grid-cols-2 gap-4">
             {[1, 2, 3, 4].map((cam) => (
               <div key={cam} className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden group">
                 <img 
                   src={`https://picsum.photos/400/225?random=${cam}`} 
                   alt={`Cam ${cam}`}
                   className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                 />
                 <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">
                   LIVE
                 </div>
                 <div className="absolute bottom-2 left-2 text-white text-xs font-mono">
                   CAM_0{cam}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Eye size={20} className="text-indigo-600"/> 
            Vision Analysis
          </h2>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-4">
              Upload a snapshot from a shelf or aisle to detect stock levels or safety hazards.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-colors"
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Analysis" className="max-h-48 rounded-lg shadow-sm" />
              ) : (
                <>
                  <Upload size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Click to upload frame</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG supported</p>
                </>
              )}
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-indigo-600 font-medium">Analyzing Visual Data...</p>
            </div>
          ) : analysisResult ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-fade-in flex-1 overflow-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ShieldAlert size={16} className="text-indigo-600"/> 
                AI Report
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {analysisResult}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Waiting for input...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;
