

import React, { useState } from 'react';
import { Target, Edit3, Save, Sparkles, Flag, Star, Rocket, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { ProjectScheme, ThreeYearVision } from '../../types';

interface VisionSectionProps {
    activeProject: ProjectScheme;
    isEditingMode: boolean; // Global layout edit mode (also enables editing)
    isEditingVision: boolean; // Specific vision editing mode
    visionDraft: ThreeYearVision | null;
    isExpandingVision: boolean;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
    handleExpandVision: () => void;
    setVisionDraft: (vision: ThreeYearVision | null) => void;
}

export function VisionSection({
    activeProject, isEditingMode, isEditingVision, visionDraft, isExpandingVision,
    handleEditVision, handleCancelEditVision, handleSaveVision, handleExpandVision, setVisionDraft
}: VisionSectionProps) {

    const [activeYearIndex, setActiveYearIndex] = useState(0);

    const VisionTextarea = ({ value, onChange, label, rows = 2 }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, label: string, rows?: number }) => (
        <div>
            <label className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-2 block">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full bg-zinc-900/50 p-4 rounded-xl text-base text-zinc-200 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none leading-relaxed"
            />
        </div>
    );

    // Determines if we are in an editable state for vision
    const isEditable = isEditingMode || isEditingVision;
    const hasVision = !!activeProject.threeYearVision;
    const maxYearIndex = hasVision ? 2 : 0; // If no vision expanded, only show Year 1

    const handlePrev = () => setActiveYearIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setActiveYearIndex(prev => Math.min(hasVision ? 2 : 1, prev + 1)); // Can go to index 1 (Year 2 placeholder) to unlock

    const themeColors = [
        { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: <Flag size={24} />, label: 'Foundation' },
        { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10', icon: <Rocket size={24} />, label: 'Growth' },
        { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/10', icon: <Crown size={24} />, label: 'Dominance' },
    ];

    const currentTheme = themeColors[activeYearIndex];

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Target className="text-zinc-600" /> STRATEGIC VISION
                </h2>
                {isEditable && activeProject.threeYearVision && (
                    <div className="flex gap-2 animate-scale-in">
                        {isEditingVision && <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-xs h-9 text-zinc-400 hover:text-white">Cancel</Button>}
                        <Button size="sm" onClick={handleSaveVision} className="text-xs h-9 bg-primary hover:bg-primaryHover text-white border-none shadow-lg shadow-primary/20">
                            <Save size={14} className="mr-2" /> Save Vision
                        </Button>
                    </div>
                )}
            </div>

            <div className="relative max-w-3xl mx-auto">
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    disabled={activeYearIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full border border-zinc-800 bg-black/50 hover:bg-zinc-800 hover:text-white transition-all z-20 
                        ${activeYearIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-zinc-500'}`}
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={handleNext}
                    disabled={activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full border border-zinc-800 bg-black/50 hover:bg-zinc-800 hover:text-white transition-all z-20
                        ${activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1) ? 'opacity-0 pointer-events-none' : 'text-zinc-500'}`}
                >
                    <ChevronRight size={20} />
                </button>

                {/* Main Card */}
                <div className={`
                    min-h-[280px] flex flex-col relative overflow-hidden rounded-2xl transition-all duration-500 border border-t-4 shadow-xl
                    ${currentTheme.border}
                    bg-gradient-to-br from-zinc-900 via-zinc-900 to-black
                `}>

                    {/* Atmospheric Glow Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${currentTheme.bg.replace('bg-', 'from-').replace('/10', '/30')} to-transparent opacity-20 pointer-events-none`}></div>
                    <div className={`absolute bottom-0 right-0 w-64 h-64 ${currentTheme.bg} blur-[80px] rounded-full opacity-10 pointer-events-none`}></div>

                    {/* Header */}
                    <div className="px-6 py-4 flex justify-between items-start border-b border-white/5 relative z-10">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md ${currentTheme.bg} ${currentTheme.text} text-[10px] font-black uppercase tracking-widest border border-white/5`}>
                                {currentTheme.icon}
                                <span>Year 0{activeYearIndex + 1} — {currentTheme.label}</span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {hasVision && !isEditable && (
                            <button
                                onClick={handleEditVision}
                                className="p-1.5 rounded-md bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                                <Edit3 size={14} />
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="px-8 py-6 flex-1 relative z-10 flex flex-col justify-center">

                        {/* YEAR 1 */}
                        {activeYearIndex === 0 && (
                            <div className="animate-fade-in w-full">
                                {isEditable && visionDraft && activeProject.threeYearVision ? (
                                    <VisionTextarea
                                        label="Year 1 Objective"
                                        value={visionDraft.year1 || activeProject.yearlyPlan.vision}
                                        onChange={(e) => setVisionDraft({ ...visionDraft, year1: e.target.value })}
                                        rows={6}
                                    />
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1">
                                            <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed tracking-tight">
                                                "{activeProject.yearlyPlan.vision}"
                                            </h3>
                                        </div>

                                        {/* Divider for mobile */}
                                        <div className="block md:hidden h-px w-full bg-white/10"></div>

                                        <div className="w-full md:w-5/12 flex flex-col gap-3">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 ml-1">Success Metrics</p>
                                            {activeProject.yearlyPlan.keyResults.map((kr, idx) => (
                                                <div key={idx} className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition-all">
                                                    <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 shrink-0 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                                        <Target size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-zinc-300 text-xs md:text-sm font-medium leading-snug">{kr}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* YEAR 2 */}
                        {activeYearIndex === 1 && (
                            <div className="animate-fade-in w-full h-full flex flex-col justify-center">
                                {hasVision ? (
                                    isEditable && visionDraft ? (
                                        <VisionTextarea
                                            label="Year 2 Goal"
                                            value={visionDraft.year2}
                                            onChange={(e) => setVisionDraft({ ...visionDraft, year2: e.target.value })}
                                            rows={8}
                                        />
                                    ) : (
                                        <p className="text-lg text-zinc-200 leading-relaxed">{activeProject.threeYearVision!.year2}</p>
                                    )
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 py-4">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                            <Rocket size={24} className="text-zinc-600" />
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-1">Unlock Expansion</h4>
                                        <p className="text-zinc-400 mb-6 text-sm max-w-xs">Reveal the strategy for the next phase.</p>
                                        {!isExpandingVision ? (
                                            <Button onClick={handleExpandVision} className="bg-zinc-100 text-zinc-900 hover:bg-white border-none px-6 py-2 h-auto text-sm font-bold">
                                                <Sparkles size={16} className="mr-2" /> Unlock Year 2 & 3
                                            </Button>
                                        ) : (
                                            <div className="text-xs text-blue-400 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                                Constructing Timeline...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* YEAR 3 */}
                        {activeYearIndex === 2 && (
                            <div className="animate-fade-in w-full h-full flex flex-col">
                                {isEditable && visionDraft ? (
                                    <>
                                        <VisionTextarea
                                            label="Year 3 Goal"
                                            value={visionDraft.year3}
                                            onChange={(e) => setVisionDraft({ ...visionDraft, year3: e.target.value })}
                                            rows={5}
                                        />
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <VisionTextarea
                                                label="Ultimate Goal"
                                                value={visionDraft.ultimateGoal}
                                                onChange={(e) => setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value })}
                                                rows={2}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg text-zinc-200 leading-relaxed mb-8">{activeProject.threeYearVision!.year3}</p>
                                        <div className="mt-auto p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border-l-2 border-purple-500">
                                            <span className="text-purple-400 font-bold text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-2">
                                                <Crown size={12} /> Ultimate End State
                                            </span>
                                            <p className="text-sm text-white/90 font-medium">{activeProject.threeYearVision!.ultimateGoal}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination Dots */}
                    <div className="py-4 flex justify-center gap-1.5">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveYearIndex(idx)}
                                disabled={!hasVision && idx > 0 && idx > 1}
                                className={`h-1.5 rounded-full transition-all duration-300 
                                    ${activeYearIndex === idx ? `w-6 ${currentTheme.bg.replace('/10', '')} ${currentTheme.text.replace('text-', 'bg-')}` : 'w-1.5 bg-zinc-800 hover:bg-zinc-700'}
                                `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
