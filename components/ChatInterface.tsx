
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile, Dataset, AgentResult } from '../types';
import { sendMessageToGemini, generateSpeech } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatInterfaceProps {
  initialMessage?: string;
  userProfile: UserProfile;
  datasets: Dataset[];
  forcedDatasetId?: string;
  onAddDataset?: (dataset: Dataset) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialMessage, 
  userProfile, 
  datasets, 
  forcedDatasetId,
  onAddDataset 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialMessage || `Hello ${userProfile.name}! I am the Master Orchestrator. My specialist agent fleet is standing by for your Arduino mission. What's our first objective?`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(forcedDatasetId || '');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (forcedDatasetId) setSelectedDatasetId(forcedDatasetId);
  }, [forcedDatasetId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage && !messages.some(m => m.text === initialMessage)) {
        handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;
    
    // Add user message if not already there (initial message case)
    if (!messages.find(m => m.text === text && m.role === 'user')) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: Date.now()
        }]);
    }

    setIsLoading(true);
    setInputText('');

    let knowledgeContext = '';
    if (selectedDatasetId) {
        const ds = datasets.find(d => d.id === selectedDatasetId);
        if (ds) {
            knowledgeContext = `[MISSION_LOG: ${ds.name}]\n${ds.content}\n\n`;
        }
    }

    const prompt = `${knowledgeContext}Command: ${text}\nSkill: ${userProfile.skillLevel}`;

    try {
        const response = await sendMessageToGemini(prompt);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-model",
          role: 'model',
          text: response.text,
          metadata: response.metadata,
          timestamp: Date.now()
        }]);
    } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-error",
          role: 'model',
          text: "Critical synchronization error in the Agent Fleet. Please re-issue command.",
          isError: true,
          timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSpeech = async (messageId: string, text: string) => {
    if (isSpeaking === messageId) {
        // Stop current audio if needed
        setIsSpeaking(null);
        return;
    }

    setIsSpeaking(messageId);
    const audioData = await generateSpeech(text.slice(0, 500));
    if (!audioData) {
        setIsSpeaking(null);
        return;
    }

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const ctx = audioContextRef.current;
    const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(null);
    source.start();
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const handleAddToKnowledge = (artifact: any) => {
    if (!onAddDataset) return;
    const newDs: Dataset = {
      id: `art-${Date.now()}`,
      name: artifact.name || 'AI Generated Artifact',
      description: `Generated from mission on ${new Date().toLocaleDateString()}`,
      content: artifact.content,
      updatedAt: Date.now(),
      sourceType: 'manual'
    };
    onAddDataset(newDs);
    alert('Artifact synced to Dataset Nexus!');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Fleet Command Header */}
      <div className="px-6 py-4 bg-[#0B0E14] text-white flex justify-between items-center shadow-lg relative z-10">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 rounded-2xl bg-arduino-teal flex items-center justify-center font-black text-2xl shadow-[0_0_15px_rgba(0,151,157,0.4)] border border-arduino-dark">M</div>
           <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-xs tracking-widest uppercase text-arduino-teal">Fleet Command</h2>
                <div className="px-1.5 py-0.5 bg-arduino-teal/10 border border-arduino-teal/30 rounded text-[9px] font-bold text-arduino-teal">v2.5</div>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                 <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Orchestrator Online</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Nexus</span>
              <select 
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="text-[10px] bg-slate-900 text-arduino-teal border border-slate-700 rounded-lg px-3 py-1.5 outline-none font-black hover:border-arduino-teal transition-all shadow-inner"
              >
                  <option value="">Global Core Only</option>
                  {datasets.map(ds => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
              </select>
           </div>
           <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-black text-slate-400 block tracking-widest mb-0.5 uppercase">Sync Rank</span>
              <span className="text-xs font-black text-white">{userProfile.skillLevel.toUpperCase()}</span>
           </div>
        </div>
      </div>

      {/* Orchestration Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-[#fdfdfd] scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[95%] md:max-w-[85%] lg:max-w-[80%] rounded-3xl p-6 shadow-xl relative border ${
                msg.role === 'user'
                  ? 'bg-arduino-teal text-white border-arduino-dark rounded-br-none'
                  : 'bg-white border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
              
              {/* Agent Plan HUD */}
              {msg.metadata?.plan && msg.metadata.plan.length > 0 && (
                <div className="mb-6 bg-[#0B0E14] rounded-2xl p-4 text-[11px] border border-slate-800 shadow-2xl">
                   <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                      <div className="text-arduino-teal font-black uppercase tracking-[0.2em]">Deployment Plan</div>
                      <div className="text-slate-500 font-bold">STEPS: {msg.metadata.plan.length}</div>
                   </div>
                   <div className="space-y-3">
                     {msg.metadata.plan.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3 group">
                           <div className="bg-slate-800 text-arduino-teal px-2 py-1 rounded font-black min-w-[110px] text-center border border-slate-700 group-hover:border-arduino-teal transition-all text-[9px] uppercase tracking-tighter">
                             {step.agent}
                           </div>
                           <div className="text-slate-400 font-medium leading-tight py-1">{step.task}</div>
                        </div>
                     ))}
                   </div>
                </div>
              )}

              <div className="text-[15px] leading-relaxed font-medium">
                <MarkdownRenderer content={msg.text} />
              </div>

              {/* Artifact Display */}
              {msg.metadata?.results && Object.keys(msg.metadata.results).length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-5">
                   {Object.entries(msg.metadata.results as Record<string, AgentResult>).map(([name, res]) => (
                     res.artifacts && res.artifacts.map((art, aIdx) => (
                       <div key={aIdx} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm group hover:shadow-md transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                              <span className="w-2.5 h-2.5 bg-arduino-orange rounded-full mr-3 shadow-[0_0_8px_rgba(228,113,40,0.4)]"></span>
                              {name} Specialist Output: {art.type}
                            </div>
                            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleAddToKnowledge(art)}
                                  className="text-[10px] text-arduino-teal font-black uppercase tracking-widest hover:underline"
                                >
                                  Sync to Nexus
                                </button>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(art.content)}
                                  className="text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-slate-900"
                                >
                                  Copy
                                </button>
                            </div>
                          </div>
                          <div className="text-sm font-black text-slate-900 mb-3 border-l-4 border-arduino-teal pl-3">{art.name}</div>
                          {art.type === 'code' && (
                            <pre className="text-[11px] bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl overflow-x-auto font-mono leading-normal border border-slate-800 shadow-inner">
                              {art.content}
                            </pre>
                          )}
                       </div>
                     ))
                   ))}
                </div>
              )}

              {/* Message Controls */}
              {msg.role === 'model' && (
                <div className="absolute -bottom-4 right-6 flex space-x-2">
                    <button 
                        onClick={() => handleSpeech(msg.id, msg.text)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all border ${
                            isSpeaking === msg.id 
                            ? 'bg-arduino-teal text-white border-arduino-dark animate-pulse' 
                            : 'bg-white text-slate-400 border-slate-200 hover:text-arduino-teal hover:border-arduino-teal'
                        }`}
                        title="Voice Audio"
                    >
                        {isSpeaking === msg.id ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        )}
                    </button>
                </div>
              )}
            </div>
            
            <div className={`mt-3 flex items-center space-x-3 px-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-slate-400' : 'text-arduino-teal'}`}>
                {msg.role === 'user' ? 'Operator' : `Command • ${Math.round((msg.metadata?.confidence || 1) * 100)}% Sync`}
              </div>
              {msg.metadata?.intent && (
                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-slate-200">{msg.metadata.intent}</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xl flex items-center space-x-5 border-l-[6px] border-l-arduino-teal">
               <div className="flex space-x-1.5">
                 <div className="w-2.5 h-2.5 bg-arduino-teal rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2.5 h-2.5 bg-arduino-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2.5 h-2.5 bg-arduino-teal rounded-full animate-bounce"></div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-widest animate-pulse">Orchestrating Specialist Fleet...</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Syncing Cross-Domain Logic</span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Terminal Input Area */}
      <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
        <div className="max-w-5xl mx-auto flex items-end space-x-4 bg-slate-50 border border-slate-300 rounded-[2rem] p-3 focus-within:ring-4 focus-within:ring-arduino-teal/10 focus-within:border-arduino-teal transition-all shadow-inner">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(inputText))}
            placeholder="Issue command to the Fleet..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-[56px] py-4 px-4 text-[15px] text-slate-800 placeholder-slate-400 font-medium leading-relaxed"
            rows={1}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className={`w-14 h-14 rounded-full transition-all shadow-xl active:scale-90 flex items-center justify-center ${
                isLoading || !inputText.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-arduino-teal text-white hover:bg-arduino-dark hover:shadow-arduino-teal/30'
            }`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex justify-center space-x-6 text-[9px] text-slate-400 font-black uppercase tracking-[0.25em]">
            <span>Secured Link</span>
            <span className="text-arduino-teal/50">•</span>
            <span>Agent Sync v2.5.0</span>
            <span className="text-arduino-teal/50">•</span>
            <span>Mission Control</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
