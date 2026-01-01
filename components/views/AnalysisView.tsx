import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Button } from '../Button';
import { IdeaAnalysis, ProjectIdea } from '../../types';

interface AnalysisViewProps {
    analyses: IdeaAnalysis[];
    ideas: ProjectIdea[];
    onBack: () => void;
    onCommit: (id: string) => void;
    isGeneratingPlan: boolean;
}

export function AnalysisView({ analyses, ideas, onBack, onCommit, isGeneratingPlan }: AnalysisViewProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
            <div className="mb-12 text-center">
                <button onClick={onBack} className="text-zinc-500 hover:text-white mb-6 inline-flex items-center text-sm font-bold uppercase tracking-wide">
                    <ArrowLeft size={16} className="mr-2" /> Edit Ideas
                </button>
                <h2 className="text-4xl font-black mb-4">ANALYSIS REPORT</h2>
                <p className="text-xl text-textMuted">Choose your character class wisely.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {analyses.map((analysis, idx) => {
                    const idea = ideas.find(i => i.id === analysis.ideaId);
                    if (!idea) return null;
                    const score = Math.round((analysis.metrics.feasibility + analysis.metrics.marketPotential + analysis.metrics.excitement + analysis.metrics.speedToMVP) / 4);
                    const chartData = [
                        { subject: 'Feasibility', A: analysis.metrics.feasibility, fullMark: 100 },
                        { subject: 'Market', A: analysis.metrics.marketPotential, fullMark: 100 },
                        { subject: 'Fun', A: analysis.metrics.excitement, fullMark: 100 },
                        { subject: 'Speed', A: analysis.metrics.speedToMVP, fullMark: 100 },
                    ];

                    return (
                        <div key={analysis.ideaId} className="glass-panel rounded-2xl p-0 overflow-hidden flex flex-col hover:border-primary transition-all duration-300 group" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="p-6 bg-gradient-to-b from-zinc-800/50 to-transparent relative">
                                <div className="absolute top-4 right-4 text-4xl">{idea.emoji}</div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`text-2xl font-black ${score >= 80 ? 'text-accent text-glow-accent' : 'text-primary text-glow'}`}>
                                        {score} <span className="text-sm text-zinc-500 font-normal">/ 100</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight h-16 line-clamp-2">{idea.title}</h3>
                                <p className="text-sm text-zinc-400 italic font-medium h-10 line-clamp-2">"{analysis.oneLiner}"</p>
                            </div>

                            <div className="h-48 w-full bg-zinc-900/30 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                                        <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar name={idea.title} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Coach's Verdict</h4>
                                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        {analysis.reasoning}
                                    </p>
                                </div>
                                <Button
                                    className="w-full mt-6 h-12 font-bold text-lg shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]"
                                    onClick={() => onCommit(idea.id)}
                                    isLoading={isGeneratingPlan}
                                    disabled={isGeneratingPlan}
                                >
                                    SELECT QUEST
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
