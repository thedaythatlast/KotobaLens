
import React, { useState } from 'react';
import { AppState, OCRResult } from './types';
import { analyzeJapaneseImage } from './services/geminiService';
import CameraCapture from './components/CameraCapture';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      performAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const performAnalysis = async (base64Image: string) => {
    setState(AppState.ANALYZING);
    setError(null);
    try {
      const data = await analyzeJapaneseImage(base64Image);
      setResult(data);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Ensure the text is clear and contains identifiable grammar.");
      setState(AppState.ERROR);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <i className="fas fa-eye text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-slate-900 leading-none">Kotoba<span className="text-indigo-600">Lens</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Smart Analyzer</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {state === AppState.IDLE && (
          <div className="max-w-md w-full py-10 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10">
              <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <i className="fas fa-language text-4xl text-indigo-600"></i>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white">
                  <i className="fas fa-brain text-indigo-600 text-[10px]"></i>
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Analyze Patterns.</h2>
              <p className="text-slate-500 font-medium leading-relaxed px-4">
                Snap a photo on Android to identify significant grammatical structures, verbs, and complex patterns in any Japanese text.
              </p>
            </div>

            <div className="grid gap-4 px-4">
              <button
                onClick={() => setState(AppState.CAPTURING)}
                className="w-full flex items-center justify-center gap-4 bg-indigo-600 text-white p-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
              >
                <i className="fas fa-camera"></i>
                Open Camera
              </button>
              
              <label className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 text-slate-800 p-6 rounded-[2rem] font-black text-xl hover:border-indigo-200 transition-all cursor-pointer active:scale-95">
                <i className="fas fa-upload"></i>
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="mt-12 flex justify-center gap-8 opacity-25">
              <i className="fas fa-mobile-alt text-xl"></i>
              <i className="fas fa-search text-xl"></i>
              <i className="fas fa-book-open text-xl"></i>
            </div>
          </div>
        )}

        {state === AppState.CAPTURING && (
          <CameraCapture 
            onCapture={performAnalysis} 
            onCancel={() => setState(AppState.IDLE)} 
          />
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center gap-8 p-12 text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-bolt text-indigo-600 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Identifying Grammar...</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Scanning for verbs and significant structures</p>
            </div>
          </div>
        )}

        {state === AppState.RESULT && result && (
          <AnalysisView result={result} onReset={reset} />
        )}

        {state === AppState.ERROR && (
          <div className="max-w-md px-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Analysis Failed</h2>
            <p className="text-slate-500 mb-8 font-medium">{error}</p>
            <button
              onClick={reset}
              className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-lg active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        <p>KotobaLens v4.0 • Smart Android OCR</p>
      </footer>
    </div>
  );
};

export default App;
