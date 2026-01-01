import React from 'react';
import { Calendar, FastForward, Plus, RefreshCw, Maximize2 } from 'lucide-react';
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
    setCompressModalOpen, handleMonthClick, handleExtendRoadmap, handleUpdateMonthGoal, triggerSmartAdjustment, onOpenCampaignDetail
}: CampaignSectionProps & { onOpenCampaignDetail: () => void }) {

    // Calculate progress line width
    // Card width (280) + Gap (32) = 312px per item
    // Line starts at left edge? No, usually connects centers.
    // Let's center it: First center at 140px.
    // Distance to current selected index: 140 + (index * 312)
    const cardWidth = 280;
    const gap = 32;
    const itemFullWidth = cardWidth + gap;
    const totalItems = activeProject.monthlyPlan.length;
    const containerWidth = Math.max(1200, totalItems * itemFullWidth + 200); // Dynamic container width

    // Calculate the "Active" fill width for the line
    // It should reach up to the center of the currently selected month
    const activeLineWidth = 140 + (selectedMonthIndex * itemFullWidth);

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Calendar className="text-blue-500" /> CAMPAIGN MAP
                </h2>
                <Button
                    onClick={() => setCompressModalOpen(true)}
                    className={`
                        border border-red-500/30 text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300
                        ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]'}
                    `}
                    isLoading={isCompressing}
                >
                    <FastForward size={16} className="mr-2" />
                    <span className="font-bold tracking-wider">HARDCORE MODE</span>
                </Button>
            </div>

            <div className="relative overflow-x-auto px-4 py-8 custom-scrollbar"> {/* Added padding for hover effects */}

                {/* Dynamic Container Width based on items */}
                <div className="relative pb-12" style={{ minWidth: `${containerWidth}px` }}> {/* Added bottom padding for line */}

                    <div className="flex gap-8 mb-8">
                        {activeProject.monthlyPlan.map((month, idx) => {
                            const isSelected = selectedMonthIndex === idx;
                            const isPast = idx < selectedMonthIndex;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleMonthClick(idx)}
                                    className={`
                                        w-[280px] shrink-0 rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer relative group flex flex-col h-[360px] backdrop-blur-md
                                        ${isSelected
                                            ? 'bg-gradient-to-b from-blue-900/40 to-black/80 border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] scale-105 z-10 -translate-y-2'
                                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-600 hover:-translate-y-2'
                                        }
                                        ${isPast ? 'opacity-60 saturate-50' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border z-10 shadow-lg ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-blue-900/50' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                                            {month.month}
                                        </div>
                                        <div className="flex gap-2">
                                            {isSelected && (
                                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpenCampaignDetail(); }} className="h-8 w-8 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 grid place-items-center">
                                                    <Maximize2 size={16} />
                                                </Button>
                                            )}
                                            {idx === 0 && !isPast && <span className="bg-primary/20 text-primary border border-primary/50 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse self-center">Current</span>}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col min-h-0">
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
                                            <h3
                                                className={`font-bold text-lg mb-4 leading-snug break-keep ${isSelected ? 'text-white' : 'text-zinc-400'} line-clamp-2 min-h-[3.5rem]`}
                                                title={month.theme}
                                            >
                                                {month.theme}
                                            </h3>
                                        )}

                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <ul className="space-y-3">
                                                {month.goals.map((goal, gIdx) => (
                                                    <li key={gIdx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]' : 'bg-zinc-700'}`}></div>
                                                        <span className="break-words w-full whitespace-normal">{goal}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Connection Point Top (Gone) - Moved to bottom line logic */}
                                </div>
                            );
                        })}

                        {/* Extend Button Card */}
                        <div
                            onClick={handleExtendRoadmap}
                            className={`
                                w-[280px] shrink-0 rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer 
                                hover:border-zinc-500 hover:bg-zinc-900 transition-all group h-[360px] relative top-0
                            `}
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

                    {/* -- Timeline Track (Below Cards) -- */}
                    <div className="absolute bottom-6 left-0 right-0 h-4 flex items-center">
                        {/* Background Line */}
                        <div className="absolute left-0 right-0 h-1 bg-zinc-800 w-full rounded-full"></div>

                        {/* Active Progress Line */}
                        <div
                            className="absolute left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-500 ease-in-out"
                            style={{ width: `${activeLineWidth}px` }}
                        ></div>

                        {/* Timeline Nodes */}
                        {activeProject.monthlyPlan.map((_, idx) => {
                            // Center of each card: 140 + (idx * 312)
                            const leftPos = 140 + (idx * itemFullWidth);
                            const isSelected = selectedMonthIndex === idx;
                            const isPast = idx < selectedMonthIndex;

                            return (
                                <div
                                    key={idx}
                                    className={`
                                        absolute w-4 h-4 rounded-full border-2 -translate-x-1/2 transition-colors duration-300 z-10
                                        ${isSelected
                                            ? 'bg-blue-500 border-white shadow-[0_0_15px_white] scale-125'
                                            : isPast
                                                ? 'bg-blue-900 border-blue-500'
                                                : 'bg-zinc-900 border-zinc-700'
                                        }
                                    `}
                                    style={{ left: `${leftPos}px` }}
                                ></div>
                            )
                        })}
                        {/* Extend Button Node */}
                        <div
                            className="absolute w-4 h-4 rounded-full border-2 border-dashed border-zinc-600 bg-zinc-900 -translate-x-1/2 z-10"
                            style={{ left: `${140 + (activeProject.monthlyPlan.length * itemFullWidth)}px` }}
                        ></div>
                    </div>

                </div>
            </div>
        </section>
    );
}
