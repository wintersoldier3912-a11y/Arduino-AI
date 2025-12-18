
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectLibrary from './components/ProjectLibrary';
import LearningPath from './components/LearningPath';
import ComponentDatabase from './components/ComponentDatabase';
import CodeEditor from './components/CodeEditor';
import CircuitAnalyzer from './components/CircuitAnalyzer';
import VisionMentor from './components/VisionMentor';
import KnowledgeBase from './components/KnowledgeBase';
import Auth from './components/Auth';
import { View, Project, UserProfile, Difficulty, Dataset } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [activeDatasetId, setActiveDatasetId] = useState<string>('');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Arduino Maker',
    skillLevel: Difficulty.INTERMEDIATE,
    skills: {
        electronics: 0.4,
        programming: 0.6,
        iot: 0.2,
        debugging: 0.3
    }
  });

  const [datasets, setDatasets] = useState<Dataset[]>([
    {
        id: 'd1',
        name: 'Arduino Pinout Reference',
        description: 'Standard mappings for Uno, Nano, and Mega.',
        content: `Arduino Uno R3:
- Pins 0,1: Hardware Serial
- Pins 3,5,6,9,10,11: PWM
- Pins A0-A5: Analog Inputs
- I2C: SDA (A4), SCL (A5)
- SPI: 10 (SS), 11 (MOSI), 12 (MISO), 13 (SCK)`,
        updatedAt: Date.now(),
        sourceType: 'manual'
    }
  ]);

  const handleLogin = (name: string) => {
    setUserProfile(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
  };

  const handleStartProject = (project: Project) => {
    setChatInitialMessage(`I'm starting the Arduino project: "${project.title}". Help me with the circuit wiring and the initial Sketch structure.`);
    if (project.knowledgeBaseId) {
      setActiveDatasetId(project.knowledgeBaseId);
    }
    setCurrentView(View.CHAT);
  };

  const handleAskAI = (message: string) => {
      setChatInitialMessage(message);
      setCurrentView(View.CHAT);
  };

  const handleAddDataset = (newDs: Dataset) => {
    setDatasets(prev => [...prev, newDs]);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.CHAT:
        return (
          <ChatInterface 
            initialMessage={chatInitialMessage} 
            userProfile={userProfile} 
            datasets={datasets} 
            forcedDatasetId={activeDatasetId} 
            onAddDataset={handleAddDataset}
          />
        );
      case View.PROJECTS:
        return <ProjectLibrary onStartProject={handleStartProject} userProfile={userProfile} datasets={datasets} />;
      case View.LEARNING_PATH:
        return <LearningPath userProfile={userProfile} />;
      case View.COMPONENTS:
        return <ComponentDatabase userProfile={userProfile} onAskAI={handleAskAI} />;
      case View.CODE_EDITOR:
        return <CodeEditor />;
      case View.CIRCUIT_ANALYZER:
        return <CircuitAnalyzer />;
      case View.VISION:
        return <VisionMentor />;
      case View.KNOWLEDGE_BASE:
        return <KnowledgeBase datasets={datasets} setDatasets={setDatasets} />;
      case View.SETTINGS:
        return <div className="text-center text-slate-500 mt-20">Settings for Arduino core not implemented.</div>;
      case View.DASHBOARD:
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-arduino-dark to-slate-900 rounded-2xl p-8 text-white shadow-lg border border-arduino-teal/20">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Arduino Mission Control</h1>
                        <p className="opacity-80 max-w-xl text-lg font-light leading-relaxed">
                            Your Arduino Fleet is online. All specialized agents are synced to your current mission profile.
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                         <div className="text-[10px] opacity-60 uppercase tracking-widest font-black mb-1">Board Expertise</div>
                         <div className="text-2xl font-mono text-arduino-teal">{userProfile.skillLevel.toUpperCase()}</div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-arduino-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                  Arduino Specialist Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setCurrentView(View.KNOWLEDGE_BASE)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-arduino-light text-arduino-teal flex items-center justify-center mb-4 group-hover:bg-arduino-teal group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-tight">Datasheet Nexus</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Ingest Arduino board specs and component manuals.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.CODE_EDITOR)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-tight">Sketch Laboratory</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Write and validate .ino Sketches with AI debugging.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.VISION)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-tight">Vision Hardware AI</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Inspect Arduino wiring through your device camera.</p>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 font-black text-xs text-slate-400 uppercase tracking-widest bg-slate-50 flex justify-between items-center">
                        <span>Active Pin Mapping</span>
                        <button onClick={() => setCurrentView(View.KNOWLEDGE_BASE)} className="text-[10px] text-arduino-teal hover:underline font-black">EXPAND NEXUS</button>
                    </div>
                    <div className="p-0 overflow-y-auto max-h-64">
                        {datasets.map(ds => (
                          <div key={ds.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                            <div>
                              <div className="font-black text-slate-700 text-sm uppercase tracking-tight">{ds.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">{ds.description}</div>
                            </div>
                            <span className="text-[9px] bg-arduino-light text-arduino-teal px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 transition-opacity">ATTACHED</span>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 font-black text-xs text-slate-400 uppercase tracking-widest bg-slate-50">
                        Arduino Discovery
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-arduino-light text-arduino-teal rounded-3xl flex items-center justify-center mb-6 shadow-inner transform -rotate-6">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="font-black text-slate-900 mb-2 uppercase text-sm tracking-tight">Board & Shield Specs</h3>
                        <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Search the Arduino hardware library or generate pinout reference guides.</p>
                        <div className="flex gap-3 w-full max-w-sm">
                          <button 
                              onClick={() => setCurrentView(View.COMPONENTS)}
                              className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                          >
                              Inventory
                          </button>
                          <button 
                              onClick={() => setCurrentView(View.LEARNING_PATH)}
                              className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                          >
                              Reference
                          </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden ml-0 md:ml-64 transition-all duration-300">
        <div className="md:hidden bg-[#0B0E14] border-b border-slate-800 p-4 flex items-center justify-between">
            <h1 className="font-black text-sm text-white uppercase tracking-widest">Arduino Fleet</h1>
            <button className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto h-full">
                {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
