import React from 'react';
import { ArrowLeft, Wand2, Lightbulb, Plus, Sparkles } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
            <div className="mb-12">
                <button onClick={onBack} className="text-zinc-500 hover:text-white mb-6 flex items-center text-sm font-bold tracking-wide uppercase transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Base
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black mb-3">IDEA LAB</h2>
                        <p className="text-lg text-textMuted max-w-xl">Dump your raw ideas. Use the <strong className="text-primary"><Wand2 size={16} className="inline" /> Magic</strong> button to refine them into gems.</p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={onSuggestion}
                        isLoading={isSuggesting}
                        className="shrink-0 h-12 px-6 rounded-full border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all"
                    >
                        <Lightbulb size={18} className="mr-2" />
                        Get Inspired
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {ideas.map((idea, idx) => (
                    <div key={idea.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up">
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

            <div className="sticky bottom-6 z-20 flex gap-4 backdrop-blur-xl p-4 -mx-4 rounded-2xl border border-white/10 bg-black/50 shadow-2xl">
                <Button variant="secondary" onClick={onAddIdea} className="flex-1 h-12 text-lg">
                    <Plus className="mr-2" size={20} /> Add Card
                </Button>
                <Button onClick={onAnalyze} isLoading={isAnalyzing} disabled={isAnalyzing} className="flex-[2] h-12 text-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primaryHover hover:to-indigo-500 border-none shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]">
                    <Sparkles className="mr-2" size={20} /> Analyze & Start Game
                </Button>
            </div>
        </div>
    );
}
