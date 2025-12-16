import React, { useState, useEffect } from 'react';
import { Component, UserProfile, Difficulty } from '../types';
import { MOCK_COMPONENTS } from '../constants';
import { generateComponentRecommendation } from '../services/geminiService';

interface ComponentDatabaseProps {
  userProfile: UserProfile;
  onAskAI: (initialMessage: string) => void;
}

const ComponentDatabase: React.FC<ComponentDatabaseProps> = ({ userProfile, onAskAI }) => {
  // Initialize state from localStorage to persist user preferences
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('arduino_db_search') || '');
  const [filterType, setFilterType] = useState<string>(() => localStorage.getItem('arduino_db_type') || 'All');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>(
    () => (localStorage.getItem('arduino_db_difficulty') as Difficulty | 'All') || 'All'
  );
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);

  // Persist filters when they change
  useEffect(() => {
    localStorage.setItem('arduino_db_search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('arduino_db_type', filterType);
  }, [filterType]);

  useEffect(() => {
    localStorage.setItem('arduino_db_difficulty', filterDifficulty);
  }, [filterDifficulty]);

  const filteredComponents = MOCK_COMPONENTS.filter(comp => {
    const lowerTerm = searchTerm.toLowerCase();
    const matchesSearch = comp.name.toLowerCase().includes(lowerTerm) || 
                          comp.description.toLowerCase().includes(lowerTerm) ||
                          comp.commonUses.some(use => use.toLowerCase().includes(lowerTerm));
    const matchesType = filterType === 'All' || comp.type === filterType;
    const matchesDifficulty = filterDifficulty === 'All' || comp.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const uniqueTypes = ['All', ...Array.from(new Set(MOCK_COMPONENTS.map(c => c.type)))];
  const uniqueDifficulties = ['All', ...Object.values(Difficulty)];

  const handleGetRecommendations = async () => {
    if (!searchTerm) return;
    setIsRecommending(true);
    try {
        const result = await generateComponentRecommendation(searchTerm, userProfile.skillLevel);
        const parsed = JSON.parse(result);
        setRecommendations(parsed);
    } catch (e) {
        console.error("Failed to get recommendations", e);
    } finally {
        setIsRecommending(false);
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
        case Difficulty.BEGINNER: return 'bg-green-100 text-green-700';
        case Difficulty.INTERMEDIATE: return 'bg-yellow-100 text-yellow-800';
        case Difficulty.ADVANCED: return 'bg-orange-100 text-orange-800';
        case Difficulty.EXPERT: return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Component Database</h2>
          <p className="text-slate-500">Explore parts, pinouts, and datasheets.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => onAskAI(`I need help choosing a component for...`)}
                className="bg-arduino-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
                Ask Mentor for Help
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <input 
                    type="text"
                    aria-label="Filter components by name or description"
                    placeholder="Filter by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal focus:border-transparent outline-none transition-shadow"
                    onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-arduino-teal outline-none flex-1 md:flex-none cursor-pointer"
                  title="Filter by Type"
              >
                  {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select 
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'All')}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-arduino-teal outline-none flex-1 md:flex-none cursor-pointer"
                  title="Filter by Difficulty"
              >
                  {uniqueDifficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <button
                onClick={handleGetRecommendations}
                disabled={!searchTerm || isRecommending}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap hidden md:block"
            >
                {isRecommending ? 'Thinking...' : 'AI Suggest'}
            </button>
        </div>
        
        {/* Mobile AI Suggest Button */}
        <div className="md:hidden">
            <button
                onClick={handleGetRecommendations}
                disabled={!searchTerm || isRecommending}
                className="w-full px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
                {isRecommending ? 'Thinking...' : 'AI Suggest'}
            </button>
        </div>

        {/* AI Recommendations Area */}
        {recommendations.length > 0 && (
            <div className="bg-arduino-light/30 border border-arduino-teal/20 rounded-lg p-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-arduino-dark flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Suggestions for "{searchTerm}"
                    </h3>
                    <button onClick={() => setRecommendations([])} className="text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-slate-200 text-sm hover:border-arduino-teal/50 transition-colors">
                            <div className="font-bold text-slate-800">{rec.name}</div>
                            <div className="text-xs text-slate-500 mb-2">{rec.type} • {rec.approximatePrice || 'N/A'}</div>
                            <p className="text-slate-600 text-xs line-clamp-2">{rec.reasonForRecommendation}</p>
                            <button 
                                onClick={() => onAskAI(`Tell me how to use the ${rec.name} with Arduino.`)}
                                className="mt-2 text-arduino-teal text-xs font-medium hover:underline flex items-center"
                            >
                                Learn more
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map(comp => (
            <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-2 bg-gradient-to-r from-arduino-teal to-arduino-dark"></div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-arduino-teal transition-colors">{comp.name}</h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">{comp.type}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${getDifficultyColor(comp.difficulty)}`}>{comp.difficulty}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{comp.description}</p>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center text-slate-700">
                            <span className="w-4 h-4 mr-2 text-arduino-orange" title="Voltage">⚡</span>
                            <span className="font-mono text-xs">{comp.voltage}</span>
                        </div>
                        <div className="flex items-center text-slate-700">
                            <span className="w-4 h-4 mr-2 text-arduino-teal" title="Pins">#</span>
                            <span className="font-mono text-xs truncate" title={comp.pins}>{comp.pins}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1">
                        {comp.commonUses.slice(0, 3).map(use => {
                            // Highlight matched keywords if they match the search term
                            const isMatch = searchTerm && use.toLowerCase().includes(searchTerm.toLowerCase());
                            return (
                                <span key={use} className={`text-xs px-2 py-0.5 rounded transition-colors ${
                                    isMatch ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-slate-50 text-slate-500'
                                }`}>
                                    {use}
                                </span>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={() => onAskAI(`Can you give me the pinout and a code example for the ${comp.name}?`)}
                            className="flex-1 bg-slate-50 text-slate-700 py-2 rounded text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            Pinout & Code
                        </button>
                    </div>
                </div>
            </div>
        ))}
        {filteredComponents.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p>No components found matching your criteria.</p>
                {searchTerm && (
                    <button 
                        onClick={handleGetRecommendations}
                        className="mt-2 text-arduino-teal hover:underline font-medium"
                    >
                        Ask AI to suggest compatible parts?
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDatabase;