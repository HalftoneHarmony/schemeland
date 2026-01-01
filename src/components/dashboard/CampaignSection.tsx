import React, { useState } from 'react';
import { Calendar, FastForward, Plus, RefreshCw, Maximize2 } from 'lucide-react';
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

    // Calculate layout variables
    const cardWidth = 300;
    const gap = 32;
    const itemFullWidth = cardWidth + gap;
    const totalItems = activeProject.monthlyPlan.length;
    const containerWidth = Math.max(1200, totalItems * itemFullWidth + 300);

    // Calculate the "Active" fill width for the line
    const activeLineWidth = 150 + (selectedMonthIndex * itemFullWidth);

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-10 px-4">
                <h2 className="text-3xl font-cyber font-black text-white flex items-center gap-4">
                    <Calendar className="text-cyber-cyan shadow-neon-cyan" />
                    <span className="tracking-[0.1em] uppercase">CAMPAIGN_LOG::캠페인_로그</span>
                </h2>
                <Button
                    onClick={() => setCompressModalOpen(true)}
                    className={`
                        border-2 border-red-400 text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-300 skew-x-[-10deg]
                        ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] shadow-[0_0_15px_rgba(239,68,68,0.2)]'}
                    `}
                    isLoading={isCompressing}
                >
                    <span className="skew-x-[10deg] flex items-center gap-2 font-cyber font-black text-xs tracking-[0.2em]">
                        <FastForward size={14} className="animate-pulse" /> 하드코어_모드
                    </span>
                </Button>
            </div>

            <div className="relative overflow-x-auto px-4 py-12 custom-scrollbar">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative pb-16"
                    style={{ minWidth: `${containerWidth}px` }}
                >
                    <div className="flex gap-8 mb-12">
                        {activeProject.monthlyPlan.map((month, idx) => {
                            const isSelected = selectedMonthIndex === idx;
                            const isPast = idx < selectedMonthIndex;

                            return (
                                <motion.div
                                    key={idx}
                                    variants={cardVariants}
                                    whileHover={{ y: isSelected ? -20 : -10, scale: isSelected ? 1.05 : 1.02 }}
                                    onClick={() => handleMonthClick(idx)}
                                    className={`
                                        w-[300px] shrink-0 p-8 border-2 transition-all duration-500 cursor-pointer relative group flex flex-col h-[400px]
                                        ${isSelected
                                            ? 'bg-cyber-cyan/5 border-cyber-cyan shadow-neon-cyan z-20 -translate-y-4'
                                            : 'bg-black/80 border-white/10 hover:border-cyber-cyan/40'
                                        }
                                        ${isPast ? 'opacity-40 grayscale' : ''}
                                    `}
                                >
                                    <div className="skew-x-[2deg] flex-1 flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-8">
                                            <motion.div
                                                animate={isSelected ? { rotate: [0, 90, 0] } : {}}
                                                className={`w-14 h-14 flex items-center justify-center font-cyber font-black text-xl border-2 z-10 ${isSelected ? 'bg-cyber-cyan border-white text-black shadow-neon-cyan' : 'bg-black border-white/20 text-white/40'}`}
                                            >
                                                {idx + 1}월
                                            </motion.div>
                                            <div className="flex gap-2 items-center">
                                                {isSelected && !isEditingMonthTheme && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setIsEditingMonthTheme(true); }}
                                                        className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 hover:text-cyber-pink hover:border-cyber-pink transition-all text-[10px] font-cyber font-bold uppercase tracking-widest"
                                                    >
                                                        편집
                                                    </button>
                                                )}
                                                {isSelected && (
                                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpenCampaignDetail(); }} className="h-10 w-10 p-0 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-black">
                                                        <Maximize2 size={18} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col min-h-0">
                                            <AnimatePresence mode="wait">
                                                {isEditingMonthTheme && isSelected ? (
                                                    <motion.div
                                                        key="edit"
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="mb-6 h-full flex flex-col"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <textarea
                                                            className="w-full bg-black border-2 border-cyber-cyan/50 text-white p-4 focus:outline-none focus:border-cyber-cyan font-mono text-sm flex-1 resize-none"
                                                            value={month.theme}
                                                            onChange={(e) => handleUpdateMonthGoal(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 mt-4">
                                                            <Button onClick={triggerSmartAdjustment} size="sm" variant="ghost" className="flex-1 text-[10px] font-cyber font-black border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink hover:text-white" isLoading={isAdjustingPlan}>
                                                                AI_조정
                                                            </Button>
                                                            <Button onClick={() => setIsEditingMonthTheme(false)} size="sm" className="bg-cyber-cyan text-black font-cyber font-black text-[10px] border-none px-6 shadow-neon-cyan">
                                                                설정_저장
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
                                                        <h3 className={`font-cyber font-black text-xl leading-tight uppercase tracking-tight mb-6 ${isSelected ? 'text-white' : 'text-white/40'} line-clamp-2 min-h-[3.5rem]`}>
                                                            {month.theme}
                                                        </h3>

                                                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                                            <ul className="space-y-4">
                                                                {month.goals.map((goal, gIdx) => (
                                                                    <li key={gIdx} className="text-sm text-white/60 flex items-start gap-3 leading-relaxed group-hover:text-white transition-colors">
                                                                        <div className={`w-1 h-1 mt-2.5 shrink-0 ${isSelected ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-white/20'}`}></div>
                                                                        <span className="font-medium tracking-tight">{goal}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Extend Button Card */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 0, 255, 0.05)" }}
                            onClick={handleExtendRoadmap}
                            className="w-[300px] shrink-0 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink transition-all group h-[400px] skew-x-[-2deg]"
                        >
                            <div className="skew-x-[2deg] flex flex-col items-center">
                                {isExtending ? (
                                    <RefreshCw className="animate-spin text-cyber-pink" size={40} />
                                ) : (
                                    <>
                                        <div className="bg-black/40 p-6 border-2 border-white/10 group-hover:border-cyber-pink group-hover:shadow-neon-pink group-hover:scale-110 transition-all mb-6">
                                            <Plus className="text-white/20 group-hover:text-cyber-pink" size={32} />
                                        </div>
                                        <span className="text-[10px] font-cyber font-black text-white/20 group-hover:text-cyber-pink uppercase tracking-[0.3em]">다음_지역_해제</span>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* -- Timeline Track -- */}
                    <div className="absolute bottom-8 left-0 right-0 h-8 flex items-center">
                        <div className="absolute left-0 right-0 h-[2px] bg-white/5 w-full"></div>
                        <motion.div
                            className="absolute left-0 h-[2px] bg-cyber-cyan shadow-neon-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: activeLineWidth }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />

                        {activeProject.monthlyPlan.map((_, idx) => {
                            const leftPos = 150 + (idx * itemFullWidth);
                            const isSelected = selectedMonthIndex === idx;
                            const isPast = idx < selectedMonthIndex;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: isSelected ? 1.5 : 1,
                                        left: leftPos,
                                        opacity: 1
                                    }}
                                    className={`
                                        absolute w-3 h-3 -translate-x-1/2 z-10 border-2
                                        ${isSelected
                                            ? 'bg-cyber-cyan border-white shadow-neon-cyan rotate-45'
                                            : isPast
                                                ? 'bg-cyber-cyan border-cyber-cyan'
                                                : 'bg-black border-white/20'
                                        }
                                    `}
                                ></motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

