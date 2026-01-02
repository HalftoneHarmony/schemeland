import React from 'react';
import { ArrowLeft, Calendar, BarChart3, Target, Shield, Zap } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Button } from '../ui';
import { IdeaAnalysis, ProjectIdea } from '../../types';

interface AnalysisViewProps {
    analyses: IdeaAnalysis[];
    ideas: ProjectIdea[];
    onBack: () => void;
    onCommit: (id: string) => void;
    isGeneratingPlan: boolean;
    startDate: string;
    onStartDateChange: (date: string) => void;
}

export function AnalysisView({ analyses, ideas, onBack, onCommit, isGeneratingPlan, startDate, onStartDateChange }: AnalysisViewProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-up">
            <div className="mb-16 text-center">
                <button
                    onClick={onBack}
                    className="text-white/20 hover:text-cyber-pink mb-10 inline-flex items-center text-[10px] font-cyber font-black uppercase tracking-[0.3em] transition-all group"
                >
                    <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                    BACK_TO_ARCHIVE::아카이브로_귀환
                </button>

                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="text-cyber-cyan" size={24} />
                        <span className="text-xs font-cyber font-black text-cyber-cyan uppercase tracking-[0.2em]">Diagnostic_Report::진단_보고서</span>
                    </div>
                    <h2 className="text-6xl font-cyber font-black mb-6 text-white uppercase tracking-tighter italic scale-x-105">Analysis_Terminal::분석_터미널</h2>
                    <p className="text-lg font-mono text-white/40 mb-10 uppercase tracking-widest">최적의 실행 경로를 위해 뉴럴 파편을 교차 참조합니다.</p>
                </div>

                <div className="inline-flex flex-col items-center gap-4 p-8 bg-black border-2 border-white/5 relative group overflow-hidden skew-x-[-10deg]">
                    <div className="absolute inset-0 bg-cyber-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="skew-x-[10deg] flex flex-col items-center gap-4">
                        <label className="text-[10px] font-cyber font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Calendar size={16} className="text-cyber-pink" /> 퀘스트_시퀀스_시작_날짜
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="bg-black text-white border-2 border-white/10 px-8 py-3 focus:outline-none focus:border-cyber-pink font-cyber font-black text-sm tracking-widest transition-all cursor-pointer hover:border-white/30"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {analyses.map((analysis, idx) => {
                    const idea = ideas.find(i => i.id === analysis.ideaId);
                    if (!idea) return null;
                    const score = Math.round((analysis.metrics.feasibility + analysis.metrics.marketPotential + analysis.metrics.excitement + analysis.metrics.speedToMVP) / 4);
                    const chartData = [
                        { subject: '실행성', A: analysis.metrics.feasibility, fullMark: 100 },
                        { subject: '시장성', A: analysis.metrics.marketPotential, fullMark: 100 },
                        { subject: '흥미도', A: analysis.metrics.excitement, fullMark: 100 },
                        { subject: '신속성', A: analysis.metrics.speedToMVP, fullMark: 100 },
                    ];

                    const isHighRisk = score < 60;
                    const isLegendary = score >= 85;

                    return (
                        <div key={analysis.ideaId} className="glass-panel border-2 border-white/5 p-0 overflow-hidden flex flex-col hover:border-white/20 transition-all duration-500 group relative skew-x-[-1deg] bg-black" style={{ animationDelay: `${idx * 150}ms` }}>
                            {/* Decorative Corner */}
                            <div className={`absolute top-0 right-0 w-16 h-16 pointer-events-none transition-all duration-500 border-t-4 border-r-4 opacity-40 group-hover:opacity-100 ${isLegendary ? 'border-cyber-yellow' : 'border-cyber-pink'}`} />

                            <div className="skew-x-[1deg] flex-1 flex flex-col">
                                <div className="p-8 bg-white/5 relative border-b border-white/5">
                                    <div className="absolute top-8 right-8 text-5xl opacity-40 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-500">{idea.emoji}</div>

                                    <div className="flex flex-col gap-1 mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-4xl font-cyber font-black tracking-tighter ${isHighRisk ? 'text-red-500' : isLegendary ? 'text-cyber-yellow' : 'text-cyber-pink'}`}>
                                                {score}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-cyber font-black text-white/20 uppercase tracking-widest">Score_Index::점수_지표</span>
                                                <span className="text-[8px] font-mono text-white/40">/ 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-cyber font-black text-white mb-3 uppercase tracking-tight line-clamp-2 h-14 leading-tight">
                                        {idea.title}
                                    </h3>
                                    <p className="text-xs font-mono text-cyber-cyan italic uppercase tracking-wider h-12 line-clamp-2 opacity-60 group-hover:opacity-100">
                                        "{analysis.oneLiner}"
                                    </p>
                                </div>

                                <div className="h-64 w-full bg-black/40 relative border-b border-white/5 p-4">
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Shield size={120} className="text-white/5" />
                                    </div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', fontFamily: 'Orbitron' }} />
                                            <Radar
                                                name={idea.title}
                                                dataKey="A"
                                                stroke={isLegendary ? '#fcee0a' : '#ff00ff'}
                                                fill={isLegendary ? '#fcee0a' : '#ff00ff'}
                                                fillOpacity={0.3}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="p-8 flex-1 flex flex-col bg-black">
                                    <div className="flex-1 mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] font-cyber font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Zap size={14} className="text-cyber-yellow" /> System_Verdict::시스템_판결
                                            </h4>
                                            {isLegendary && (
                                                <div className="px-2 py-0.5 bg-cyber-yellow text-black font-cyber font-black text-[8px] tracking-widest uppercase shadow-neon-yellow">
                                                    LEGENDARY_SPEC::최정예_사양
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white/5 border-l-2 border-cyber-pink p-5 transition-all group-hover:bg-white/10">
                                            <p className="text-xs text-white/70 font-mono leading-relaxed">
                                                {analysis.reasoning}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className={`w-full h-14 font-cyber font-black text-xs uppercase tracking-[0.3em] border-none skew-x-[-10deg] transition-all
                                            ${isLegendary ? 'bg-cyber-yellow text-black shadow-neon-yellow' : 'bg-cyber-pink text-white shadow-neon-pink'}
                                            hover:bg-white hover:text-black hover:shadow-none
                                        `}
                                        onClick={() => onCommit(idea.id)}
                                        isLoading={isGeneratingPlan}
                                        disabled={isGeneratingPlan}
                                    >
                                        <span className="skew-x-[10deg] flex items-center gap-3 justify-center">
                                            INITIALIZE_QUEST::퀘스트_시작
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
