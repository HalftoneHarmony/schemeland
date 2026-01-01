import React from 'react';
import { Calendar, FastForward, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../Button';
import { ProjectScheme } from '../../types';

interface CampaignSectionProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    isEditingMode: boolean;
    isCompressing: boolean;
    isExtending: boolean;
    isAdjustingPlan: boolean;
    setCompressModalOpen: (open: boolean) => void;
    handleMonthClick: (index: number) => void;
    handleExtendRoadmap: () => void;
    handleUpdateMonthGoal: (text: string) => void;
    triggerSmartAdjustment: () => void;
}

export function CampaignSection({
    activeProject, selectedMonthIndex, isEditingMode, isCompressing, isExtending, isAdjustingPlan,
    setCompressModalOpen, handleMonthClick, handleExtendRoadmap, handleUpdateMonthGoal, triggerSmartAdjustment
}: CampaignSectionProps) {

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Calendar className="text-blue-500" /> CAMPAIGN MAP
                </h2>
                <Button
                    variant="ghost"
                    onClick={() => setCompressModalOpen(true)}
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
                    isLoading={isCompressing}
                >
                    <FastForward size={16} className="mr-2" /> Hardcore Mode
                </Button>
            </div>

            <div className="relative overflow-x-auto pb-8 custom-scrollbar">
                {/* Connecting Line */}
                <div className="absolute top-[88px] left-0 right-0 h-1 bg-zinc-800 w-[1200px] -z-10"></div>

                <div className="flex gap-8 min-w-[1200px] px-2">
                    {activeProject.monthlyPlan.map((month, idx) => {
                        const isSelected = selectedMonthIndex === idx;
                        const isPast = idx < selectedMonthIndex;

                        return (
                            <div
                                key={idx}
                                onClick={() => handleMonthClick(idx)}
                                className={`
                                w-[280px] shrink-0 rounded-2xl p-6 border-2 transition-all cursor-pointer relative group flex flex-col h-[320px] backdrop-blur-md
                                ${isSelected
                                        ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] scale-105 z-10'
                                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-600 hover:translate-y-[-5px]'
                                    }
                                ${isPast ? 'opacity-50 grayscale' : ''}
                            `}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 z-10 ${isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-800 border-zinc-600 text-zinc-500'}`}>
                                        {month.month}
                                    </div>
                                    {idx === 0 && <span className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider animate-pulse">Current Level</span>}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    {/* Editable Theme */}
                                    {isEditingMode && isSelected ? (
                                        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                                            <textarea
                                                className="w-full bg-black/40 text-white p-3 rounded-lg text-lg font-bold border border-primary/50 focus:outline-none resize-none h-24"
                                                value={month.theme}
                                                onChange={(e) => handleUpdateMonthGoal(e.target.value)}
                                            />
                                            <Button onClick={triggerSmartAdjustment} size="sm" className="w-full mt-2 text-xs py-2" isLoading={isAdjustingPlan}>
                                                <RefreshCw size={12} className="mr-2" /> AI Recalibrate
                                            </Button>
                                        </div>
                                    ) : (
                                        <h3 className={`font-bold text-xl mb-4 leading-tight ${isSelected ? 'text-white' : 'text-zinc-400'} min-h-[3.5rem]`}>{month.theme}</h3>
                                    )}

                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <ul className="space-y-3">
                                            {month.goals.map((goal, gIdx) => (
                                                <li key={gIdx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-blue-500' : 'bg-zinc-600'}`}></div>
                                                    {goal}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Extend Button Card */}
                    <div
                        onClick={handleExtendRoadmap}
                        className="w-[280px] shrink-0 rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all group h-[320px]"
                    >
                        {isExtending ? (
                            <RefreshCw className="animate-spin text-zinc-500" size={32} />
                        ) : (
                            <>
                                <div className="bg-zinc-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="text-zinc-400 group-hover:text-white" size={32} />
                                </div>
                                <span className="text-sm font-bold text-zinc-500 group-hover:text-white uppercase tracking-wider">Unlock Next Stage</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
