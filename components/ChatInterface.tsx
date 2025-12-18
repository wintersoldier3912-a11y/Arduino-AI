
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
      text: initialMessage || `Hello ${userProfile.name}! I am the Multi-Agent Orchestrator. How can our team help with your Arduino project today?`,
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
              knowledgeContext = `[KNOWLEDGE BASE: ${ds.name}]\n${ds.content}\n`;
          }
      }

      const prompt = `${knowledgeContext}${text}`;

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
            text: "The agent team encountered a critical error. Please check your system status.",
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
      {/* Multi-Agent Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 rounded-full bg-arduino-teal flex items-center justify-center font-black">M</div>
           <div>
              <h2 className="font-bold text-sm tracking-tight">Master Orchestrator</h2>
              <div className="flex items-center space-x-1.5">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] text-slate-400 uppercase font-black">Multi-Agent System Online</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <select 
             value={selectedDatasetId}
             onChange={(e) => setSelectedDatasetId(e.target.value)}
             className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 rounded px-2 py-1 outline-none"
           >
               <option value="">No Collection</option>
               {datasets.map(ds => (
                   <option key={ds.id} value={ds.id}>{ds.name}</option>
               ))}
           </select>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-arduino-teal text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}>
              
              {/* Agent Plan Visualization */}
              {msg.metadata?.plan && (
                <div className="mb-4 bg-slate-900 rounded-lg p-3 text-[10px] border border-slate-700">
                   <div className="text-slate-500 font-black uppercase mb-2 tracking-widest border-b border-slate-800 pb-1">Orchestration Plan</div>
                   <div className="space-y-2">
                     {msg.metadata.plan.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                           <span className="text-arduino-teal font-bold min-w-[80px]">{step.agent}:</span>
                           <span className="text-slate-300">{step.task}</span>
                        </div>
                     ))}
                   </div>
                </div>
              )}

              <div className="text-sm">
                <MarkdownRenderer content={msg.text} />
              </div>

              {/* Agent Results / Artifacts - Added type cast to fix "unknown" property access error */}
              {msg.metadata?.results && Object.keys(msg.metadata.results).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                   {Object.entries(msg.metadata.results as Record<string, AgentResult>).map(([name, res]) => (
                     res.artifacts && res.artifacts.map((art, aIdx) => (
                       <div key={aIdx} className="bg-slate-50 rounded border border-slate-200 p-3">
                          <div className="text-[9px] font-black uppercase text-slate-400 mb-1">{name} Artifact: {art.type}</div>
                          <div className="text-xs font-bold text-slate-700 mb-2">{art.name}</div>
                          {art.type === 'code' && (
                            <pre className="text-[10px] bg-slate-900 text-slate-300 p-2 rounded overflow-x-auto font-mono">
                              {art.content}
                            </pre>
                          )}
                       </div>
                     ))
                   ))}
                </div>
              )}

              {/* Safety Confirmation */}
              {msg.metadata?.requires_confirmation && (
                <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
                    <div className="flex items-center text-red-700 font-bold text-sm mb-2">
                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       SAFETY ACTION REQUIRED
                    </div>
                    <p className="text-xs text-red-600 mb-4">The agent team is requesting physical actuation or flashing. Review safety before proceeding.</p>
                    <button 
                      onClick={handleConfirmAction}
                      className="w-full bg-red-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-red-700 transition-colors shadow-lg"
                    >
                      CONFIRM ACTUATE
                    </button>
                </div>
              )}
            </div>
            <div className="mt-1 text-[9px] text-slate-400 uppercase font-bold px-2">
              {msg.role === 'user' ? 'You' : `Agent Team • Conf: ${msg.metadata?.confidence || '1.0'}`}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
               <div className="flex space-x-1">
                 <div className="w-1.5 h-1.5 bg-arduino-teal rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-arduino-teal rounded-full animate-bounce delay-100"></div>
                 <div className="w-1.5 h-1.5 bg-arduino-teal rounded-full animate-bounce delay-200"></div>
               </div>
               <span className="text-[10px] font-black uppercase text-slate-400 animate-pulse">Orchestrating Agents...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-arduino-teal/50 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Instruct the agent team..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-[44px] py-2 text-sm text-slate-800"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className={`p-2.5 rounded-lg transition-all ${
                isLoading || !inputText.trim() 
                ? 'bg-slate-200 text-slate-400' 
                : 'bg-arduino-teal text-white hover:bg-arduino-dark shadow-md'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;