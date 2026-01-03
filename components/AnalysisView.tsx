
import React, { useState } from 'react';
import { OCRResult, GrammarToken } from '../types';

interface AnalysisViewProps {
  result: OCRResult;
  onReset: () => void;
}

const ITEMS_PER_PAGE = 6;

const TokenCard: React.FC<{ token: GrammarToken }> = ({ token }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-full transition-all active:bg-slate-50">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-2xl font-bold text-slate-900 font-['Noto_Sans_JP']">{token.surface}</span>
        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
          {token.reading}
        </span>
      </div>
      <p className="text-slate-600 text-sm font-medium leading-snug mt-2">
        {token.definition}
      </p>
      {token.notes && (
        <p className="mt-2 text-[10px] text-slate-400 italic">
          {token.notes}
        </p>
      )}
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(result.tokens.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTokens = result.tokens.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Translation Section - Primary Output */}
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">Translation</h2>
          <p className="text-2xl font-bold leading-tight">
            "{result.translation}"
          </p>
        </div>

        {/* Original Text Section - Minimized by Default */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => setIsOriginalExpanded(!isOriginalExpanded)}
            className="w-full px-8 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">
              Source Text
            </span>
            <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform ${isOriginalExpanded ? 'rotate-180' : ''}`}>
              <i className="fas fa-chevron-down text-[10px] text-slate-300"></i>
            </div>
          </button>
          
          {isOriginalExpanded && (
            <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center">
                <p className="text-2xl font-['Noto_Sans_JP'] leading-loose text-slate-800">
                  {result.originalText}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Grammar Breakdown Section - Significant Parts Only */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
              Significant <span className="text-indigo-600">Grammar</span>
            </h3>
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
              {result.tokens.length} items
            </span>
          </div>
          
          {result.tokens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentTokens.map((token, idx) => (
                <TokenCard key={startIndex + idx} token={token} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-medium">
              No complex grammatical structures identified.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center disabled:opacity-20 active:bg-slate-100 transition-colors"
                >
                  <i className="fas fa-arrow-left text-xs"></i>
                </button>
                <span className="text-sm font-black text-slate-800">
                  {currentPage} <span className="text-slate-300 mx-1">/</span> {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center disabled:opacity-20 active:bg-slate-100 transition-colors"
                >
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-4">
          <button
            onClick={onReset}
            className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-[2rem] active:scale-95 transition-transform"
          >
            New Scan
          </button>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Targeted Grammar Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
