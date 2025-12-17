
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateConceptExplanation } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface LearningPathProps {
    userProfile: UserProfile;
}

const LearningPath: React.FC<LearningPathProps> = ({ userProfile }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(['I2C Communication', 'Pull-up Resistor', 'Debouncing', 'PWM', 'H-Bridge']);

    const handleResearch = async (term: string) => {
        if (!term.trim()) return;
        setIsLoading(true);
        setSearchTerm(term);
        try {
            const result = await generateConceptExplanation(term, userProfile.skillLevel);
            setExplanation(result);
            // Add to recent if not exists
            if (!recentSearches.includes(term)) {
                setRecentSearches(prev => [term, ...prev].slice(0, 8));
            }
        } catch (e) {
            console.error("Failed to research concept", e);
            setExplanation("Could not retrieve information at this time. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto pb-10">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Technical Reference Hub</h2>
                <p className="text-slate-500">On-demand engineering cheat sheets and concept verification.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Search / History Side */}
                <div className="md:w-1/3 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Research Topic</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleResearch(searchTerm)}
                                placeholder="e.g. SPI Protocol, Volatile Keyword..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal outline-none"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button 
                            onClick={() => handleResearch(searchTerm)}
                            disabled={!searchTerm.trim() || isLoading}
                            className="w-full mt-3 bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Researching...' : 'Generate Cheat Sheet'}
                        </button>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Lookups</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => handleResearch(term)}
                                    className="px-3 py-1 bg-slate-100 hover:bg-arduino-light text-slate-600 hover:text-arduino-teal rounded-full text-sm transition-colors border border-slate-200"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {explanation ? (
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                <div>
                                    <span className="text-xs font-bold text-arduino-teal uppercase tracking-widest">Technical Brief</span>
                                    <h1 className="text-2xl font-bold text-slate-800 mt-1 capitalize">{searchTerm}</h1>
                                </div>
                                <button 
                                    onClick={() => setExplanation(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <MarkdownRenderer content={explanation} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-600">Reference Library</h3>
                            <p className="max-w-md mt-2">Search for any Arduino component, protocol, or C++ concept to get an instant, engineering-grade explanation tailored to your skill level.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
