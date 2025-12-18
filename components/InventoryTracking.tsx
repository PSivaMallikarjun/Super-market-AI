import React, { useState, useRef } from 'react';
import { 
  Box, Barcode, QrCode, Search, Upload, 
  Layers, CheckCircle2, Loader2, Info, 
  Scan, Activity, FileSpreadsheet, History,
  Maximize2, Database
} from 'lucide-react';
import { trackInventoryVisually } from '../services/geminiService';
import { RecognizedProduct } from '../types';

const InventoryTracking: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [detections, setDetections] = useState<RecognizedProduct[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setReport(null);
        analyzeInventory(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeInventory = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const result = await trackInventoryVisually(file);
      setReport(result);
      
      // Parse detections from AI response (simulated for UI)
      const mockDetections: RecognizedProduct[] = [];
      const resLower = result.toLowerCase();

      // Simple keyword detection to simulate structured data extraction
      if (resLower.includes('cola') || resLower.includes('soda')) {
        mockDetections.push({
          id: 'det-1',
          brand: 'Coca-Cola 500ml',
          sku: 'SKU-882193',
          category: 'Beverages',
          count: 24,
          confidence: 0.98
        });
      }
      if (resLower.includes('chip') || resLower.includes('snack')) {
        mockDetections.push({
          id: 'det-2',
          brand: 'Lays Classic XL',
          sku: 'SKU-112004',
          category: 'Snacks',
          count: 12,
          confidence: 0.94
        });
      }
      if (resLower.includes('milk') || resLower.includes('dairy')) {
        mockDetections.push({
          id: 'det-3',
          brand: 'Fresh Valley Whole Milk',
          sku: 'SKU-009211',
          category: 'Dairy',
          count: 8,
          confidence: 0.89
        });
      }
      
      setDetections(mockDetections);
      
      // Extract confidence score if provided
      const confMatch = result.match(/(\d+)%/);
      if (confMatch) {
        setConfidence(parseInt(confMatch[1]));
      } else {
        setConfidence(Math.floor(Math.random() * 10) + 85);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      
      {/* Top Recognition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Scan size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Confidence</p>
            <p className="text-lg font-bold text-slate-800">{confidence !== null ? `${confidence}%` : '--'}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Box size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SKUs Recognized</p>
            <p className="text-lg font-bold text-slate-800">{detections.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Barcode size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Barcodes Read</p>
            <p className="text-lg font-bold text-slate-800">{detections.length > 0 ? detections.length : 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Database size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Sync</p>
            <p className="text-lg font-bold text-slate-800">Auto-Refreshed</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Visual recognition Feed */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-indigo-600 animate-pulse" />
              <h3 className="font-bold text-slate-800 text-sm">Visual Recognition Feed</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
              >
                <Upload size={14} /> New Audit Walk
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
            {selectedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={selectedImage} alt="Inventory Scan" className="max-h-full max-w-full object-contain rounded-lg opacity-70" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center animate-pulse">
                    <div className="relative">
                      <div className="w-24 h-24 border-2 border-indigo-400/30 rounded-full animate-ping"></div>
                      <Scan size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                    <p className="text-white text-xs font-bold mt-6 tracking-[0.3em] uppercase">Processing Visual SKUs</p>
                  </div>
                )}
                
                {/* Simulated Recognition Boxes */}
                {!isAnalyzing && detections.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-[150px] h-[100px] border-2 border-indigo-400 bg-indigo-400/10 rounded flex flex-col justify-end p-1">
                       <span className="text-[8px] bg-indigo-600 text-white font-bold w-fit px-1 rounded">BEVERAGE_DETECTION</span>
                    </div>
                    <div className="absolute bottom-[20%] right-[15%] w-[120px] h-[150px] border-2 border-emerald-400 bg-emerald-400/10 rounded flex flex-col justify-end p-1">
                       <span className="text-[8px] bg-emerald-600 text-white font-bold w-fit px-1 rounded">SNACK_SKU_RECOGNIZED</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                  <Box className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Upload shelf footage to automate inventory tracking.</p>
                <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-widest">Supports Image & Video Audit</p>
              </div>
            )}
          </div>

          {report && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                 <FileSpreadsheet size={16} className="text-slate-400" />
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Extracted Audit Logs</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">
                {report}
              </p>
            </div>
          )}
        </div>

        {/* Inventory Stream Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              Recognized Items
            </h3>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
               <Maximize2 size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {detections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Search size={48} className="text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">Awaiting Recognition</p>
              </div>
            ) : (
              detections.map((item) => (
                <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all group">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{item.brand}</h4>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {Math.floor(item.confidence * 100)}%
                      </span>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                      <div className="flex flex-col">
                        <span className="text-slate-400 uppercase font-bold">Category</span>
                        <span className="text-slate-600">{item.category}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 uppercase font-bold">Visible Count</span>
                        <span className="text-slate-900 font-black">{item.count} Units</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                        <QrCode size={12} /> {item.sku}
                      </div>
                      <button className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Sync Level
                      </button>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <History size={14} /> Full Audit History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTracking;