
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateQuiz } from '../services/geminiService';

interface LearningPathProps {
    userProfile: UserProfile;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

const LearningPath: React.FC<LearningPathProps> = ({ userProfile }) => {
    const [modules] = useState([
        { id: 1, title: 'Electronics Basics', status: 'completed', topics: ['Voltage & Current', 'Resistors', 'Breadboards'] },
        { id: 2, title: 'Arduino C++ Fundamentals', status: 'completed', topics: ['Variables', 'Loops', 'Functions'] },
        { id: 3, title: 'Digital I/O', status: 'in-progress', topics: ['LEDs', 'Buttons', 'Debouncing'] },
        { id: 4, title: 'Analog Signals', status: 'locked', topics: ['Potentiometers', 'PWM', 'Light Sensors'] },
        { id: 5, title: 'Serial Communication', status: 'locked', topics: ['UART', 'Debugging', 'Data Parsing'] },
    ]);

    // Quiz State
    const [activeQuizModule, setActiveQuizModule] = useState<number | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const handleStartQuiz = async (moduleId: number, topic: string) => {
        setActiveQuizModule(moduleId);
        setIsQuizLoading(true);
        setQuizSubmitted(false);
        setUserAnswers([]);
        try {
            const result = await generateQuiz(topic, userProfile.skillLevel);
            const parsed = JSON.parse(result);
            setQuizQuestions(parsed);
            setUserAnswers(new Array(parsed.length).fill(-1));
        } catch (e) {
            console.error("Failed to generate quiz", e);
            setActiveQuizModule(null); // Close on error
        } finally {
            setIsQuizLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
        if (quizSubmitted) return;
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const handleSubmitQuiz = () => {
        setQuizSubmitted(true);
    };

    const calculateScore = () => {
        return userAnswers.reduce((acc, ans, idx) => {
            return acc + (ans === quizQuestions[idx].correctAnswerIndex ? 1 : 0);
        }, 0);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Your Learning Path</h2>
                <p className="text-slate-500">Master Embedded Systems one step at a time. Take AI quizzes to test your knowledge.</p>
            </div>

            <div className="relative border-l-4 border-slate-200 ml-6 space-y-10 py-4">
                {modules.map((module) => (
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
                                {module.status !== 'locked' && activeQuizModule !== module.id && (
                                    <button 
                                        onClick={() => handleStartQuiz(module.id, module.title)}
                                        className="text-sm px-3 py-1 bg-slate-100 hover:bg-arduino-light text-arduino-dark rounded font-medium transition-colors flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Take AI Quiz
                                    </button>
                                )}
                            </div>
                            
                            <ul className="space-y-2 mb-4">
                                {module.topics.map(topic => (
                                    <li key={topic} className="flex items-center text-sm text-slate-600">
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>

                            {/* Quiz Interface */}
                            {activeQuizModule === module.id && (
                                <div className="mt-6 border-t border-slate-100 pt-6 animate-fadeIn">
                                    {isQuizLoading ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                                            <svg className="animate-spin h-8 w-8 text-arduino-teal mb-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p>Generating personalized quiz based on your skill level...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-arduino-dark">Module Quiz</h4>
                                                <button onClick={() => setActiveQuizModule(null)} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
                                            </div>
                                            
                                            {quizQuestions.map((q, qIdx) => (
                                                <div key={qIdx} className="bg-slate-50 p-4 rounded-lg">
                                                    <p className="font-medium text-slate-800 mb-3">{qIdx + 1}. {q.question}</p>
                                                    <div className="space-y-2">
                                                        {q.options.map((opt, oIdx) => {
                                                            const isSelected = userAnswers[qIdx] === oIdx;
                                                            const isCorrect = q.correctAnswerIndex === oIdx;
                                                            let btnClass = "w-full text-left px-4 py-2 rounded text-sm transition-all border ";
                                                            
                                                            if (quizSubmitted) {
                                                                if (isCorrect) btnClass += "bg-green-100 border-green-300 text-green-800 font-bold";
                                                                else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-200 text-red-700";
                                                                else btnClass += "bg-white border-slate-200 text-slate-500 opacity-60";
                                                            } else {
                                                                if (isSelected) btnClass += "bg-arduino-light border-arduino-teal text-arduino-dark font-medium";
                                                                else btnClass += "bg-white border-slate-200 text-slate-600 hover:border-arduino-teal hover:bg-slate-50";
                                                            }

                                                            return (
                                                                <button 
                                                                    key={oIdx}
                                                                    onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                                                    disabled={quizSubmitted}
                                                                    className={btnClass}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {quizSubmitted && (
                                                        <div className="mt-3 text-xs p-2 bg-white rounded border border-slate-200 text-slate-600">
                                                            <strong className="text-slate-800">Explanation: </strong>
                                                            {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {!quizSubmitted ? (
                                                <button 
                                                    onClick={handleSubmitQuiz}
                                                    disabled={userAnswers.includes(-1)}
                                                    className="w-full py-3 bg-arduino-teal text-white rounded font-bold hover:bg-arduino-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Submit Answers
                                                </button>
                                            ) : (
                                                <div className="bg-white border-2 border-arduino-teal p-4 rounded-lg text-center">
                                                    <p className="text-lg font-bold text-slate-800 mb-1">
                                                        You scored {calculateScore()} / {quizQuestions.length}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mb-3">
                                                        {calculateScore() === quizQuestions.length 
                                                            ? "Perfect score! You've mastered this module." 
                                                            : "Good effort! Review the explanations to strengthen your understanding."}
                                                    </p>
                                                    <button 
                                                        onClick={() => setActiveQuizModule(null)}
                                                        className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm font-medium"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningPath;
