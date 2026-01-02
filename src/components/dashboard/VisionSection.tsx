import React, { useState } from 'react';
import { Target, Edit3, Save, Sparkles, Flag, Star, Rocket, Crown, ChevronLeft, ChevronRight, Lock, Zap, Activity, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { ProjectScheme, ThreeYearVision } from '../../types';

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

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

const glowPulseVariants = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
};

const floatVariants = {
    animate: {
        y: [0, -8, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
};

const scanlineVariants = {
    animate: {
        x: ["-100%", "200%"],
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
};

const shimmerVariants = {
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
};

export function VisionSection({
    activeProject, isEditingVision, visionDraft, isExpandingVision,
    handleEditVision, handleCancelEditVision, handleSaveVision, handleExpandVision, setVisionDraft
}: VisionSectionProps) {

    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const getYearValue = (yearData: any): { vision: string, keyResults: string[] } => {
        if (!yearData) return { vision: '', keyResults: [] };
        if (typeof yearData === 'string') return { vision: yearData, keyResults: [] };
        return { vision: yearData.vision || '', keyResults: yearData.keyResults || [] };
    };

    const VisionTextarea = ({ value, onChange, label, rows = 2 }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, label: string, rows?: number }) => (
        <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full bg-black border border-white/5 p-5 text-base text-white/90 focus:outline-none focus:border-cyber-cyan font-mono resize-none leading-relaxed transition-all duration-300 hover:border-white/20 cyber-clipper"
            />
        </motion.div>
    );

    const hasVision = !!activeProject.threeYearVision;
    const handlePrev = () => {
        setDirection(-1);
        setActiveYearIndex(prev => Math.max(0, prev - 1));
    };
    const handleNext = () => {
        setDirection(1);
        setActiveYearIndex(prev => Math.min(hasVision ? 2 : 1, prev + 1));
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

    return (
        <motion.section
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >


            <div className="relative max-w-5xl mx-auto px-16">
                {/* Navigation Buttons with enhanced animations */}
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

                {/* Main Card with enhanced animations */}
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
                    {/* Animated Background Effects */}
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

                    {/* Header with enhanced animations */}
                    <motion.div
                        className="px-10 py-6 flex justify-between items-center border-b border-white/5 relative z-10 bg-white/5 backdrop-blur-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={`flex items-center gap-4 ${currentTheme.text}`}>
                            <motion.div
                                className="font-cyber font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    {currentTheme.icon}
                                </motion.span>
                                VISION_SEQUENCE::{activeYearIndex + 1}년차
                            </motion.div>
                            <motion.div
                                className={`w-2 h-2 rounded-full ${currentTheme.text.replace('text-', 'bg-')}`}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [1, 0.5, 1],
                                    boxShadow: [
                                        "0 0 0px currentColor",
                                        "0 0 15px currentColor",
                                        "0 0 0px currentColor"
                                    ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.div
                                className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {currentTheme.label}
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isEditingVision ? (
                                <motion.div
                                    className="flex items-center gap-4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-[10px] font-cyber font-black text-white/20 hover:text-white uppercase tracking-widest">중단</Button>
                                    <Button size="sm" onClick={handleSaveVision} className="bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest px-6 shadow-neon-cyan border-none">
                                        <Save size={14} className="mr-2" /> 데이터_동기화
                                    </Button>
                                </motion.div>
                            ) : hasVision ? (
                                <motion.button
                                    onClick={handleEditVision}
                                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all text-[10px] font-cyber font-black uppercase tracking-widest cyber-clipper"
                                >
                                    <Edit3 size={12} /> 재보정
                                </motion.button>
                            ) : null}
                        </div>
                    </motion.div>

                    {/* Content Area with slide animations */}
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
                                            <motion.div
                                                className="space-y-6"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <VisionTextarea
                                                    label={`${activeYearIndex + 1}년_후의_나는 (R=VD)`}
                                                    value={getYearValue(activeYearIndex === 0 ? visionDraft.year1 : activeYearIndex === 1 ? visionDraft.year2 : visionDraft.year3).vision}
                                                    onChange={(e) => {
                                                        const key = activeYearIndex === 0 ? 'year1' : activeYearIndex === 1 ? 'year2' : 'year3';
                                                        const current = getYearValue(visionDraft[key]);
                                                        setVisionDraft({ ...visionDraft, [key]: { ...current, vision: e.target.value } });
                                                    }}
                                                    rows={3}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[0, 1, 2].map((idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            className="flex flex-col gap-2"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                        >
                                                            <label className="text-white/20 font-cyber font-black text-[8px] uppercase tracking-widest">Milestone_0{idx + 1}</label>
                                                            <textarea
                                                                className="w-full bg-black border border-white/10 p-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan font-mono resize-none h-24 transition-all duration-300 hover:border-white/30 cyber-clipper"
                                                                value={getYearValue(activeYearIndex === 0 ? visionDraft.year1 : activeYearIndex === 1 ? visionDraft.year2 : visionDraft.year3).keyResults[idx] || ''}
                                                                onChange={(e) => {
                                                                    const key = activeYearIndex === 0 ? 'year1' : activeYearIndex === 1 ? 'year2' : 'year3';
                                                                    const current = getYearValue(visionDraft[key]);
                                                                    const krs = [...current.keyResults];
                                                                    while (krs.length <= idx) krs.push('');
                                                                    krs[idx] = e.target.value;
                                                                    setVisionDraft({ ...visionDraft, [key]: { ...current, keyResults: krs } });
                                                                }}
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {activeYearIndex === 2 && (
                                                    <VisionTextarea
                                                        label="궁극적_상태 (Ultimate Goal)"
                                                        value={visionDraft.ultimateGoal}
                                                        onChange={(e) => setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value })}
                                                        rows={2}
                                                    />
                                                )}
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col gap-8">
                                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                                    <motion.div
                                                        className="flex-1"
                                                        variants={floatVariants}
                                                        animate="animate"
                                                    >
                                                        <motion.div
                                                            className={`font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4 ${currentTheme.text} flex items-center gap-2`}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.2 }}
                                                        >
                                                            <motion.span
                                                                animate={{ rotate: [0, 360] }}
                                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            >
                                                                <Activity size={14} />
                                                            </motion.span>
                                                            Future_Self::{activeYearIndex + 1}년_후의_나는
                                                        </motion.div>
                                                        <motion.h3
                                                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                            transition={{ delay: 0.3, duration: 0.6 }}
                                                            className="text-3xl md:text-4xl font-cyber font-black text-white leading-tight uppercase tracking-tight skew-x-[-5deg] relative"
                                                        >
                                                            <motion.span
                                                                className="relative inline-block"
                                                                whileHover={{ scale: 1.02 }}
                                                            >
                                                                "{getYearValue(activeYearIndex === 0
                                                                    ? (activeProject.threeYearVision?.year1 || activeProject.yearlyPlan)
                                                                    : activeYearIndex === 1
                                                                        ? activeProject.threeYearVision?.year2
                                                                        : activeProject.threeYearVision?.year3).vision}"
                                                            </motion.span>
                                                        </motion.h3>
                                                    </motion.div>

                                                    <div className="w-full md:w-5/12 flex flex-col gap-3">
                                                        <motion.div
                                                            className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.4em] mb-2 flex items-center gap-2"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                        >
                                                            <motion.span
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            >
                                                                <Wifi size={12} />
                                                            </motion.span>
                                                            Milestone_Checkpoints::마일스톤
                                                        </motion.div>
                                                        {getYearValue(activeYearIndex === 0
                                                            ? (activeProject.threeYearVision?.year1 || activeProject.yearlyPlan)
                                                            : activeYearIndex === 1
                                                                ? activeProject.threeYearVision?.year2
                                                                : activeProject.threeYearVision?.year3
                                                        ).keyResults.map((kr, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                                transition={{ delay: 0.5 + (0.15 * idx), type: "spring", stiffness: 100 }}
                                                                whileHover={{
                                                                    x: 8,
                                                                    borderColor: "rgba(255,255,255,0.4)",
                                                                    backgroundColor: "rgba(255,255,255,0.1)"
                                                                }}
                                                                className={`flex items-start gap-4 p-5 border border-white/5 bg-zinc-900/40 transition-all cursor-default relative overflow-hidden group cyber-clipper`}
                                                            >
                                                                <motion.div
                                                                    className={`absolute top-0 left-0 w-[4px] h-full ${currentTheme.text.replace('text-', 'bg-')}`}
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: "100%" }}
                                                                    transition={{ delay: 0.6 + (0.15 * idx), duration: 0.4 }}
                                                                />
                                                                <motion.div
                                                                    className={`mt-1 flex items-center justify-center w-6 h-6 ${currentTheme.text.replace('text-', 'bg-')} text-black shrink-0 cyber-clipper`}
                                                                    whileHover={{ rotate: 180, scale: 1.2 }}
                                                                    transition={{ type: "spring", stiffness: 200 }}
                                                                >
                                                                    <Star size={14} fill="currentColor" />
                                                                </motion.div>
                                                                <span className="text-white/80 text-xs font-mono font-bold leading-relaxed">{kr}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Ultimate Goal Footer for Year 3 */}
                                                {activeYearIndex === 2 && activeProject.threeYearVision?.ultimateGoal && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        transition={{ delay: 0.8, type: "spring" }}
                                                        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,0,255,0.3)" }}
                                                        className="mt-6 p-7 border-2 border-cyber-pink bg-cyber-pink/5 relative overflow-hidden shadow-neon-pink cyber-clipper-lg"
                                                    >
                                                        <motion.div
                                                            className="absolute top-0 right-0 p-2 bg-cyber-pink text-black font-cyber font-black text-[8px] uppercase tracking-widest shadow-neon-pink"
                                                            animate={{ opacity: [1, 0.7, 1] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            FINAL_PROTOCOL
                                                        </motion.div>
                                                        <div className="text-cyber-pink font-cyber font-black text-[10px] uppercase tracking-[0.4em] block mb-2 flex items-center gap-2">
                                                            <motion.div
                                                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            >
                                                                <Crown size={14} />
                                                            </motion.div>
                                                            Ultimate_Goal::궁극적_목표
                                                        </div>
                                                        <motion.p
                                                            className="text-xl text-white font-cyber font-black leading-tight uppercase tracking-tight"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 1 }}
                                                        >
                                                            {activeProject.threeYearVision.ultimateGoal}
                                                        </motion.p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                                        <motion.div
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1],
                                                boxShadow: [
                                                    "0 0 0px rgba(0,255,255,0)",
                                                    "0 0 30px rgba(0,255,255,0.3)",
                                                    "0 0 0px rgba(0,255,255,0)"
                                                ]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="w-24 h-24 bg-black border-2 border-white/5 flex items-center justify-center mb-8 relative group cyber-clipper"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-cyber-cyan/10 blur-[30px]"
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Lock size={36} className="text-white/20 group-hover:text-cyber-cyan group-hover:animate-glitch-skew transition-colors" />
                                            </motion.div>
                                        </motion.div>
                                        <motion.h4
                                            className="text-3xl font-cyber font-black text-white mb-3 uppercase tracking-widest"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            Sector_Locked::섹터_잠김
                                        </motion.h4>
                                        <motion.p
                                            className="text-white/30 mb-10 max-w-sm font-mono text-xs uppercase tracking-tighter"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            미래 궤적 경로를 해독하기 위해 기반 프로토콜 마일스톤을 달성하세요.
                                        </motion.p>
                                        {!isExpandingVision ? (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    onClick={handleExpandVision}
                                                    className="h-14 bg-white text-black hover:bg-cyber-cyan hover:text-black border-none px-10 text-xs font-cyber font-black shadow-neon-cyan skew-x-[-10deg]"
                                                >
                                                    <span className="skew-x-[10deg] flex items-center gap-3">
                                                        <Sparkles size={16} /> 비전_로드맵_해독_시작
                                                    </span>
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-cyber font-black text-xs flex items-center gap-4 bg-cyber-cyan/5 shadow-neon-cyan"
                                                animate={{ borderColor: ["rgba(0,255,255,0.5)", "rgba(0,255,255,1)", "rgba(0,255,255,0.5)"] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Zap size={16} />
                                                </motion.div>
                                                뉴럴_네트워크_동기화_중...
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination with enhanced animations */}
                    <motion.div
                        className="py-8 flex justify-center gap-8 bg-white/5 border-t border-white/5 relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {[0, 1, 2].map((idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > activeYearIndex ? 1 : -1);
                                    setActiveYearIndex(idx);
                                }}
                                disabled={!hasVision && idx > 0 && idx > 1}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className={`group relative flex flex-col items-center gap-3
                                    ${(!hasVision && idx > 1) ? 'opacity-20 cursor-not-allowed' : ''}
                                `}
                            >
                                <motion.div
                                    className={`h-2 transition-all duration-500 rounded-full relative overflow-hidden
                                        ${activeYearIndex === idx ? `w-16 ${themeColors[idx].text.replace('text-', 'bg-')} shadow-lg` : 'w-5 bg-white/10 group-hover:bg-white/30'}
                                    `}
                                    layoutId={`pagination-${idx}`}
                                >
                                    {activeYearIndex === idx && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                                <motion.span
                                    className={`text-[9px] font-cyber font-black uppercase tracking-tighter transition-all 
                                        ${activeYearIndex === idx ? themeColors[idx].text : 'text-white/20'}`}
                                    animate={activeYearIndex === idx ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {idx + 1}년차
                                </motion.span>
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
