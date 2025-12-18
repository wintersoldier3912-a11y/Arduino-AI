
import React, { useState, useRef } from 'react';
import { Dataset } from '../types';

interface KnowledgeBaseProps {
  datasets: Dataset[];
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ datasets, setDatasets }) => {
  const [selectedId, setSelectedId] = useState<string | null>(datasets[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit State
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editContent, setEditContent] = useState('');

  const selectedDataset = datasets.find(d => d.id === selectedId);

  const handleSelect = (id: string) => {
    const ds = datasets.find(d => d.id === id);
    if (ds) {
        setSelectedId(id);
        setEditName(ds.name);
        setEditDesc(ds.description);
        setEditContent(ds.content);
        setIsEditing(false);
    }
  };

  const handleCreateNew = () => {
      const newId = `ds-${Date.now()}`;
      const newDs: Dataset = {
          id: newId,
          name: 'New Knowledge Base',
          description: 'Description of this dataset...',
          content: '// Add technical specifications, datasheet text, or project notes here.',
          updatedAt: Date.now(),
          sourceType: 'manual'
      };
      setDatasets(prev => [...prev, newDs]);
      setSelectedId(newId);
      setEditName(newDs.name);
      setEditDesc(newDs.description);
      setEditContent(newDs.content);
      setIsEditing(true);
  };

  const handleSave = () => {
      if (!selectedId) return;
      setDatasets(prev => prev.map(d => {
          if (d.id === selectedId) {
              return {
                  ...d,
                  name: editName,
                  description: editDesc,
                  content: editContent,
                  updatedAt: Date.now()
              };
          }
          return d;
      }));
      setIsEditing(false);
  };

  const handleDelete = () => {
      if (!selectedId) return;
      if (confirm('Are you sure you want to delete this dataset? This cannot be undone.')) {
          const newDatasets = datasets.filter(d => d.id !== selectedId);
          setDatasets(newDatasets);
          if (newDatasets.length > 0) {
              handleSelect(newDatasets[0].id);
          } else {
              setSelectedId(null);
          }
      }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newId = `ds-${Date.now()}`;
      const newDs: Dataset = {
        id: newId,
        name: file.name,
        description: `Imported from ${file.name}`,
        content: content,
        updatedAt: Date.now(),
        sourceType: 'file'
      };
      setDatasets(prev => [...prev, newDs]);
      setSelectedId(newId);
      setEditName(newDs.name);
      setEditDesc(newDs.description);
      setEditContent(newDs.content);
      setIsEditing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Knowledge Ingestion System</h2>
            <p className="text-slate-500">Inject datasets into the AI for project-specific reasoning.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".txt,.csv,.json,.md,.cpp,.h"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Ingest File
            </button>
            <button 
              onClick={handleCreateNew}
              className="bg-arduino-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-arduino-dark transition-colors flex items-center shadow-sm"
            >
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               New Dataset
            </button>
          </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          <div className="md:w-72 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                  <span>Knowledge Collections</span>
                  <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{datasets.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {datasets.length === 0 && (
                      <div className="text-center p-8 text-slate-400 text-sm italic">
                        No datasets ingested.
                      </div>
                  )}
                  {datasets.map(ds => (
                      <button
                        key={ds.id}
                        onClick={() => handleSelect(ds.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all relative ${
                            selectedId === ds.id 
                            ? 'bg-arduino-light border-arduino-teal text-arduino-dark' 
                            : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                          <div className="font-bold text-sm truncate pr-4">{ds.name}</div>
                          <div className="text-xs opacity-70 truncate mb-1">{ds.description}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] opacity-50 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {new Date(ds.updatedAt).toLocaleDateString()}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border ${
                              ds.sourceType === 'file' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}>
                              {ds.sourceType || 'manual'}
                            </span>
                          </div>
                      </button>
                  ))}
              </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              {selectedDataset ? (
                  <>
                    <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                        <div className="flex-1 mr-4">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full text-xl font-bold bg-white border border-slate-300 rounded px-3 py-1 focus:ring-2 focus:ring-arduino-teal outline-none"
                                        placeholder="Dataset Name"
                                    />
                                    <input 
                                        type="text" 
                                        value={editDesc}
                                        onChange={e => setEditDesc(e.target.value)}
                                        className="w-full text-sm text-slate-600 bg-white border border-slate-300 rounded px-3 py-1 focus:ring-2 focus:ring-arduino-teal outline-none"
                                        placeholder="Brief description"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                      {selectedDataset.name}
                                      {selectedDataset.sourceType === 'file' && (
                                        <svg className="w-4 h-4 ml-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                      )}
                                    </h3>
                                    <p className="text-sm text-slate-500">{selectedDataset.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                             {isEditing ? (
                                 <>
                                    <button 
                                        onClick={() => handleSelect(selectedDataset.id)}
                                        className="px-4 py-2 rounded text-slate-600 hover:bg-slate-200 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-arduino-teal text-white rounded hover:bg-arduino-dark transition-colors text-sm font-bold shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                 </>
                             ) : (
                                 <>
                                    <button 
                                        onClick={handleDelete}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded transition-colors text-sm"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditName(selectedDataset.name);
                                            setEditDesc(selectedDataset.description);
                                            setEditContent(selectedDataset.content);
                                            setIsEditing(true);
                                        }}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-white hover:shadow-sm transition-all text-sm font-medium bg-white"
                                    >
                                        Edit Content
                                    </button>
                                 </>
                             )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col relative">
                        <div className="bg-slate-800 text-slate-300 px-4 py-2 text-[10px] flex justify-between items-center font-mono">
                            <span className="uppercase tracking-widest">Dataset Ingestion Stream</span>
                            <span className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${isEditing ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
                                {isEditing ? 'SYNCING...' : 'LIVE & READY'}
                            </span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="flex-1 w-full p-6 bg-slate-900 text-slate-300 font-mono text-xs resize-none outline-none leading-relaxed"
                                placeholder="Paste or type technical data..."
                                spellCheck={false}
                            />
                        ) : (
                            <div className="flex-1 w-full p-6 bg-white text-slate-600 font-mono text-xs overflow-auto whitespace-pre-wrap border-l-4 border-slate-100">
                                {selectedDataset.content}
                            </div>
                        )}
                    </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 border-2 border-dashed border-slate-200">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">No Knowledge Ingested</h3>
                      <p className="max-w-xs mt-2 text-sm">Create a new dataset or upload a file to give the AI context for your custom Arduino projects.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
