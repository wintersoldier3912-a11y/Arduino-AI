import React from 'react';

const LearningPath: React.FC = () => {
    const modules = [
        { id: 1, title: 'Electronics Basics', status: 'completed', topics: ['Voltage & Current', 'Resistors', 'Breadboards'] },
        { id: 2, title: 'Arduino C++ Fundamentals', status: 'completed', topics: ['Variables', 'Loops', 'Functions'] },
        { id: 3, title: 'Digital I/O', status: 'in-progress', topics: ['LEDs', 'Buttons', 'Debouncing'] },
        { id: 4, title: 'Analog Signals', status: 'locked', topics: ['Potentiometers', 'PWM', 'Light Sensors'] },
        { id: 5, title: 'Serial Communication', status: 'locked', topics: ['UART', 'Debugging', 'Data Parsing'] },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Your Learning Path</h2>
                <p className="text-slate-500">Master Embedded Systems one step at a time</p>
            </div>

            <div className="relative border-l-4 border-slate-200 ml-6 space-y-10 py-4">
                {modules.map((module, index) => (
                    <div key={module.id} className="relative pl-10">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center bg-white ${
                            module.status === 'completed' ? 'border-arduino-teal' :
                            module.status === 'in-progress' ? 'border-arduino-orange' : 'border-slate-300'
                        }`}>
                             {module.status === 'completed' && <div className="w-2 h-2 bg-arduino-teal rounded-full" />}
                             {module.status === 'in-progress' && <div className="w-2 h-2 bg-arduino-orange rounded-full animate-pulse" />}
                        </div>

                        {/* Content Card */}
                        <div className={`bg-white rounded-lg border p-6 transition-all ${
                            module.status === 'locked' ? 'opacity-60 border-slate-200' : 'shadow-sm border-slate-200 hover:shadow-md'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase ${
                                        module.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        module.status === 'in-progress' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {module.status}
                                    </span>
                                </div>
                                {module.status === 'completed' && (
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {module.status === 'locked' && (
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </div>
                            
                            <ul className="space-y-2">
                                {module.topics.map(topic => (
                                    <li key={topic} className="flex items-center text-sm text-slate-600">
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>

                            {module.status === 'in-progress' && (
                                <button className="mt-4 w-full py-2 bg-arduino-teal text-white rounded font-medium hover:bg-arduino-dark transition-colors">
                                    Continue Learning
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningPath;