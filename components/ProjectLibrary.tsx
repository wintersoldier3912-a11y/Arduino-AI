
import React, { useState } from 'react';
import { Project, Difficulty, UserProfile, Dataset } from '../types';
import { INITIAL_PROJECTS } from '../constants';
import { generateCustomProject } from '../services/geminiService';

interface ProjectLibraryProps {
    onStartProject: (project: Project) => void;
    userProfile: UserProfile;
    datasets: Dataset[];
}

const ProjectLibrary: React.FC<ProjectLibraryProps> = ({ onStartProject, userProfile, datasets }) => {
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [ideaInput, setIdeaInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.difficulty === filter);

  const getDifficultyColor = (diff: Difficulty) => {
      switch(diff) {
          case Difficulty.BEGINNER: return 'bg-green-100 text-green-700';
          case Difficulty.INTERMEDIATE: return 'bg-yellow-100 text-yellow-800';
          case Difficulty.ADVANCED: return 'bg-orange-100 text-orange-800';
          case Difficulty.EXPERT: return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const toggleExpand = (id: string) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  const handleLinkDataset = (projectId: string, datasetId: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id === projectId) return { ...p, knowledgeBaseId: datasetId };
        return p;
    }));
  };

  const handleGenerateProject = async () => {
    if (!ideaInput.trim()) return;
    setIsGenerating(true);
    try {
        const result = await generateCustomProject(ideaInput, userProfile.skillLevel);
        const newProject: Project = JSON.parse(result);
        if (!newProject.id) newProject.id = `custom-${Date.now()}`;
        setProjects(prev => [newProject, ...prev]);
        setExpandedProjectId(newProject.id);
        setShowGenerator(false);
        setIdeaInput('');
    } catch (e) {
        console.error("Failed to generate project", e);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Project Library</h2>
            <p className="text-slate-500">Curated and AI-generated builds with optional knowledge linkage.</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => setShowGenerator(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-all flex items-center shadow-sm"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Design Custom Build
            </button>
            <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                {['All', ...Object.values(Difficulty)].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            filter === f 
                            ? 'bg-arduino-teal text-white shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {showGenerator && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">Generate Custom Project</h3>
                      <p className="text-purple-100 text-sm">Describe what you want to build, and AI will design it.</p>
                  </div>
                  <div className="p-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Project Idea</label>
                      <textarea 
                          value={ideaInput}
                          onChange={(e) => setIdeaInput(e.target.value)}
                          placeholder="e.g. A plant watering system that tweets when thirsty..."
                          className="w-full p-4 border border-slate-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <div className="flex gap-3 mt-6">
                          <button 
                            onClick={() => setShowGenerator(false)}
                            className="flex-1 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                            onClick={handleGenerateProject}
                            disabled={!ideaInput.trim() || isGenerating}
                            className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                              {isGenerating ? 'Designing...' : 'Generate Project'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const linkedDataset = datasets.find(d => d.id === project.knowledgeBaseId);
          
          return (
            <div 
                key={project.id} 
                onClick={() => toggleExpand(project.id)}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 flex flex-col cursor-pointer ${
                    isExpanded 
                    ? 'border-arduino-teal ring-1 ring-arduino-teal shadow-md' 
                    : 'border-slate-200 hover:shadow-md'
                }`}
            >
              <div className="h-40 bg-slate-100 rounded-t-xl relative overflow-hidden group flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                      project.id.startsWith('custom') 
                      ? 'from-purple-100 to-indigo-100' 
                      : 'from-slate-100 to-slate-200'
                  }`}></div>
                  
                  {project.id.startsWith('custom') ? (
                       <div className="w-full h-full flex items-center justify-center relative z-10">
                           <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       </div>
                  ) : (
                      <img 
                          src={`https://picsum.photos/seed/${project.id}/400/200`} 
                          alt={project.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity relative z-10"
                      />
                  )}
                  
                  <div className="absolute top-3 right-3 z-20">
                      <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                      </span>
                  </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{project.title}</h3>
                    <p className={`text-sm text-slate-600 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {project.description}
                    </p>
                    
                    {isExpanded && (
                        <div className="mb-4 pt-4 border-t border-slate-100 animate-fadeIn space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Knowledge Context</h4>
                                <div className="flex gap-2 items-center">
                                    <select 
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded text-xs p-1 outline-none"
                                        value={project.knowledgeBaseId || ''}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleLinkDataset(project.id, e.target.value)}
                                    >
                                        <option value="">No Dataset Linked</option>
                                        {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                    {linkedDataset && (
                                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live context ready"></span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Components</h4>
                                <ul className="space-y-1">
                                    {project.components.map((component, idx) => (
                                        <li key={idx} className="text-sm text-slate-700 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-arduino-teal rounded-full mr-2"></span>
                                            {component}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`pt-4 border-t border-slate-100 flex items-center ${isExpanded ? 'justify-end' : 'justify-between'} mt-auto`}>
                    {!isExpanded && (
                        <div className="flex items-center text-slate-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {project.timeEstimate}
                        </div>
                    )}
                    
                    <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onStartProject(project);
                      }}
                      className={`text-sm font-medium flex items-center group transition-colors ${
                          isExpanded 
                          ? 'bg-arduino-teal text-white px-4 py-2 rounded-lg hover:bg-arduino-dark shadow-sm'
                          : 'text-arduino-teal hover:text-arduino-dark'
                      }`}
                    >
                        Start Build
                        <svg className={`w-4 h-4 ml-1 ${isExpanded ? '' : 'transform group-hover:translate-x-1 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectLibrary;
