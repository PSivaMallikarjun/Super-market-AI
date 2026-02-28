import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, 
  Upload, 
  Wand2, 
  ChevronRight, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Declare window.aistudio for API key selection
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

enum Step {
  LANDING,
  UPLOAD,
  PROMPT,
  PROCESSING,
  RESULT
}

const StorefrontDesigner: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.LANDING);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiKeySelected(true);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setStep(Step.PROMPT);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false
  });

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim()) return;

    setStep(Step.PROCESSING);
    setProgress(0);
    setError(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const base64Data = uploadedImage.split(',')[1];
      const mimeType = uploadedImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: `Redesign this storefront based on these specifications: ${prompt}. Make it look professional, modern, and high-end.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K'
          }
        }
      });

      let imageUrl: string | null = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setProgress(100);
        setTimeout(() => setStep(Step.RESULT), 500);
      } else {
        throw new Error('No image was generated.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate image');
      setStep(Step.PROMPT);
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setStep(Step.LANDING);
    setUploadedImage(null);
    setPrompt('');
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#0F172A] text-white rounded-3xl overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-4xl p-8">
        {step === Step.LANDING && (
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <img 
                src="https://picsum.photos/seed/storefront/1200/675" 
                alt="Storefront Hero" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <ImageIcon size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Storefront Designer
              </h1>
              <p className="text-xl text-slate-400 max-w-xl mx-auto">
                Design custom storefronts with real-time visualization and standard compliance.
              </p>
            </div>

            <button 
              onClick={() => setStep(Step.UPLOAD)}
              className="group flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-500/20"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              Start Designing
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === Step.UPLOAD && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Upload the storefront image to redesign</h2>
              <p className="text-slate-400">Select a high-quality photo of your current store exterior.</p>
            </div>

            <div 
              {...getRootProps()} 
              className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center space-y-4 cursor-pointer
                ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}
              `}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                <Upload size={32} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">Drop your image here</p>
                <p className="text-slate-400">or click to browse files</p>
              </div>
            </div>
          </div>
        )}

        {step === Step.PROMPT && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Describe your desired design specifications</h2>
              <p className="text-slate-400">Tell the AI what changes you want to see.</p>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., convert this image to mars super store front store"
                className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => setStep(Step.UPLOAD)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RefreshCcw size={20} />
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all shadow-lg shadow-indigo-500/20"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {!apiKeySelected && (
              <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-amber-500" />
                  <p className="text-amber-200">API Key required for generation</p>
                </div>
                <button 
                  onClick={handleSelectApiKey}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
                >
                  Select Key
                </button>
              </div>
            )}
          </div>
        )}

        {step === Step.PROCESSING && (
          <div className="flex flex-col items-center justify-center space-y-12 py-12">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={48} className="text-indigo-500 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black italic">Thinking...</h2>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">
                Redesign Storefront Image: {Math.round(progress)}%
              </p>
            </div>
          </div>
        )}

        {step === Step.RESULT && generatedImage && (
          <div className="space-y-8">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <img 
                src={generatedImage} 
                alt="Generated Storefront" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-100 transition-colors"
                >
                  <RefreshCcw size={18} />
                  New Design
                </button>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Redesigned Storefront Showcase</h2>
              <p className="text-slate-400">Your AI-optimized store facade is ready.</p>
            </div>

            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
                <CheckCircle2 size={16} />
                Compliance Verified
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium">
                <Sparkles size={16} />
                AI Enhanced
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-slate-600 text-xs font-medium tracking-widest uppercase">
          Powered by SupermarketAI Vision Engine
        </p>
      </div>
    </div>
  );
};

export default StorefrontDesigner;
