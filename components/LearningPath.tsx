
import React, { useState } from 'react';
import { UserProfile, Project } from '../types';
import { INITIAL_PROJECTS } from '../constants';
import { generateConceptExplanation, generateProjectReference } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface LearningPathProps {
    userProfile: UserProfile;
}

const LearningPath: React.FC<LearningPathProps> = ({ userProfile }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(['I2C Communication', 'Pull-up Resistor', 'Debouncing', 'PWM', 'H-Bridge']);
    const [activeType, setActiveType] = useState<'concept' | 'project'>('concept');

    // State for Custom Project Guide
    const [researchMode, setResearchMode] = useState<'concept' | 'project'>('concept');
    const [customTitle, setCustomTitle] = useState('');
    const [customComponents, setCustomComponents] = useState('');

    const handleResearch = async (term: string) => {
        if (!term.trim()) return;
        setIsLoading(true);
        setSearchTerm(term);
        setActiveType('concept');
        try {
            const result = await generateConceptExplanation(term, userProfile.skillLevel);
            setExplanation(result);
            // Add to recent if not exists
            if (!recentSearches.includes(term)) {
                setRecentSearches(prev => [term, ...prev].slice(0, 8));
            }
        } catch (e) {
            console.error("Failed to research concept", e);
            setExplanation("Could not retrieve information at this time. The Specialist Agents are offline.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectGuide = async (project: Project) => {
        setIsLoading(true);
        setSearchTerm(`Documentation: ${project.title}`);
        setActiveType('project');
        try {
            const result = await generateProjectReference(project.title, project.components, userProfile.skillLevel);
            setExplanation(result);
        } catch (e) {
            console.error("Failed to generate project guide", e);
            setExplanation("Could not retrieve project guide. The Documentation Agent reported a sync error.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomProjectGuide = async () => {
        if (!customTitle.trim() || !customComponents.trim()) return;
        setIsLoading(true);
        setSearchTerm(`Documentation: ${customTitle}`);
        setActiveType('project');
        try {
            const componentsList = customComponents.split(',').map(c => c.trim());
            const result = await generateProjectReference(customTitle, componentsList, userProfile.skillLevel);
            setExplanation(result);
        } catch (e) {
            console.error("Failed to generate custom project guide", e);
            setExplanation("Could not generate the custom documentation. Please verify component naming.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-6xl mx-auto pb-10">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Reference Hub</h2>
                <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs font-black text-arduino-teal uppercase tracking-widest">Doc Agent Active</span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <p className="text-sm text-slate-500 font-medium">Generate on-demand engineering cheat sheets and build documentation.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Search / Context Side */}
                <div className="lg:w-80 space-y-6 flex flex-col">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-5 shadow-inner">
                            <button
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${researchMode === 'concept' ? 'bg-white shadow-md text-slate-900 border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setResearchMode('concept')}
                            >
                                Concepts
                            </button>
                            <button
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${researchMode === 'project' ? 'bg-white shadow-md text-slate-900 border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setResearchMode('project')}
                            >
                                Projects
                            </button>
                        </div>

                        {researchMode === 'concept' ? (
                            <div className="animate-fadeIn">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Research Topic</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleResearch(searchTerm)}
                                        placeholder="e.g. SPI Protocol..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arduino-teal focus:bg-white outline-none transition-all text-sm font-medium"
                                    />
                                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-arduino-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button 
                                    onClick={() => handleResearch(searchTerm)}
                                    disabled={!searchTerm.trim() || isLoading}
                                    className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
                                >
                                    {isLoading && activeType === 'concept' ? 'Syncing...' : 'Request Cheat Sheet'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fadeIn">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Custom Doc Parameters</label>
                                <div className="space-y-3">
                                    <input 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arduino-teal focus:bg-white outline-none text-sm font-medium transition-all"
                                        placeholder="Project Title (e.g. Smart Garden)"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                    />
                                    <textarea 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arduino-teal focus:bg-white outline-none text-sm font-medium h-24 resize-none transition-all"
                                        placeholder="BOM / Components (e.g. ESP32, Soil Moisture Sensor, 5V Relay)"
                                        value={customComponents}
                                        onChange={(e) => setCustomComponents(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className="w-full bg-arduino-teal text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-arduino-dark transition-all disabled:opacity-50 shadow-lg shadow-arduino-teal/10"
                                    disabled={!customTitle || !customComponents || isLoading}
                                    onClick={handleCustomProjectGuide}
                                >
                                    {isLoading && activeType === 'project' ? 'Drafting...' : 'Generate Full Guide'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fast Lookups</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => handleResearch(term)}
                                    className="px-3 py-1.5 bg-slate-50 hover:bg-arduino-light text-slate-600 hover:text-arduino-teal rounded-lg text-xs font-bold transition-all border border-slate-200 hover:border-arduino-teal/50"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                             <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Template Library</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                             {INITIAL_PROJECTS.map(project => (
                                 <button
                                    key={project.id}
                                    onClick={() => handleProjectGuide(project)}
                                    className="w-full text-left px-4 py-3 hover:bg-arduino-light/30 rounded-xl transition-all group flex items-start border border-transparent hover:border-arduino-teal/20"
                                 >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-arduino-teal group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-black text-[11px] text-slate-700 group-hover:text-arduino-teal uppercase tracking-tight truncate">{project.title}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 truncate">{project.components.slice(0, 2).join(', ')}...</div>
                                    </div>
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[600px] border-t-4 border-t-arduino-teal">
                    {explanation ? (
                        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20 scrollbar-thin">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${activeType === 'project' ? 'bg-blue-100 text-blue-700' : 'bg-arduino-light text-arduino-teal'}`}>
                                            {activeType === 'project' ? 'Reference Guide' : 'Technical Brief'}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-bold">LEVEL: {userProfile.skillLevel.toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{searchTerm.replace('Documentation: ', '')}</h1>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => window.print()}
                                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                        title="Print Guide"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => setExplanation(null)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Close"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="max-w-none">
                                <MarkdownRenderer content={explanation} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                                <svg className="w-12 h-12 text-arduino-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Engineering Library</h3>
                            <p className="max-w-md mt-3 text-slate-500 font-medium text-sm leading-relaxed">
                                Select a project template or use the custom documentation tool to generate high-fidelity technical specs for your build.
                            </p>
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
                                    <div className="text-arduino-teal font-black text-[10px] uppercase mb-1">Concept Mode</div>
                                    <p className="text-[11px] text-slate-500 font-bold leading-tight">Instant cheat sheets for protocols, electrical math, or library usage.</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
                                    <div className="text-blue-600 font-black text-[10px] uppercase mb-1">Project Mode</div>
                                    <p className="text-[11px] text-slate-500 font-bold leading-tight">Complete wiring maps and logic flows for custom system architectures.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
