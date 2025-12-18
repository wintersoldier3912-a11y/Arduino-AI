
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  stats?: {
    complexity: string;
    estimatedMemoryUsage: string;
  };
}

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`void setup() {
  // Initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

// The loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
  Serial.println("Arduino Heartbeat...");
}`);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);

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
          setAnalysisResult({
              summary: resultString,
              issues: []
          });
      }
    } catch (error) {
      setErrorString("The Sketch Analysis Fleet is currently unresponsive.");
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
      const scrollLeft = textareaRef.current.scrollLeft;
      backdropRef.current.scrollTop = scrollTop;
      backdropRef.current.scrollLeft = scrollLeft;
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  // Simple regex-based syntax highlighting for the backdrop
  const highlightedCode = useMemo(() => {
    return code.split('\n').map((line, lineIndex) => {
      let highlighted = line
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comments
      highlighted = highlighted.replace(/(\/\/.*$)/g, '<span class="text-slate-500 italic">$1</span>');
      
      // Keywords
      const keywords = /\b(void|int|float|double|char|unsigned|long|bool|boolean|const|static|if|else|for|while|return|setup|loop)\b/g;
      highlighted = highlighted.replace(keywords, '<span class="text-arduino-teal font-bold">$1</span>');

      // Arduino Constants
      const constants = /\b(HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|LED_BUILTIN|true|false)\b/g;
      highlighted = highlighted.replace(constants, '<span class="text-arduino-orange font-black">$1</span>');

      // Functions
      const functions = /\b(pinMode|digitalWrite|digitalRead|analogRead|analogWrite|delay|millis|micros|Serial|println|print|begin)\b/g;
      highlighted = highlighted.replace(functions, '<span class="text-arduino-yellow font-bold">$1</span>');

      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>');

      // Strings
      highlighted = highlighted.replace(/(".*?")/g, '<span class="text-green-400">$1</span>');

      return (
        <div key={lineIndex} className="h-6 leading-6 whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted || ' ' }} />
      );
    });
  }, [code]);

  const codeLines = code.split('\n');

  const getLineStatus = (lineIndex: number) => {
      if (!analysisResult) return null;
      return analysisResult.issues.find(i => i.line === lineIndex + 1);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 pb-6">
      {/* Sketch Editor Area */}
      <div className="flex-1 flex flex-col bg-[#0B0E14] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="bg-[#1A1F26] px-5 py-3 flex justify-between items-center border-b border-slate-800/50">
          <div className="flex items-center space-x-6">
             <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-arduino-teal"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-arduino-dark"></div>
             </div>
             <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-arduino-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">sketch.ino</span>
             </div>
          </div>
          <div className="flex items-center space-x-4">
              {analysisResult && (
                  <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                          <span className="text-[10px] text-slate-400 font-bold">{analysisResult.issues.filter(i => i.severity === 'error').length} Errors</span>
                      </div>
                      <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
                          <span className="text-[10px] text-slate-400 font-bold">{analysisResult.issues.filter(i => i.severity === 'warning').length} Warnings</span>
                      </div>
                  </div>
              )}
          </div>
        </div>

        <div className="flex-1 relative font-mono text-[13px] group overflow-hidden">
            {/* Gutter */}
            <div 
                ref={gutterRef}
                className="absolute left-0 top-0 bottom-0 w-14 bg-[#1A1F26] border-r border-slate-800 text-slate-600 text-right pr-3 pt-4 select-none overflow-hidden"
            >
                {codeLines.map((_, i) => {
                    const issue = getLineStatus(i);
                    return (
                        <div key={i} className="h-6 leading-6 relative group/line">
                            {issue && (
                                <span className={`absolute left-2 top-1.5 w-2 h-2 rounded-full cursor-help shadow-lg ${
                                    issue.severity === 'error' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                                }`} title={issue.message}></span>
                            )}
                            {i + 1}
                        </div>
                    );
                })}
            </div>

            {/* Backdrop for Syntax Highlighting */}
            <div 
                ref={backdropRef}
                className="absolute left-14 right-0 top-0 bottom-0 pt-4 pl-5 overflow-hidden pointer-events-none text-slate-400"
            >
                {highlightedCode}
            </div>

            {/* Actual Textarea Editor */}
            <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                className="absolute inset-0 w-full h-full pl-[76px] pt-4 pr-5 bg-transparent text-transparent caret-arduino-teal outline-none resize-none leading-6 z-10 font-mono"
                spellCheck={false}
                autoFocus
                style={{ tabSize: 2 }}
            />
        </div>

        {/* Status Bar */}
        <div className="bg-[#1A1F26] border-t border-slate-800 p-4 flex justify-between items-center">
           <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest">
              <div className="text-slate-500">Board: <span className="text-arduino-teal">Arduino Uno R3</span></div>
              <div className="text-slate-500">Port: <span className="text-arduino-orange">ttyACM0</span></div>
              {analysisResult?.stats && (
                  <div className="text-slate-500">Complexity: <span className="text-blue-400">{analysisResult.stats.complexity}</span></div>
              )}
           </div>
           
           <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  isCopied 
                    ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                {isCopied ? 'Copied' : 'Copy Sketch'}
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-arduino-teal text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-arduino-dark transition-all disabled:opacity-50 shadow-lg shadow-arduino-teal/10 flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Linting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Lint Sketch
                  </>
                )}
              </button>
           </div>
        </div>
      </div>

      {/* Analysis Report Side Panel */}
      <div className="md:w-[400px] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-black text-[11px] text-slate-500 uppercase tracking-widest flex justify-between items-center">
          <span>Sketch Insight HUD</span>
          {(analysisResult || errorString) && (
              <button onClick={() => setAnalysisResult(null)} className="hover:text-red-500 transition-colors">RESET</button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#fdfdfd]">
          {errorString ? (
              <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{errorString}</p>
              </div>
          ) : analysisResult ? (
             <div className="animate-fadeIn">
                {/* Summary Header */}
                <div className="p-6 bg-white border-b border-slate-100">
                    <h3 className="text-[10px] font-black uppercase text-arduino-teal tracking-widest mb-3">Orchestrator Verdict</h3>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{analysisResult.summary}</p>
                </div>

                {/* Statistics Cards */}
                {analysisResult.stats && (
                    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50/50">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Complexity</span>
                            <span className="text-sm font-black text-slate-800">{analysisResult.stats.complexity.toUpperCase()}</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Est. Memory</span>
                            <span className="text-sm font-black text-slate-800">{analysisResult.stats.estimatedMemoryUsage}</span>
                        </div>
                    </div>
                )}

                {/* Issues List */}
                <div className="p-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Linting Results</h3>
                    
                    {analysisResult.issues.length === 0 ? (
                        <div className="text-center py-10 bg-green-50 rounded-2xl border border-green-100 border-dashed">
                            <svg className="w-10 h-10 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-xs font-black text-green-700 uppercase tracking-widest">Sketch is Verified</p>
                            <p className="text-[10px] text-green-600 mt-1 font-bold">Ready for upload to Arduino.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analysisResult.issues.map((issue, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        if (textareaRef.current) {
                                            const lineHeight = 24; 
                                            textareaRef.current.scrollTop = (issue.line - 3) * lineHeight;
                                        }
                                    }}
                                    className={`p-4 rounded-2xl border group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                                        issue.severity === 'error' 
                                        ? 'bg-red-50 border-red-100 hover:border-red-200' 
                                        : 'bg-yellow-50 border-yellow-100 hover:border-yellow-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                                            issue.severity === 'error' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                                        }`}>
                                            {issue.severity}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Line {issue.line}</span>
                                    </div>
                                    <p className="text-[13px] font-black text-slate-800 mb-3 leading-tight">{issue.message}</p>
                                    <div className="bg-white/60 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium">
                                        <span className="text-arduino-teal font-black uppercase text-[9px] block mb-1 tracking-widest">Recommended Fix</span>
                                        {issue.suggestion}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300 border border-slate-100 transform rotate-12 hover:rotate-0 transition-all duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Code Analysis Offline</h3>
               <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">
                 Click <span className="text-arduino-teal font-black">Lint Sketch</span> to activate the debug fleet and scan for Arduino-specific errors.
               </p>
            </div>
          )}
        </div>
        
        {/* Footer Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Agent Fleet v2.5.1-SketchSafe</p>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
