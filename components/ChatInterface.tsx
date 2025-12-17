
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile, Dataset } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatInterfaceProps {
  initialMessage?: string;
  userProfile: UserProfile;
  datasets: Dataset[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage, userProfile, datasets }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialMessage || `Hello ${userProfile.name}! I see you're at an ${userProfile.skillLevel} level. How can I help you advance your Arduino skills today?`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Prepare Knowledge Base Context
      let knowledgeContext = '';
      if (selectedDatasetId) {
          const ds = datasets.find(d => d.id === selectedDatasetId);
          if (ds) {
              knowledgeContext = `
              \n[SYSTEM: KNOWLEDGE BASE ATTACHED]
              The user has provided the following specific technical context. Use this information to answer if relevant.
              --- START DATASET: ${ds.name} ---
              ${ds.content}
              --- END DATASET ---
              `;
          }
      }

      // We append a hidden system context to the message so the model knows the user's skill level and KB
      const contextPrompt = `
      [SYSTEM CONTEXT: User Skill Level: ${userProfile.skillLevel}. 
      Skill Breakdown: Electronics=${userProfile.skills.electronics.toFixed(2)}, Programming=${userProfile.skills.programming.toFixed(2)}, IoT=${userProfile.skills.iot.toFixed(2)}. 
      Adjust your explanation complexity accordingly.]
      ${knowledgeContext}
      
      User Query: ${text}`;

      // Create a placeholder for the model response
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'model',
        text: '', // Start empty for streaming
        timestamp: Date.now()
      }]);

      try {
          const stream = await sendMessageToGemini(contextPrompt);
          let fullText = '';
          
          for await (const chunk of stream) {
              fullText += chunk;
              setMessages(prev => 
                  prev.map(msg => 
                      msg.id === responseId 
                      ? { ...msg, text: fullText } 
                      : msg
                  )
              );
          }
      } catch (error) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'model',
            text: "I'm having trouble connecting to my brain right now. Please check your internet connection or API key.",
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
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    await triggerSend(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
           <h2 className="font-semibold text-slate-800">Arduino Mentor Chat</h2>
           <p className="text-xs text-slate-500">Powered by Gemini 2.5 • Adaptive Difficulty: {userProfile.skillLevel}</p>
        </div>
        
        {/* Knowledge Base Selector */}
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
               <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               <select 
                 value={selectedDatasetId}
                 onChange={(e) => setSelectedDatasetId(e.target.value)}
                 className="text-xs text-slate-600 outline-none bg-transparent cursor-pointer max-w-[150px]"
                 title="Attach a Knowledge Base to this chat session"
               >
                   <option value="">No Active Dataset</option>
                   {datasets.map(ds => (
                       <option key={ds.id} value={ds.id}>{ds.name}</option>
                   ))}
               </select>
           </div>
           
           <div className="flex space-x-2 items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-700 font-medium hidden sm:inline">Online</span>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-arduino-teal text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-800' : ''}`}
            >
              <div className="flex items-center space-x-2 mb-1 opacity-70 text-xs">
                 <span className="font-bold uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'Mentor'}</span>
              </div>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              ) : (
                <MarkdownRenderer content={msg.text} />
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-arduino-teal rounded-full animate-bounce delay-200"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-end space-x-2 bg-slate-50 border border-slate-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-arduino-teal/50 focus-within:border-arduino-teal transition-all">
          <button className="p-2 text-slate-400 hover:text-arduino-teal transition-colors" title="Upload Code/Image (Not Implemented)">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={selectedDatasetId ? `Asking with context from "${datasets.find(d => d.id === selectedDatasetId)?.name}"...` : "Ask about your project, paste code, or describe a circuit..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2 text-slate-800 placeholder-slate-400"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-lg transition-all ${
                isLoading || !inputText.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-arduino-teal text-white hover:bg-arduino-dark shadow-sm'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
            AI can make mistakes. Verify pinouts and code before uploading to hardware.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
