import React, { useState } from 'react';
import { Project, Difficulty } from '../types';
import { INITIAL_PROJECTS } from '../constants';

interface ProjectLibraryProps {
    onStartProject: (project: Project) => void;
}

const ProjectLibrary: React.FC<ProjectLibraryProps> = ({ onStartProject }) => {
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Project Library</h2>
            <p className="text-slate-500">Hands-on projects curated for your learning journey</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {['All', ...Object.values(Difficulty)].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          
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
                  <img 
                      src={`https://picsum.photos/seed/${project.id}/400/200`} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(project.difficulty)}`}>
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
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                        <div className="mb-4 pt-4 border-t border-slate-100 animate-fadeIn space-y-4">
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
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time Estimate</h4>
                                <div className="text-sm text-slate-700 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {project.timeEstimate}
                                </div>
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
                        Start Project
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