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
    handleUpdateMonthObjectives: (goals: string[]) => void;
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
    setCompressModalOpen, handleMonthClick, handleExtendRoadmap, handleUpdateMonthGoal, handleUpdateMonthObjectives, triggerSmartAdjustment, onOpenCampaignDetail
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

    const handleGoalChange = (idx: number, val: string) => {
        const month = activeProject.monthlyPlan[selectedMonthIndex];
        if (!month) return;
        const newGoals = [...month.goals];
        newGoals[idx] = val;
        handleUpdateMonthObjectives(newGoals);
    };

    const handleAddGoal = () => {
        const month = activeProject.monthlyPlan[selectedMonthIndex];
        if (!month) return;
        handleUpdateMonthObjectives([...month.goals, "새 목표"]);
    };

    const handleDeleteGoal = (idx: number) => {
        const month = activeProject.monthlyPlan[selectedMonthIndex];
        if (!month) return;
        const newGoals = month.goals.filter((_, i) => i !== idx);
        handleUpdateMonthObjectives(newGoals);
    };

    return (
        <motion.section
            className="w-full relative group/section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-end mb-8 px-4 border-b border-white/5 pb-6">

                <div className="flex items-center gap-6">
                    {/* Minimalist Navigation */}
                    <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-full p-1 pl-3 pr-1 backdrop-blur-sm">
                        <span className="text-[9px] font-mono text-white/20 mr-2 uppercase tracking-widest hidden sm:block">Navigate</span>
                        <div className="flex items-center gap-px">
                            <button
                                onClick={() => scroll('left')}
                                className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-cyber-cyan hover:bg-white/5 rounded-full transition-all active:scale-95 group"
                                aria-label="Scroll Left"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <div className="w-px h-3 bg-white/5" />
                            <button
                                onClick={() => scroll('right')}
                                className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-cyber-cyan hover:bg-white/5 rounded-full transition-all active:scale-95 group"
                                aria-label="Scroll Right"
                            >
                                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Minimalist Hardcore Trigger */}
                    <button
                        onClick={() => setCompressModalOpen(true)}
                        disabled={isCompressing}
                        className={`
                            group relative flex items-center justify-center
                            w-8 h-8 hover:w-32 transition-all duration-500 ease-out
                            bg-black/40 border border-white/5 hover:border-red-500/50 rounded-full
                            overflow-hidden backdrop-blur-sm
                        `}
                    >
                        <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 group-hover:translate-x-0 group-hover:left-3 transition-all duration-500">
                            <FastForward
                                size={14}
                                className={`
                                    min-w-[14px]
                                    ${isCompressing ? 'text-red-500 animate-pulse' : 'text-white/20 group-hover:text-red-500'}
                                    transition-colors
                                `}
                            />
                            <span className="text-[9px] font-cyber font-black text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 delay-75">
                                Hardcore
                            </span>
                        </div>
                    </button>
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
                                const [isHovered, setIsHovered] = useState(false);

                                return (
                                    <motion.div
                                        key={idx}
                                        variants={cardVariants}
                                        onHoverStart={() => setIsHovered(true)}
                                        onHoverEnd={() => setIsHovered(false)}
                                        onClick={() => handleMonthClick(idx)}
                                        className={`
                                            w-[340px] shrink-0 p-8 border transition-all duration-300 cursor-pointer relative group flex flex-col skew-x-[-2deg] overflow-hidden
                                            ${isSelected
                                                ? 'bg-gradient-to-br from-cyber-cyan/10 to-transparent border-cyber-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] z-20'
                                                : 'bg-black/40 border-white/10 hover:border-cyber-cyan/30'
                                            }
                                            ${isPast ? 'opacity-60 saturate-0 hover:saturate-100 hover:opacity-100' : ''}
                                        `}
                                        animate={{
                                            y: isHovered ? -10 : 0,
                                            height: isHovered ? 'auto' : 460,
                                            zIndex: isHovered ? 50 : (isSelected ? 20 : 0)
                                        }}
                                        transition={{
                                            y: { type: "spring", stiffness: 400, damping: 30 },
                                            height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                                            default: { duration: 0.3 }
                                        }}
                                        style={{ minHeight: 460 }}
                                    >
                                        <div className="skew-x-[2deg] flex-1 flex flex-col relative">
                                            {/* Header Section */}
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
                                                            className="h-full flex flex-col bg-black/95 backdrop-blur-md absolute inset-0 z-30 -m-6 p-6 border border-cyber-cyan shadow-xl min-h-[400px]"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="mb-2 text-[10px] font-cyber text-cyber-cyan uppercase tracking-wider">Month Theme</div>
                                                            <textarea
                                                                className="w-full bg-white/5 border border-white/10 text-white p-3 focus:outline-none focus:border-cyber-cyan font-mono text-sm resize-none leading-relaxed h-20 mb-4 rounded-sm"
                                                                value={month.theme}
                                                                onChange={(e) => handleUpdateMonthGoal(e.target.value)}
                                                                autoFocus
                                                                spellCheck={false}
                                                            />

                                                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="text-[10px] font-cyber text-cyber-cyan uppercase tracking-wider">Objectives</div>
                                                                    <button onClick={handleAddGoal} className="text-[10px] bg-cyber-cyan/20 px-2 py-0.5 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-colors rounded-sm">+</button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {month.goals.map((g, i) => (
                                                                        <div key={i} className="flex gap-2">
                                                                            <input
                                                                                className="flex-1 bg-white/5 border border-white/10 text-white/80 px-2 py-1 text-xs font-mono focus:border-cyber-cyan focus:outline-none"
                                                                                value={g}
                                                                                onChange={(e) => handleGoalChange(i, e.target.value)}
                                                                            />
                                                                            <button onClick={() => handleDeleteGoal(i)} className="text-red-500 hover:text-red-400 px-1 text-xs">x</button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10 shrink-0">
                                                                <Button onClick={triggerSmartAdjustment} size="sm" variant="ghost" className="flex-1 text-[10px] font-cyber font-black border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink hover:text-white" isLoading={isAdjustingPlan}>
                                                                    AI_RECALC
                                                                </Button>
                                                                <Button onClick={() => setIsEditingMonthTheme(false)} size="sm" className="bg-cyber-cyan text-black font-cyber font-black text-[10px] border-none px-4 flex-1">
                                                                    DONE
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

                                                            <div className="flex-1 relative">
                                                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block mb-3 border-b border-white/5 pb-1">Primary_Objectives</span>

                                                                <motion.ul className="space-y-3 relative z-10">
                                                                    <AnimatePresence>
                                                                        {(isHovered ? month.goals : month.goals.slice(0, 3)).map((goal, gIdx) => (
                                                                            <motion.li
                                                                                key={gIdx}
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                exit={{ opacity: 0, x: -10 }}
                                                                                transition={{ delay: gIdx * 0.05 + 0.1 }}
                                                                                className="text-sm text-white/50 flex items-start gap-3 leading-relaxed group-hover:text-white/80 transition-colors"
                                                                            >
                                                                                <span className={`mt-1.5 w-1.5 h-1.5 ${isSelected ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-white/20'} rotate-45 shrink-0`} />
                                                                                <span className="font-medium tracking-tight font-mono text-xs">{goal}</span>
                                                                            </motion.li>
                                                                        ))}
                                                                    </AnimatePresence>
                                                                </motion.ul>

                                                                {/* More Indicator (Holographic Fade) */}
                                                                {!isHovered && month.goals.length > 3 && (
                                                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent flex items-end justify-center pointer-events-none">
                                                                        <span className="text-[9px] text-cyber-cyan animate-pulse bg-black/50 px-2">+ {month.goals.length - 3} MORE_DATA</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Selection Glow (Bottom) */}
                                        {isSelected && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50 blur-sm" />
                                        )}

                                        {/* Hover Glow (Background) */}
                                        {isHovered && (
                                            <motion.div
                                                layoutId="hoverGlow"
                                                className="absolute inset-0 bg-cyber-cyan/5 rounded-none z-0 pointer-events-none mix-blend-screen"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            />
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

