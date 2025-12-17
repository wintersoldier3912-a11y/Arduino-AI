
import React, { useState, useRef, useEffect } from 'react';
import { analyzeCode } from '../services/geminiService';

interface CodeIssue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

interface AnalysisResult {
  summary: string;
  issues: CodeIssue[];
}

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  Serial.println("Blink");
}`);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setErrorString(null);
    setAnalysisResult(null);

    try {
      const resultString = await analyzeCode(code);
      try {
          const parsed: AnalysisResult = JSON.parse(resultString);
          setAnalysisResult(parsed);
      } catch (e) {
          // Fallback if model returns raw string instead of JSON
          setAnalysisResult({
              summary: resultString,
              issues: []
          });
      }
    } catch (error) {
      setErrorString("Error connecting to AI service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current && gutterRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollTop = scrollTop;
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  const codeLines = code.split('\n');

  // Helper to determine highlight color for a line
  const getLineHighlight = (lineIndex: number) => {
      // API returns 1-based line numbers
      if (!analysisResult) return '';
      const issue = analysisResult.issues.find(i => i.line === lineIndex + 1);
      if (!issue) return '';
      if (issue.severity === 'error') return 'bg-red-900/40';
      if (issue.severity === 'warning') return 'bg-yellow-900/40';
      return 'bg-blue-900/40';
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Editor Column */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
          <div className="flex space-x-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center space-x-3">
              <span className="text-slate-400 text-xs font-mono">sketch.ino</span>
              {analysisResult?.issues.length === 0 && (
                  <span className="text-xs text-green-400 font-bold flex items-center">
                       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       No Issues Found
                  </span>
              )}
          </div>
        </div>

        <div className="flex-1 relative font-mono text-sm group">
            {/* Gutter (Line Numbers) */}
            <div 
                ref={gutterRef}
                className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800/50 border-r border-slate-700 text-slate-500 text-right pr-2 pt-4 select-none overflow-hidden"
            >
                {codeLines.map((_, i) => {
                    const issue = analysisResult?.issues.find(issue => issue.line === i + 1);
                    return (
                        <div key={i} className="h-6 leading-6 relative">
                            {issue && (
                                <span className={`absolute left-1 top-1.5 w-1.5 h-1.5 rounded-full ${issue.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                            )}
                            {i + 1}
                        </div>
                    );
                })}
            </div>

            {/* Backdrop (Highlights) */}
            <div 
                ref={backdropRef}
                className="absolute left-12 right-0 top-0 bottom-0 pt-4 pl-4 overflow-hidden pointer-events-none"
            >
                {codeLines.map((line, i) => (
                    <div key={i} className={`h-6 w-full leading-6 ${getLineHighlight(i)}`}>
                        {/* Empty content, just for background styling */}
                        &nbsp;
                    </div>
                ))}
            </div>

            {/* Textarea (Editing) */}
            <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                className="absolute inset-0 w-full h-full pl-16 pt-4 pr-4 bg-transparent text-slate-300 outline-none resize-none leading-6 z-10"
                spellCheck={false}
                style={{ tabSize: 2 }}
            />
        </div>

        {/* Toolbar */}
        <div className="bg-slate-800 p-3 flex justify-end gap-3 z-20">
           <button
             onClick={handleCopy}
             className={`px-4 py-2 rounded text-sm font-medium transition-all flex items-center border ${
               isCopied 
                 ? 'bg-green-500/10 border-green-500 text-green-400' 
                 : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'
             }`}
           >
             {isCopied ? 'Copied!' : 'Copy Code'}
           </button>
           <button
             onClick={handleAnalyze}
             disabled={isAnalyzing}
             className="bg-arduino-teal text-white px-4 py-2 rounded text-sm font-medium hover:bg-arduino-dark transition-colors flex items-center disabled:opacity-50"
           >
             {isAnalyzing ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing...
               </>
             ) : (
               <>
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Validate Code
               </>
             )}
           </button>
        </div>
      </div>

      {/* Analysis Report Column */}
      <div className="md:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
          <span>Validation Report</span>
          {(analysisResult || errorString) && (
              <button 
                onClick={() => { setAnalysisResult(null); setErrorString(null); }} 
                className="text-xs text-slate-400 hover:text-red-500"
              >
                  Clear
              </button>
          )}
        </div>
        <div className="flex-1 p-0 overflow-y-auto bg-slate-50/50">
          {errorString && (
              <div className="p-6 text-red-500 text-center text-sm">{errorString}</div>
          )}

          {analysisResult ? (
             <div className="pb-4">
                {/* Summary Section */}
                <div className="p-4 bg-white border-b border-slate-100 mb-2">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Overview</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Issues List */}
                <div className="px-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2">
                        Issues Found ({analysisResult.issues.length})
                    </h3>
                    
                    {analysisResult.issues.length === 0 && (
                        <div className="text-center py-6 text-green-600 bg-green-50 rounded-lg border border-green-100">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm font-bold">Code looks clean!</p>
                        </div>
                    )}

                    {analysisResult.issues.map((issue, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => {
                                if (textareaRef.current) {
                                    // Calculate rough scroll position
                                    const lineHeight = 24; // 1.5rem * 16px (approx or based on css leading-6)
                                    textareaRef.current.scrollTop = (issue.line - 2) * lineHeight;
                                }
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                issue.severity === 'error' 
                                ? 'bg-red-50 border-red-200 hover:border-red-300' 
                                : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    issue.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {issue.severity}
                                </span>
                                <span className="text-xs font-mono text-slate-500">Line {issue.line}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 mb-1">{issue.message}</p>
                            <div className="text-xs text-slate-600 bg-white/50 p-2 rounded">
                                <span className="font-bold text-slate-500">Fix: </span>
                                {issue.suggestion}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          ) : !errorString && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8">
               <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
               <h3 className="font-medium text-slate-600 mb-1">Ready to Validate</h3>
               <p className="text-sm">Click "Validate Code" to check for syntax errors and logical bugs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
