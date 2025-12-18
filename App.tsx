
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
  
  // State for user profile and skills
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Engineer',
    skillLevel: Difficulty.INTERMEDIATE,
    skills: {
        electronics: 0.4,
        programming: 0.6,
        iot: 0.2,
        debugging: 0.3
    }
  });

  // Knowledge Base State
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
        id: 'd1',
        name: 'V2 Walker Robot Specs',
        description: 'Pinouts and motor specs for the V2 Walker robot prototype.',
        content: `Project Name: V2 Walker Robot
Hardware Config:
- Motor Driver: L298N module connected to Arduino Pins 5,6 (ENA, ENB), 7,8,9,10 (IN1-4).
- Power: 3S LiPo Battery (11.1V).
- Servo Controller: PCA9685 at I2C address 0x40.
- Sensors: MPU6050 Gyro at 0x68.

Known Issues:
- The servo jitter happens if battery voltage drops below 10.5V.
- Code requires the Adafruit PWM Servo Driver library.`,
        updatedAt: Date.now(),
        sourceType: 'manual'
    }
  ]);

  const handleLogin = (name: string) => {
    setUserProfile(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
  };

  const handleStartProject = (project: Project) => {
    setChatInitialMessage(`I am starting the "${project.title}" project. ${project.knowledgeBaseId ? "I've attached the relevant dataset." : ""} Help me get started with the architecture and wiring.`);
    if (project.knowledgeBaseId) {
      setActiveDatasetId(project.knowledgeBaseId);
    }
    setCurrentView(View.CHAT);
  };

  const handleAskAI = (message: string) => {
      setChatInitialMessage(message);
      setCurrentView(View.CHAT);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.CHAT:
        return <ChatInterface initialMessage={chatInitialMessage} userProfile={userProfile} datasets={datasets} forcedDatasetId={activeDatasetId} />;
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
        return <div className="text-center text-slate-500 mt-20">Settings not implemented in this demo.</div>;
      case View.DASHBOARD:
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg border border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Engineering Workspace</h1>
                        <p className="opacity-80 max-w-xl text-lg font-light leading-relaxed">
                            Welcome back. Your active Knowledge Collections are online and ready for cross-project inference.
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                         <div className="text-xs opacity-60 uppercase tracking-widest font-bold mb-1">Expertise Vector</div>
                         <div className="text-2xl font-mono text-arduino-teal">{userProfile.skillLevel}</div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-arduino-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                  System Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setCurrentView(View.KNOWLEDGE_BASE)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Knowledge Ingestion</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage technical datasets and reference material.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.CODE_EDITOR)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Code Workbench</h3>
                        <p className="text-sm text-slate-500 mt-1">Write, validate, and optimize firmware.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.VISION)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Vision Mentor</h3>
                        <p className="text-sm text-slate-500 mt-1">Real-time hardware inspection via live feed.</p>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800 flex justify-between items-center bg-slate-50">
                        <span>Active Datasets</span>
                        <button onClick={() => setCurrentView(View.KNOWLEDGE_BASE)} className="text-xs text-arduino-teal hover:underline font-bold uppercase tracking-wider">Expand</button>
                    </div>
                    <div className="p-0 overflow-y-auto max-h-64">
                        {datasets.map(ds => (
                          <div key={ds.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                            <div>
                              <div className="font-bold text-slate-700 text-sm">{ds.name}</div>
                              <div className="text-xs text-slate-400">{ds.description}</div>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Ready</span>
                          </div>
                        ))}
                        {datasets.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-sm">No knowledge collections ingest yet.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800 bg-slate-50">
                        Quick Discovery
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">Hardware & Tech Specs</h3>
                        <p className="text-sm text-slate-500 mb-4">Search the component database or find technical reference guides.</p>
                        <div className="flex gap-2 w-full">
                          <button 
                              onClick={() => setCurrentView(View.COMPONENTS)}
                              className="flex-1 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
                          >
                              Hardware DB
                          </button>
                          <button 
                              onClick={() => setCurrentView(View.LEARNING_PATH)}
                              className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                          >
                              Reference Hub
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
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h1 className="font-bold text-lg text-slate-800">Arduino Mentor</h1>
            <button className="text-slate-500">
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
