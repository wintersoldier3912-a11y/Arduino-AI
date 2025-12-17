
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectLibrary from './components/ProjectLibrary';
import LearningPath from './components/LearningPath';
import ComponentDatabase from './components/ComponentDatabase';
import CodeEditor from './components/CodeEditor';
import CircuitAnalyzer from './components/CircuitAnalyzer';
import VisionMentor from './components/VisionMentor';
import Auth from './components/Auth';
import { View, Project, UserProfile, Difficulty } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  
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

  const handleLogin = (name: string) => {
    setUserProfile(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
  };

  const handleStartProject = (project: Project) => {
    setChatInitialMessage(`I want to start the project "${project.title}". Can you guide me through the required components and the circuit diagram first?`);
    setCurrentView(View.CHAT);
  };

  const handleAskAI = (message: string) => {
      setChatInitialMessage(message);
      setCurrentView(View.CHAT);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.CHAT:
        return <ChatInterface initialMessage={chatInitialMessage} userProfile={userProfile} />;
      case View.PROJECTS:
        return <ProjectLibrary onStartProject={handleStartProject} userProfile={userProfile} />;
      case View.LEARNING_PATH: // Now Reference Hub
        return <LearningPath userProfile={userProfile} />;
      case View.COMPONENTS:
        return <ComponentDatabase userProfile={userProfile} onAskAI={handleAskAI} />;
      case View.CODE_EDITOR:
        return <CodeEditor />;
      case View.CIRCUIT_ANALYZER:
        return <CircuitAnalyzer />;
      case View.VISION:
        return <VisionMentor />;
      case View.SETTINGS:
        return <div className="text-center text-slate-500 mt-20">Settings not implemented in this demo.</div>;
      case View.DASHBOARD:
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg border border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Project Workspace</h1>
                        <p className="opacity-80 max-w-xl">
                            Ready to build? Select a tool or continue your work on "Distance Sensor Alarm".
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                         <div className="text-sm opacity-60 uppercase tracking-wider font-bold">Current Expertise</div>
                         <div className="text-xl font-mono text-arduino-teal">{userProfile.skillLevel}</div>
                    </div>
                </div>
            </div>

            {/* Quick Tools Grid */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Engineering Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setCurrentView(View.CODE_EDITOR)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Code Workbench</h3>
                        <p className="text-sm text-slate-500 mt-1">Write, validate, and optimize C++.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.CIRCUIT_ANALYZER)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Circuit Analyzer</h3>
                        <p className="text-sm text-slate-500 mt-1">Verify logic and safety of connections.</p>
                    </button>

                    <button 
                        onClick={() => setCurrentView(View.VISION)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-arduino-teal hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">Vision Assistant</h3>
                        <p className="text-sm text-slate-500 mt-1">Real-time build verification via camera.</p>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Projects */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800 flex justify-between items-center">
                        <span>Suggested Builds</span>
                        <button onClick={() => setCurrentView(View.PROJECTS)} className="text-sm text-arduino-teal hover:underline">View All</button>
                    </div>
                    <div className="p-2">
                        <div 
                          onClick={() => handleStartProject({
                              id: 'p4', title: 'Distance Sensor Alarm', description: 'Intermediate', difficulty: 'Intermediate' as any, timeEstimate: '', components: [], tags: [], completed: false
                          })}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                            <div className="w-10 h-10 rounded bg-slate-100 text-slate-500 flex items-center justify-center font-bold">01</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">Distance Sensor Alarm</h4>
                                <p className="text-xs text-slate-500">Ultrasonic Sensor • Piezo • Logic</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">Intermediate</span>
                        </div>
                         <div 
                          onClick={() => handleStartProject({
                              id: 'p6', title: 'WiFi Weather Station', description: 'Advanced', difficulty: 'Advanced' as any, timeEstimate: '', components: [], tags: [], completed: false
                          })}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                            <div className="w-10 h-10 rounded bg-slate-100 text-slate-500 flex items-center justify-center font-bold">02</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">WiFi Weather Station</h4>
                                <p className="text-xs text-slate-500">ESP32 • BME280 • IoT</p>
                            </div>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">Advanced</span>
                        </div>
                    </div>
                </div>

                {/* Reference Search Mini */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800">
                        Quick Reference
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center">
                        <p className="text-sm text-slate-500 mb-4">Need to look up a protocol or component pinout quickly?</p>
                        <button 
                            onClick={() => setCurrentView(View.LEARNING_PATH)}
                            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-arduino-teal hover:text-arduino-teal transition-all flex items-center justify-center font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Open Reference Hub
                        </button>
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
        {/* Mobile Header */}
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
