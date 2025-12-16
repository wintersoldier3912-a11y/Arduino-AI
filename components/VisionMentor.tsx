
import React, { useRef, useEffect, useState } from 'react';
import { INITIAL_PROJECTS } from '../constants';
import { analyzeVisionFrame } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const VisionMentor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please ensure you have granted permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        const project = INITIAL_PROJECTS.find(p => p.id === selectedProjectId);
        const context = project 
            ? `Building project: ${project.title}. Components: ${project.components.join(', ')}. Description: ${project.description}`
            : "General Arduino prototyping";

        const result = await analyzeVisionFrame(imageBase64, context);
        setAnalysis(result);
      }
    } catch (err) {
      console.error("Analysis failed", err);
      setAnalysis("Failed to analyze the frame. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      {/* Main Camera View */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden relative shadow-lg border border-slate-700 flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-mono flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            {isStreaming ? 'LIVE FEED' : 'OFFLINE'}
        </div>

        <div className="flex-1 relative flex items-center justify-center bg-slate-900">
            {error ? (
                <div className="text-white text-center p-6">
                    <svg className="w-12 h-12 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>{error}</p>
                    <button onClick={startCamera} className="mt-4 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">Retry</button>
                </div>
            ) : (
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-contain"
                />
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Overlay */}
        <div className="bg-slate-900/80 backdrop-blur p-4 flex justify-between items-center border-t border-slate-700">
            <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Active Project Context</label>
                <select 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-600 rounded px-3 py-1 text-sm outline-none focus:border-arduino-teal"
                >
                    {INITIAL_PROJECTS.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                    <option value="general">Free Build (General)</option>
                </select>
            </div>
            
            <button
                onClick={captureAndAnalyze}
                disabled={!isStreaming || isAnalyzing}
                className="bg-arduino-teal text-white pl-4 pr-6 py-3 rounded-full font-bold hover:bg-arduino-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center transform hover:scale-105 active:scale-95"
            >
                {isAnalyzing ? (
                   <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-white mr-2"></div>
                )}
                <span className="ml-2">{isAnalyzing ? 'Analyzing...' : 'Snap & Verify'}</span>
            </button>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="md:w-96 flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
         <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
             <h2 className="font-bold text-slate-800 flex items-center">
                 <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 Vision Mentor
             </h2>
             {analysis && <button onClick={() => setAnalysis(null)} className="text-xs text-slate-400 hover:text-red-500">Clear</button>}
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
             {analysis ? (
                 <div className="prose prose-sm prose-slate">
                     <MarkdownRenderer content={analysis} />
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
                     <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     </div>
                     <div>
                        <h3 className="font-medium text-slate-600">Ready to Analyze</h3>
                        <p className="text-sm mt-1">Point your camera at your circuit and click "Snap & Verify".</p>
                     </div>
                     <div className="text-xs bg-yellow-50 border border-yellow-100 p-3 rounded text-yellow-800 text-left w-full">
                         <strong>Safety First:</strong> Ensure your workspace is well-lit. If the AI detects a short, disconnect power immediately.
                     </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default VisionMentor;
