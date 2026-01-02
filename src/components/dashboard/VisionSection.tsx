
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flag, Rocket, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectScheme, ThreeYearVision } from '../../types';
import { containerVariants, cardVariants, glowPulseVariants, scanlineVariants } from './constants';
import {
    VisionHeader, VisionForm, VisionDisplay, VisionPagination, LockedView
} from './subcomponents';

interface VisionSectionProps {
    activeProject: ProjectScheme;
    isEditingVision: boolean;
    visionDraft: ThreeYearVision | null;
    isExpandingVision: boolean;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
    handleExpandVision: () => void;
    setVisionDraft: (vision: ThreeYearVision | null) => void;
}

export function VisionSection({
    activeProject, isEditingVision, visionDraft, isExpandingVision,
    handleEditVision, handleCancelEditVision, handleSaveVision, handleExpandVision, setVisionDraft
}: VisionSectionProps) {

    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const hasVision = !!activeProject.threeYearVision;

    const handlePrev = () => {
        setDirection(-1);
        setActiveYearIndex(prev => Math.max(0, prev - 1));
    };
    const handleNext = () => {
        setDirection(1);
        setActiveYearIndex(prev => Math.min(hasVision ? 2 : 1, prev + 1));
    };

    const handlePageChange = (index: number) => {
        setDirection(index > activeYearIndex ? 1 : -1);
        setActiveYearIndex(index);
    };

    const themeColors = [
        { border: 'border-cyber-yellow', text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', shadow: 'shadow-neon-yellow', icon: <Flag size={20} />, label: '기반_구축_단계', gradient: 'from-cyber-yellow/20 via-transparent to-transparent' },
        { border: 'border-cyber-cyan', text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', shadow: 'shadow-neon-cyan', icon: <Rocket size={20} />, label: '시장_확장_단계', gradient: 'from-cyber-cyan/20 via-transparent to-transparent' },
        { border: 'border-cyber-pink', text: 'text-cyber-pink', bg: 'bg-cyber-pink/10', shadow: 'shadow-neon-pink', icon: <Crown size={20} />, label: '지배_및_정점_단계', gradient: 'from-cyber-pink/20 via-transparent to-transparent' },
    ];

    const currentTheme = themeColors[activeYearIndex];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 80 : -80,
            opacity: 0,
            scale: 0.9,
            filter: "brightness(1.5) blur(10px)"
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "brightness(1) blur(0px)"
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 80 : -80,
            opacity: 0,
            scale: 0.9,
            filter: "brightness(0.5) blur(10px)"
        })
    };

    // Helper to normalize vision data
    const getYearValue = (yearData: any): { vision: string, keyResults: string[] } => {
        if (!yearData) return { vision: '', keyResults: [] };
        if (typeof yearData === 'string') return { vision: yearData, keyResults: [] };
        return { vision: yearData.vision || '', keyResults: yearData.keyResults || [] };
    };

    // Calculate current data for display mode
    const currentYearDataRaw = activeYearIndex === 0
        ? (activeProject.threeYearVision?.year1 || activeProject.yearlyPlan)
        : activeYearIndex === 1
            ? activeProject.threeYearVision?.year2
            : activeProject.threeYearVision?.year3;

    const { vision, keyResults } = getYearValue(currentYearDataRaw);

    return (
        <motion.section
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative max-w-5xl mx-auto px-16">
                {/* Navigation Buttons */}
                <motion.button
                    whileHover={{ scale: 1.15, x: -8, boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    disabled={activeYearIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 border-2 flex items-center justify-center transition-all z-20 cyber-clipper
                        ${activeYearIndex === 0 ? 'opacity-0 pointer-events-none' : 'border-white/10 text-white hover:border-cyber-cyan hover:text-cyber-cyan bg-black shadow-neon-cyan'}`}
                >
                    <motion.div
                        animate={{ x: [-2, 2, -2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronLeft size={28} />
                    </motion.div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.15, x: 8, boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    disabled={activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 border-2 flex items-center justify-center transition-all z-20 cyber-clipper
                        ${activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1) ? 'opacity-0 pointer-events-none' : 'border-white/10 text-white hover:border-cyber-cyan hover:text-cyber-cyan bg-black shadow-neon-cyan'}`}
                >
                    <motion.div
                        animate={{ x: [2, -2, 2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronRight size={28} />
                    </motion.div>
                </motion.button>

                {/* Main Card */}
                <motion.div
                    layout
                    variants={cardVariants}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileHover={{ y: -5 }}
                    className={`
                        min-h-[450px] flex flex-col relative overflow-hidden border-2 transition-all duration-700 bg-zinc-950/80 cyber-clipper-lg
                        ${currentTheme.border} ${currentTheme.shadow}
                    `}
                >
                    {/* Background Effects */}
                    <motion.div
                        className={`absolute top-0 right-0 w-80 h-80 ${currentTheme.bg} blur-[120px] -mr-40 -mt-40`}
                        variants={glowPulseVariants}
                        animate="animate"
                    />
                    <motion.div
                        className={`absolute bottom-0 left-0 w-60 h-60 ${currentTheme.bg} blur-[100px] -ml-30 -mb-30 opacity-30`}
                        variants={glowPulseVariants}
                        animate="animate"
                        transition={{ delay: 1.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"
                            variants={scanlineVariants}
                            animate="animate"
                        />
                    </div>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Header */}
                    <VisionHeader
                        activeYearIndex={activeYearIndex}
                        theme={currentTheme}
                        isEditingVision={isEditingVision}
                        hasVision={hasVision}
                        handleEditVision={handleEditVision}
                        handleCancelEditVision={handleCancelEditVision}
                        handleSaveVision={handleSaveVision}
                    />

                    {/* Content Area */}
                    <div className="px-12 py-10 flex-1 relative z-10 flex flex-col justify-center skew-x-[1deg]">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={activeYearIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                className="w-full h-full flex flex-col justify-center"
                            >
                                {((activeYearIndex === 0) || (activeYearIndex > 0 && hasVision)) ? (
                                    <div className="w-full">
                                        {isEditingVision && visionDraft ? (
                                            <VisionForm
                                                visionDraft={visionDraft}
                                                setVisionDraft={(val) => setVisionDraft(val)}
                                                activeYearIndex={activeYearIndex}
                                            />
                                        ) : (
                                            <VisionDisplay
                                                vision={vision}
                                                keyResults={keyResults}
                                                ultimateGoal={activeProject.threeYearVision?.ultimateGoal}
                                                activeYearIndex={activeYearIndex}
                                                theme={currentTheme}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <LockedView
                                        isExpandingVision={isExpandingVision}
                                        handleExpandVision={handleExpandVision}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    <VisionPagination
                        activeYearIndex={activeYearIndex}
                        hasVision={hasVision}
                        onPageChange={handlePageChange}
                        themeColors={themeColors}
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}
