import React, { useState } from 'react';
import { analyzeCircuit } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const CircuitAnalyzer: React.FC = () => {
  const [description, setDescription] = useState(`Arduino Uno 5V -> Breadboard + Rail
Arduino Uno GND -> Breadboard - Rail
HC-SR04 VCC -> Breadboard + Rail
HC-SR04 GND -> Breadboard - Rail
HC-SR04 Trig -> Arduino Pin 9
HC-SR04 Echo -> Arduino Pin 10
Piezo Buzzer Positive -> Arduino Pin 8
Piezo Buzzer Negative -> Breadboard - Rail`);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCircuit(description);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Error analyzing circuit. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Circuit Connection Describer</h2>
          <p className="text-sm text-slate-500">Describe your wiring below. Be specific about pins and components.</p>
        </div>
        <div className="flex-1 p-0 relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-full p-6 outline-none resize-none text-slate-700 font-mono text-sm leading-relaxed"
            placeholder="e.g. Arduino Pin 13 connected to LED Anode..."
          />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
           <div className="text-xs text-slate-500 hidden md:block">
              Tip: Mention resistor values and power sources for better analysis.
           </div>
           <button
             onClick={handleAnalyze}
             disabled={isAnalyzing || !description.trim()}
             className="bg-arduino-teal text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-arduino-dark transition-colors flex items-center disabled:opacity-50 shadow-sm"
           >
             {isAnalyzing ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Checking Connections...
               </>
             ) : (
               <>
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Analyze Circuit
               </>
             )}
           </button>
        </div>
      </div>

      <div className="md:w-[450px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
          <span className="flex items-center">
             <svg className="w-5 h-5 mr-2 text-arduino-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Analysis Report
          </span>
          {analysis && (
              <button onClick={() => setAnalysis(null)} className="text-xs text-slate-400 hover:text-red-500">Clear</button>
          )}
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
          {analysis ? (
             <div className="text-sm">
                <MarkdownRenderer content={analysis} />
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               </div>
               <h3 className="font-medium text-slate-600 mb-1">Ready to Analyze</h3>
               <p className="text-sm">Enter your circuit wiring details on the left and click Analyze to get AI feedback on safety and logic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircuitAnalyzer;