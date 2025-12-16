import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectLibrary from './components/ProjectLibrary';
import LearningPath from './components/LearningPath';
import ComponentDatabase from './components/ComponentDatabase';
import { View, Project, UserProfile, Difficulty } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  
  // State for user profile and skills
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Maker',
    skillLevel: Difficulty.INTERMEDIATE,
    skills: {
        electronics: 0.4,
        programming: 0.6,
        iot: 0.2,
        debugging: 0.3
    },
    projectsCompleted: 3,
    conceptsLearned: 12,
    streakDays: 5
  });

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
        return <ProjectLibrary onStartProject={handleStartProject} />;
      case View.LEARNING_PATH:
        return <LearningPath />;
      case View.COMPONENTS:
        return <ComponentDatabase userProfile={userProfile} onAskAI={handleAskAI} />;
      case View.SETTINGS:
        return <div className="text-center text-slate-500 mt-20">Settings not implemented in this demo.</div>;
      case View.DASHBOARD:
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-arduino-teal to-blue-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}!</h1>
                <p className="opacity-90 max-w-xl mb-6">You're on a {userProfile.streakDays}-day streak. Continue your "Digital I/O" module to unlock the next badge.</p>
                <div className="flex gap-3">
                    <button 
                    onClick={() => setCurrentView(View.LEARNING_PATH)}
                    className="bg-white text-arduino-teal px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow"
                    >
                        Continue Learning
                    </button>
                    <button 
                    onClick={() => setCurrentView(View.COMPONENTS)}
                    className="bg-arduino-dark/40 border border-white/20 text-white px-6 py-2 rounded-lg font-bold hover:bg-arduino-dark/60 transition-all"
                    >
                        Browse Parts
                    </button>
                </div>
            </div>

            {/* Skill Assessment Tracker */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Skill Proficiency</h2>
                    <span className="text-xs bg-arduino-light text-arduino-dark px-2 py-1 rounded font-bold">
                        Overall: {userProfile.skillLevel}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(userProfile.skills).map(([skill, level]) => (
                        <div key={skill} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="capitalize text-slate-600 font-medium">{skill}</span>
                                <span className="text-slate-800 font-bold">{Math.round((level as number) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-arduino-teal transition-all duration-1000"
                                    style={{ width: `${(level as number) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-6 text-center">
                    Skills update automatically based on completed projects and AI interactions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Projects Completed</div>
                    <div className="text-3xl font-bold text-slate-800">{userProfile.projectsCompleted}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Concepts Learned</div>
                    <div className="text-3xl font-bold text-slate-800">{userProfile.conceptsLearned}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Current Streak</div>
                    <div className="text-3xl font-bold text-arduino-orange">{userProfile.streakDays} Days 🔥</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800">
                        Recommended Next Steps
                    </div>
                    <div className="p-6 space-y-4">
                        <div 
                          onClick={() => handleStartProject({
                              id: 'p4', title: 'Distance Sensor Alarm', description: '', difficulty: 'Intermediate' as any, timeEstimate: '', components: [], tags: [], completed: false
                          })}
                          className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                            <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Start "Distance Sensor Alarm"</h4>
                                <p className="text-sm text-slate-500">Practice using ultrasonic sensors and `if/else` logic.</p>
                            </div>
                        </div>
                        <div 
                          onClick={() => setCurrentView(View.CHAT)}
                          className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                             <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Ask the Mentor</h4>
                                <p className="text-sm text-slate-500">Stuck on a concept? The AI Mentor is ready to help.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800">
                        Pinout Reference (Uno)
                    </div>
                    <div className="p-6">
                        <div className="text-sm space-y-2">
                             <div className="flex justify-between p-2 bg-slate-50 rounded">
                                 <span className="font-mono text-slate-600">0 - 1</span>
                                 <span className="text-slate-800 font-medium">Serial RX/TX</span>
                             </div>
                             <div className="flex justify-between p-2 bg-slate-50 rounded">
                                 <span className="font-mono text-slate-600">2 - 13</span>
                                 <span className="text-slate-800 font-medium">Digital I/O (PWM: ~3,5,6,9,10,11)</span>
                             </div>
                             <div className="flex justify-between p-2 bg-slate-50 rounded">
                                 <span className="font-mono text-slate-600">A0 - A5</span>
                                 <span className="text-slate-800 font-medium">Analog Inputs</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
    }
  };

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