
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile, Dataset, AgentPlanStep, AgentResult } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatInterfaceProps {
  initialMessage?: string;
  userProfile: UserProfile;
  datasets: Dataset[];
  forcedDatasetId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage, userProfile, datasets, forcedDatasetId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialMessage || `Hello ${userProfile.name}! I am the Multi-Agent Orchestration Master. I coordinate a fleet of specialized agents to assist with your Arduino engineering. How can we help today?`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(forcedDatasetId || '');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (initialMessage && messages[0].text !== initialMessage) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            text: initialMessage,
            timestamp: Date.now()
        }]);
        triggerSend(initialMessage);
    }
  }, [initialMessage]);

  const triggerSend = async (text: string) => {
      if (isLoading) return;
      setIsLoading(true);

      let knowledgeContext = '';
      if (selectedDatasetId) {
          const ds = datasets.find(d => d.id === selectedDatasetId);
          if (ds) {
              knowledgeContext = `[KNOWLEDGE_CONTEXT: ${ds.name}]\n${ds.content}\n\n`;
          }
      }

      const prompt = `${knowledgeContext}User Input: ${text}\nTarget Skill Level: ${userProfile.skillLevel}`;

      try {
          const response = await sendMessageToGemini(prompt);
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: response.text,
            metadata: response.metadata,
            timestamp: Date.now()
          }]);
      } catch (error) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'model',
            text: "The Agent Fleet encountered a synchronization error. The Master Orchestrator is resetting the connection. Please try again.",
            isError: true,
            timestamp: Date.now()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
  }

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    }]);
    setInputText('');
    await triggerSend(text);
  };

  const handleConfirmAction = () => {
    const confirmMsg = "CONFIRM ACTUATE";
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        text: confirmMsg,
        timestamp: Date.now()
    }]);
    triggerSend(confirmMsg);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Fleet Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-xl bg-arduino-teal flex items-center justify-center font-black text-xl shadow-inner shadow-arduino-dark/50">M</div>
           <div>
              <h2 className="font-black text-sm tracking-tight uppercase">Master Orchestrator</h2>
              <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                 <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Fleet Status: Operational</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Context</span>
              <select 
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="text-[10px] bg-slate-800 text-arduino-teal border border-slate-700 rounded-md px-2 py-1 outline-none font-bold hover:border-arduino-teal transition-colors"
              >
                  <option value="">Global Knowledge Only</option>
                  {datasets.map(ds => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
              </select>
           </div>
           <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <span className="text-[10px] font-black text-slate-300">LEVEL: {userProfile.skillLevel.toUpperCase()}</span>
           </div>
        </div>
      </div>

      {/* Orchestration Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/40 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[95%] md:max-w-[85%] lg:max-w-[75%] rounded-2xl p-5 shadow-lg border ${
                msg.role === 'user'
                  ? 'bg-arduino-teal text-white border-arduino-dark rounded-br-none'
                  : 'bg-white border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
              
              {/* Agent Plan Visualization - Displayed before text for transparency */}
              {msg.metadata?.plan && msg.metadata.plan.length > 0 && (
                <div className="mb-4 bg-slate-900 rounded-xl p-4 text-[11px] border border-slate-700 shadow-inner">
                   <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <div className="text-arduino-teal font-black uppercase tracking-widest">Orchestration Plan</div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-2.5">
                     {msg.metadata.plan.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3 group">
                           <div className="bg-slate-800 text-arduino-teal px-2 py-0.5 rounded font-black min-w-[100px] text-center border border-slate-700 group-hover:border-arduino-teal transition-colors">{step.agent}</div>
                           <div className="text-slate-300 font-medium leading-tight py-0.5">{step.task}</div>
                        </div>
                     ))}
                   </div>
                </div>
              )}

              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={msg.text} />
              </div>

              {/* Specialist Artifacts / Results */}
              {msg.metadata?.results && Object.keys(msg.metadata.results).length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                   {Object.entries(msg.metadata.results as Record<string, AgentResult>).map(([name, res]) => (
                     res.artifacts && res.artifacts.map((art, aIdx) => (
                       <div key={aIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm group">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-[10px] font-black uppercase text-slate-500 tracking-tighter flex items-center">
                              <span className="w-2 h-2 bg-arduino-orange rounded-full mr-2"></span>
                              {name} Specialist Artifact: {art.type}
                            </div>
                            <button 
                              onClick={() => navigator.clipboard.writeText(art.content)}
                              className="text-[10px] text-arduino-teal font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              COPY
                            </button>
                          </div>
                          <div className="text-xs font-black text-slate-800 mb-3 border-l-2 border-arduino-teal pl-2">{art.name}</div>
                          {art.type === 'code' && (
                            <pre className="text-[10px] bg-slate-900 text-arduino-teal p-3 rounded-lg overflow-x-auto font-mono leading-normal shadow-inner border border-slate-800">
                              {art.content}
                            </pre>
                          )}
                          {art.type === 'log' && (
                            <div className="text-[10px] bg-slate-100 text-slate-600 p-3 rounded-lg font-mono border border-slate-200 italic">
                              {art.content}
                            </div>
                          )}
                       </div>
                     ))
                   ))}
                </div>
              )}

              {/* Critical Safety Checkpoint */}
              {msg.metadata?.requires_confirmation && (
                <div className="mt-6 bg-red-50 border-2 border-red-200 p-5 rounded-2xl shadow-md animate-pulse">
                    <div className="flex items-center text-red-700 font-black text-sm mb-3">
                       <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       SAFETY CHECKPOINT: HARDWARE INTERFACE REQUESTED
                    </div>
                    <p className="text-xs text-red-600 font-medium mb-5 leading-relaxed">
                      The specialist agents (hw-agent / safety-agent) have identified a physical intervention step. 
                      Review all wiring and power sources before clicking confirm. This action will send instructions to the microcontroller.
                    </p>
                    <button 
                      onClick={handleConfirmAction}
                      className="w-full bg-red-600 text-white py-3 rounded-xl font-black text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span>SEND: CONFIRM ACTUATE</span>
                    </button>
                </div>
              )}
            </div>
            
            <div className="mt-2 flex items-center space-x-2 px-2">
              <div className={`text-[10px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-slate-400' : 'text-arduino-teal'}`}>
                {msg.role === 'user' ? 'User_In' : `Fleet_Out • Sync: ${Math.round((msg.metadata?.confidence || 1) * 100)}%`}
              </div>
              {msg.metadata?.intent && (
                <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold">{msg.metadata.intent}</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md flex items-center space-x-4 border-l-4 border-l-arduino-teal">
               <div className="flex space-x-1.5">
                 <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest animate-pulse">Syncing specialist agents...</span>
                  <span className="text-[9px] text-slate-300 font-bold">Querying Master Logic</span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Command Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-end space-x-3 bg-slate-50 border border-slate-300 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-arduino-teal/50 focus-within:border-arduino-teal transition-all shadow-inner">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Issue command to the Agent Fleet..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-[48px] py-3 text-sm text-slate-800 placeholder-slate-400 font-medium"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className={`p-3 rounded-xl transition-all shadow-md active:scale-95 ${
                isLoading || !inputText.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-arduino-teal text-white hover:bg-arduino-dark hover:shadow-arduino-teal/20'
            }`}
            title="Send Message (Enter)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">End-to-End Orchestration v2.5.0</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
