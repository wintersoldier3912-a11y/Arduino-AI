
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
            setExplanation("Could not retrieve information at this time. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectGuide = async (project: Project) => {
        setIsLoading(true);
        setSearchTerm(`Ref: ${project.title}`);
        setActiveType('project');
        try {
            const result = await generateProjectReference(project.title, project.components, userProfile.skillLevel);
            setExplanation(result);
        } catch (e) {
            console.error("Failed to generate project guide", e);
            setExplanation("Could not retrieve project guide. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomProjectGuide = async () => {
        if (!customTitle.trim() || !customComponents.trim()) return;
        setIsLoading(true);
        setSearchTerm(`Ref: ${customTitle}`);
        setActiveType('project');
        try {
            const componentsList = customComponents.split(',').map(c => c.trim());
            const result = await generateProjectReference(customTitle, componentsList, userProfile.skillLevel);
            setExplanation(result);
        } catch (e) {
            console.error("Failed to generate custom project guide", e);
            setExplanation("Could not retrieve project guide. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-6xl mx-auto pb-10">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Technical Reference Hub</h2>
                <p className="text-slate-500">On-demand engineering cheat sheets, project documentation, and concept verification.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Search / History Side */}
                <div className="md:w-1/3 space-y-6 flex flex-col">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                            <button
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${researchMode === 'concept' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setResearchMode('concept')}
                            >
                                Concept
                            </button>
                            <button
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${researchMode === 'project' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setResearchMode('project')}
                            >
                                Project Guide
                            </button>
                        </div>

                        {researchMode === 'concept' ? (
                            <>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Research Concept</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleResearch(searchTerm)}
                                        placeholder="e.g. SPI Protocol..."
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
                                    {isLoading && activeType === 'concept' ? 'Researching...' : 'Generate Cheat Sheet'}
                                </button>
                            </>
                        ) : (
                            <>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Custom Project Reference</label>
                                <div className="space-y-3">
                                    <input 
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal outline-none text-sm"
                                        placeholder="Project Title (e.g. Smart Garden)"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                    />
                                    <input 
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal outline-none text-sm"
                                        placeholder="Components (e.g. ESP32, Soil Sensor)"
                                        value={customComponents}
                                        onChange={(e) => setCustomComponents(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className="w-full mt-3 bg-arduino-teal text-white py-2 rounded-lg font-medium hover:bg-arduino-dark transition-colors disabled:opacity-50"
                                    disabled={!customTitle || !customComponents || isLoading}
                                    onClick={handleCustomProjectGuide}
                                >
                                    {isLoading && activeType === 'project' ? 'Generating...' : 'Generate Reference Guide'}
                                </button>
                            </>
                        )}
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

                    <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Example Project Guides</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                             {INITIAL_PROJECTS.map(project => (
                                 <button
                                    key={project.id}
                                    onClick={() => handleProjectGuide(project)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors group flex items-start"
                                 >
                                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-700 group-hover:text-arduino-teal">{project.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{project.components.slice(0, 3).join(', ')}...</div>
                                    </div>
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    {explanation ? (
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                <div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${activeType === 'project' ? 'text-blue-600' : 'text-arduino-teal'}`}>
                                        {activeType === 'project' ? 'Project Documentation' : 'Technical Brief'}
                                    </span>
                                    <h1 className="text-2xl font-bold text-slate-800 mt-1 capitalize">{searchTerm.replace('Ref: ', '')}</h1>
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
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-600">Reference Library</h3>
                            <p className="max-w-md mt-2">Select a project from the left to view its engineering guide, or search for any concept to get an instant cheat sheet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
