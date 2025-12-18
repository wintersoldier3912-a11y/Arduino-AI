
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Mission Control', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: View.CHAT, label: 'Arduino Fleet Mentor', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: View.PROJECTS, label: 'Sketch Library', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: View.COMPONENTS, label: 'Arduino Inventory', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { id: View.CODE_EDITOR, label: 'Sketch Laboratory', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: View.CIRCUIT_ANALYZER, label: 'Pin Monitor', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: View.VISION, label: 'Visual Hardware AI', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { id: View.KNOWLEDGE_BASE, label: 'Datasheet Nexus', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  ];

  return (
    <aside className="w-64 bg-[#0B0E14] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-10 hidden md:flex">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
        <div className="w-9 h-9 rounded-xl bg-arduino-teal flex items-center justify-center font-black text-white shadow-lg shadow-arduino-teal/20">
          A
        </div>
        <div>
           <h1 className="text-sm font-black tracking-tighter text-white uppercase leading-none">Arduino Fleet</h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Mentor v2.5</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-arduino-teal text-white shadow-xl shadow-arduino-teal/10'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <svg className={`w-4 h-4 transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="text-xs font-black uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800/50">
        <div className="bg-slate-900/50 p-3 rounded-xl flex items-center space-x-3 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-arduino-orange to-arduino-yellow flex items-center justify-center text-xs font-black">
            M
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-wider">Arduino Lead</p>
            <div className="flex items-center mt-0.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Ready</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
