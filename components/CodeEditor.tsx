
import React, { useState } from 'react';
import { analyzeCode } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

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
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(code);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Error analyzing code. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
          <div className="flex space-x-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-xs font-mono">sketch.ino</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 w-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 outline-none resize-none"
          spellCheck={false}
        />
        <div className="bg-slate-800 p-3 flex justify-end">
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

      <div className="md:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
          <span>AI Analysis Report</span>
          {analysis && (
              <button onClick={() => setAnalysis(null)} className="text-xs text-slate-400 hover:text-red-500">Clear</button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
          {analysis ? (
             <div className="text-sm">
                <MarkdownRenderer content={analysis} />
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
               <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               <p>Run validation to check for errors and improvements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
