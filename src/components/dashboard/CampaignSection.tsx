import React, { useState, useRef } from 'react';
import { Calendar, FastForward, Plus, RefreshCw, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { ProjectScheme } from '../../types';

interface CampaignSectionProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    isCompressing: boolean;
    isExtending: boolean;
    isAdjustingPlan: boolean;
    setCompressModalOpen: (open: boolean) => void;
    handleMonthClick: (index: number) => void;
    handleExtendRoadmap: () => void;
    handleUpdateMonthGoal: (text: string) => void;
    triggerSmartAdjustment: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, skewX: -2 },
    visible: { opacity: 1, y: 0, skewX: -2 }
};

export function CampaignSection({
    activeProject, selectedMonthIndex, isCompressing, isExtending, isAdjustingPlan,
    setCompressModalOpen, handleMonthClick, handleExtendRoadmap, handleUpdateMonthGoal, triggerSmartAdjustment, onOpenCampaignDetail
}: CampaignSectionProps & { onOpenCampaignDetail: () => void }) {

    const [isEditingMonthTheme, setIsEditingMonthTheme] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Calculate layout variables
    const cardWidth = 340; // Updated to match actual card width
    const gap = 40; // Updated to match actual gap
    const itemFullWidth = cardWidth + gap;
    const totalItems = activeProject.monthlyPlan.length;
    // const containerWidth = Math.max(1200, totalItems * itemFullWidth + 300); // Dynamic width not strictly needed if we just let flex grow

    // Calculate the "Active" fill width for the line
    const activeLineWidth = 150 + (selectedMonthIndex * itemFullWidth);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = cardWidth * 2;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <motion.section
            className="w-full relative group/section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between mb-8 px-4 border-b border-white/5 pb-6">
                <motion.h2
                    className="text-3xl font-cyber font-black text-white flex items-center gap-4 uppercase tracking-[0.1em]"
                    whileHover={{ x: 5 }}
                >
                    <Calendar className="text-cyber-cyan shadow-neon-cyan" />
                    CAMPAIGN_LOG::캠페인_로그
                </motion.h2>

                <div className="flex gap-4">
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2 mr-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-black hover:border-cyber-cyan hover:text-cyber-cyan flex items-center justify-center transition-all active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-black hover:border-cyber-cyan hover:text-cyber-cyan flex items-center justify-center transition-all active:scale-95"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <Button
                        onClick={() => setCompressModalOpen(true)}
                        className={`
                            border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-300 skew-x-[-10deg]
                            ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] shadow-[0_0_15px_rgba(239,68,68,0.2)]'}
                        `}
                        isLoading={isCompressing}
                    >
                        <span className="skew-x-[10deg] flex items-center gap-2 font-cyber font-black text-[10px] tracking-[0.2em] uppercase">
                            <FastForward size={14} className="animate-pulse" /> Hardcore_Mode::하드코어
                        </span>
                    </Button>
                </div>
            </div>

            <div className="relative">
                {/* Gradient Masks for scrolling indication */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollContainerRef}
                    className="relative overflow-x-auto px-4 py-8 custom-scrollbar scroll-smooth no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for cleaner look
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative pb-20 flex"
                        style={{ width: 'max-content' }} // Ensure container grows with content
                    >
                        <div className="flex gap-10 px-4">
                            {activeProject.monthlyPlan.map((month, idx) => {
                                const isSelected = selectedMonthIndex === idx;
                                const isPast = idx < selectedMonthIndex;

                                return (
                                    <motion.div
                                        key={idx}
                                        variants={cardVariants}
                                        whileHover={{ y: -15, scale: 1.02 }}
                                        onClick={() => handleMonthClick(idx)}
                                        className={`
                                            w-[340px] shrink-0 p-8 border hover:border-cyber-cyan/50 transition-all duration-500 cursor-pointer relative group flex flex-col h-[460px] skew-x-[-2deg]
                                            ${isSelected
                                                ? 'bg-gradient-to-br from-cyber-cyan/10 to-transparent border-cyber-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] z-20'
                                                : 'bg-black/40 border-white/10'
                                            }
                                            ${isPast ? 'opacity-60 saturate-0 hover:saturate-100 hover:opacity-100' : ''}
                                        `}
                                    >
                                        <div className="skew-x-[2deg] flex-1 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[9px] font-cyber font-black uppercase tracking-[0.3em] ${isSelected ? 'text-cyber-cyan' : 'text-white/30'}`}>
                                                        Sector_{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                                    </span>
                                                    <div className={`text-3xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                                                        MONTH_{idx + 1}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!isEditingMonthTheme && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setIsEditingMonthTheme(true); }}
                                                            className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all rounded-full"
                                                        >
                                                            <RefreshCw size={12} />
                                                        </button>
                                                    )}
                                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpenCampaignDetail(); }} className="h-8 w-8 p-0 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-black rounded-full">
                                                        <Maximize2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col min-h-0 relative">
                                                <AnimatePresence mode="wait">
                                                    {isEditingMonthTheme && isSelected ? (
                                                        <motion.div
                                                            key="edit"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="h-full flex flex-col bg-black/50 backdrop-blur-md absolute inset-0 z-30 -m-4 p-4 border border-cyber-cyan/30"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <textarea
                                                                className="w-full bg-transparent text-white p-2 focus:outline-none font-mono text-sm flex-1 resize-none leading-relaxed"
                                                                value={month.theme}
                                                                onChange={(e) => handleUpdateMonthGoal(e.target.value)}
                                                                autoFocus
                                                                spellCheck={false}
                                                            />
                                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                                                <Button onClick={triggerSmartAdjustment} size="sm" variant="ghost" className="flex-1 text-[10px] font-cyber font-black border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink hover:text-white" isLoading={isAdjustingPlan}>
                                                                    AI_RECALC
                                                                </Button>
                                                                <Button onClick={() => setIsEditingMonthTheme(false)} size="sm" className="bg-cyber-cyan text-black font-cyber font-black text-[10px] border-none px-4 flex-1">
                                                                    SAVE
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="content"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex-1 flex flex-col min-h-0"
                                                        >
                                                            <h3 className={`font-cyber font-black text-2xl leading-tight uppercase tracking-tight mb-8 ${isSelected ? 'text-white' : 'text-white/30'} line-clamp-3`}>
                                                                "{month.theme}"
                                                            </h3>

                                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                                                <div>
                                                                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block mb-3 border-b border-white/5 pb-1">Primary_Objectives</span>
                                                                    <ul className="space-y-3">
                                                                        {month.goals.map((goal, gIdx) => (
                                                                            <li key={gIdx} className="text-sm text-white/50 flex items-start gap-3 leading-relaxed group-hover:text-white/80 transition-colors">
                                                                                <span className={`mt-1.5 w-1.5 h-1.5 ${isSelected ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-white/20'} rotate-45 shrink-0`} />
                                                                                <span className="font-medium tracking-tight font-mono text-xs">{goal}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Selection Glow */}
                                        {isSelected && (
                                            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50 blur-sm" />
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Extend Button Card */}
                            <motion.div
                                variants={cardVariants}
                                whileHover={{ scale: 1.02 }}
                                onClick={handleExtendRoadmap}
                                className="w-[150px] shrink-0 border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink hover:bg-cyber-pink/5 transition-all group h-[460px] skew-x-[-2deg]"
                            >
                                <div className="skew-x-[2deg] flex flex-col items-center gap-6">
                                    {isExtending ? (
                                        <RefreshCw className="animate-spin text-cyber-pink" size={32} />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyber-pink group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all bg-black">
                                                <Plus className="text-white/20 group-hover:text-cyber-pink" size={24} />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-[10px] font-cyber font-black text-white/20 group-hover:text-cyber-pink uppercase tracking-[0.2em] block rotate-90 whitespace-nowrap origin-center translate-y-8">
                                                    EXTEND_ROADMAP
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* -- Timeline Track -- */}
                        <div className="absolute bottom-10 left-0 right-0 h-px bg-white/10 w-full pointer-events-none">
                            <motion.div
                                className="absolute left-0 h-full bg-gradient-to-r from-cyber-cyan/50 via-cyber-cyan to-cyber-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: activeLineWidth }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}

