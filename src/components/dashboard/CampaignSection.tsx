
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectScheme } from '../../types';
import { containerVariants, cardVariants } from './constants';
import { MonthCard, AddMonthCard } from './subcomponents';

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
    onOpenCampaignDetail: () => void;
}

export function CampaignSection({
    activeProject, selectedMonthIndex, isCompressing, isExtending, isAdjustingPlan,
    setCompressModalOpen, handleMonthClick, handleExtendRoadmap, handleUpdateMonthGoal, handleUpdateMonthObjectives, triggerSmartAdjustment, onOpenCampaignDetail
}: CampaignSectionProps) {

    const [isEditingMonthTheme, setIsEditingMonthTheme] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Calculate layout variables
    const cardWidth = 340;
    const gap = 40;
    const itemFullWidth = cardWidth + gap;

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
            <div className="relative group/container">
                {/* Gradient Masks & Integrated Navigation */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/50 to-transparent z-[60] flex items-center justify-start pl-2 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/10 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan hover:bg-black flex items-center justify-center transition-all pointer-events-auto hover:scale-110 active:scale-95 shadow-lg group/nav cyber-clipper"
                    >
                        <ChevronLeft size={24} className="group-hover/nav:-translate-x-0.5 transition-transform" />
                    </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/50 to-transparent z-[60] flex items-center justify-end pr-2 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500">
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/10 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan hover:bg-black flex items-center justify-center transition-all pointer-events-auto hover:scale-110 active:scale-95 shadow-lg group/nav cyber-clipper"
                    >
                        <ChevronRight size={24} className="group-hover/nav:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Integrated Hardcore Trigger (Top Right Floating) */}
                <div className="absolute top-0 right-0 z-[70] p-4">
                    <motion.button
                        onClick={() => setCompressModalOpen(true)}
                        disabled={isCompressing}
                        initial="idle"
                        whileHover="burning"
                        animate={isCompressing ? "burning" : "idle"}
                        className="relative group flex items-center justify-center"
                    >
                        <motion.div
                            variants={{
                                idle: { opacity: 0, scale: 0.5 },
                                burning: { opacity: 1, scale: 1.2 }
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"
                        />
                        <div className={`
                            relative flex items-center gap-2 px-4 py-2 border backdrop-blur-md transition-all duration-300 cyber-clipper
                            ${isCompressing
                                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-neon-pink'
                                : 'bg-black/20 border-white/5 text-white/20 hover:border-red-500/50 hover:text-white hover:bg-red-950/20'
                            }
                        `}>
                            <motion.div
                                variants={{
                                    idle: { rotate: 0 },
                                    burning: {
                                        rotate: [-10, 10, -10],
                                        scale: [1, 1.3, 1],
                                        filter: "brightness(2) drop-shadow(0 0 10px #ef4444)"
                                    }
                                }}
                                transition={{
                                    rotate: { duration: 0.15, repeat: Infinity, repeatType: 'mirror' },
                                    scale: { duration: 0.3, repeat: Infinity, repeatType: 'mirror' }
                                }}
                            >
                                <FastForward size={16} fill={isCompressing ? "currentColor" : "none"} />
                            </motion.div>
                            <span className="text-[10px] font-cyber font-black uppercase tracking-[0.2em] hidden group-hover:block whitespace-nowrap overflow-hidden">
                                {isCompressing ? 'COMPRESSING' : 'HARDCORE_PROTOCOL'}
                            </span>
                        </div>
                    </motion.button>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="relative overflow-x-auto px-4 py-8 custom-scrollbar scroll-smooth no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative pb-20 flex"
                        style={{ width: 'max-content' }}
                    >
                        <div className="flex gap-10 px-4">
                            {activeProject.monthlyPlan.map((month, idx) => (
                                <React.Fragment key={idx}>
                                    <MonthCard
                                        month={month}
                                        index={idx}
                                        isSelected={selectedMonthIndex === idx}
                                        isPast={idx < selectedMonthIndex}
                                        isEditing={isEditingMonthTheme}
                                        isAdjusting={isAdjustingPlan}
                                        onEditStart={() => setIsEditingMonthTheme(true)}
                                        onEditEnd={() => setIsEditingMonthTheme(false)}
                                        onClick={() => { handleMonthClick(idx); onOpenCampaignDetail(); }}
                                        onUpdateTheme={handleUpdateMonthGoal}
                                        onUpdateObjectives={handleUpdateMonthObjectives}
                                        onAiAdjustment={triggerSmartAdjustment}
                                    />
                                </React.Fragment>
                            ))}

                            <AddMonthCard
                                isExtending={isExtending}
                                onExtend={handleExtendRoadmap}
                            />
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
            </div >
        </motion.section >
    );
}
