import React from 'react';
import { ArrowLeft, Wand2, Lightbulb, Plus, Sparkles, Database, Cpu } from 'lucide-react';
import { Button } from '../Button';
import { IdeaCard } from '../IdeaCard';
import { ProjectIdea } from '../../types';

interface BrainDumpViewProps {
    ideas: ProjectIdea[];
    onBack: () => void;
    onSuggestion: () => void;
    isSuggesting: boolean;
    onAddIdea: () => void;
    onUpdateIdea: (id: string, field: keyof ProjectIdea, value: string) => void;
    onDeleteIdea: (id: string) => void;
    onMagic: (id: string) => void;
    isRefiningMap: Record<string, boolean>;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function BrainDumpView({
    ideas,
    onBack,
    onSuggestion,
    isSuggesting,
    onAddIdea,
    onUpdateIdea,
    onDeleteIdea,
    onMagic,
    isRefiningMap,
    onAnalyze,
    isAnalyzing
}: BrainDumpViewProps) {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-slide-up">
            <div className="mb-16">
                <button
                    onClick={onBack}
                    className="text-white/20 hover:text-cyber-pink mb-8 flex items-center text-[10px] font-cyber font-black tracking-[0.2em] uppercase transition-all group"
                >
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    RETURN_TO_CORE::코어로_귀환
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-cyber-pink pl-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="text-cyber-pink" size={20} />
                            <span className="text-xs font-cyber font-black text-cyber-pink uppercase tracking-widest">Input_Buffer::입력_버퍼</span>
                        </div>
                        <h2 className="text-5xl font-cyber font-black mb-4 text-white uppercase tracking-tighter italic">Brain_Archive::브레인_아카이브</h2>
                        <p className="text-white/40 max-w-xl font-mono text-sm leading-relaxed">
                            여기에 당신의 원시 시냅스 데이터를 덤프하세요.
                            <span className="text-cyber-cyan font-bold mx-2 inline-flex items-center gap-1 border-b border-cyber-cyan/30">
                                <Cpu size={14} /> REFINER.EXE
                            </span>
                            를 사용하여 이 뉴럴 파편들을 실행 가능한 계획으로 안정화합니다.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onSuggestion}
                        isLoading={isSuggesting}
                        className="shrink-0 h-14 px-8 border-2 border-cyber-yellow/20 text-cyber-yellow hover:border-cyber-yellow hover:bg-cyber-yellow/10 transition-all font-cyber font-black text-xs tracking-[0.2em] skew-x-[-10deg]"
                    >
                        <span className="skew-x-[10deg] flex items-center gap-3">
                            <Lightbulb size={20} /> SYNC_INSPIRATION::영감_동기화
                        </span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-12">
                {ideas.map((idea, idx) => (
                    <div
                        key={idea.id}
                        style={{ animationDelay: `${idx * 150}ms` }}
                        className="animate-slide-up"
                    >
                        <IdeaCard
                            idea={idea}
                            onChange={onUpdateIdea}
                            onDelete={onDeleteIdea}
                            onMagic={onMagic}
                            isMagicLoading={isRefiningMap[idea.id]}
                        />
                    </div>
                ))}
            </div>

            <div className="sticky bottom-10 z-30 flex gap-6 backdrop-blur-3xl p-6 rounded-none border-2 border-white/5 bg-black/80 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] skew-x-[-2deg]">
                <div className="skew-x-[2deg] flex gap-6 w-full">
                    <Button
                        variant="ghost"
                        onClick={onAddIdea}
                        className="flex-1 h-16 border-2 border-white/10 hover:border-white/30 text-white font-cyber font-black tracking-widest text-xs"
                    >
                        <Plus className="mr-3" size={24} /> NEW_DATA_SLOT::새_데이터_슬롯
                    </Button>
                    <Button
                        onClick={onAnalyze}
                        isLoading={isAnalyzing}
                        disabled={isAnalyzing}
                        className="flex-[2] h-16 bg-cyber-pink text-white font-cyber font-black tracking-[0.2em] text-xs border-none shadow-neon-pink hover:bg-white hover:text-black transition-all skew-x-[-5deg]"
                    >
                        <span className="skew-x-[5deg] flex items-center justify-center gap-4">
                            <Sparkles size={24} /> 분석_시퀀스_초기화
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
