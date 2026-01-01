import React from 'react';
import { Flame, BrainCircuit, Activity, AlertTriangle, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectScheme, WeeklyPlanOption, ThreeYearVision, Difficulty } from '../../types';

// Sub-components
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { VisionSection } from '../dashboard/VisionSection';
import { CampaignSection } from '../dashboard/CampaignSection';
import { MissionSection } from '../dashboard/MissionSection';
import { FloatingControls } from '../dashboard/FloatingControls';

interface DashboardViewProps {
    activeProject: ProjectScheme | null;
    selectedMonthIndex: number;
    previewOptions: WeeklyPlanOption[] | null;
    previewIndex: number;
    timerActive: boolean;
    timeLeft: number;
    timerMode: 'FOCUS' | 'BREAK';

    compressModalOpen: boolean;
    adjustmentModalOpen: boolean;
    isCompressing: boolean;
    isAdjustingPlan: boolean;
    isGeneratingMonthDetail: boolean;
    isExpandingVision: boolean;
    isExtending: boolean;
    isEditingVision: boolean;
    visionDraft: ThreeYearVision | null;
    isRefiningVision: boolean;

    // Actions
    setTimerActive: (active: boolean) => void;
    setTimerMode: (mode: 'FOCUS' | 'BREAK') => void;
    setTimeLeft: (time: number) => void;
    setCompressModalOpen: (open: boolean) => void;
    setAdjustmentModalOpen: (open: boolean) => void;

    setPreviewIndex: (index: number) => void;
    setVisionDraft: (vision: ThreeYearVision | null) => void;

    // Handlers
    onCompressRoadmap: (months: number) => void;
    onConfirmAdjustment: (difficulty: Difficulty) => void;
    handleExpandVision: () => void;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
    handleRefineVision: () => void;
    handleMonthClick: (index: number) => void;
    handleUpdateMonthGoal: (text: string) => void;
    triggerSmartAdjustment: () => void;
    handleExtendRoadmap: () => void;
    handleGeneratePlanOptions: (index: number) => void;
    cancelPreview: () => void;
    confirmPreviewPlan: () => void;
    toggleTask: (weekIndex: number, taskId: string) => void;
    updateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    onAbandonQuest: () => void;
    onOpenCampaignDetail: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 30, filter: "brightness(0)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "brightness(1)",
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export function DashboardView(props: DashboardViewProps) {
    if (!props.activeProject) return null;

    const { activeProject } = props;
    const isPreviewMode = props.previewOptions !== null;
    const activeMonthlyPlan = activeProject.monthlyPlan[props.selectedMonthIndex] || activeProject.monthlyPlan[0];
    const weeklyPlan = isPreviewMode
        ? props.previewOptions![props.previewIndex].plan
        : (activeMonthlyPlan.detailedPlan || []);

    // Metric Calculations
    const completedTasks = weeklyPlan.reduce((acc, week) => acc + week.tasks.filter(t => t.isCompleted).length, 0);
    const totalTasks = weeklyPlan.reduce((acc, week) => acc + week.tasks.length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const today = new Date();
    const startDate = new Date(activeProject.startDate);
    const currentMonthStart = new Date(startDate);
    currentMonthStart.setDate(startDate.getDate() + (props.selectedMonthIndex * 30));
    const diffTime = Math.max(0, today.getTime() - currentMonthStart.getTime());
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalDaysInMonth = 30;
    const timeProgress = Math.min(100, Math.round((daysPassed / totalDaysInMonth) * 100));

    const isAhead = progress >= timeProgress;
    const statusColor = isAhead ? 'text-cyber-cyan shadow-neon-cyan' : 'text-red-500 shadow-neon-pink';
    const statusMessage = isAhead ? 'SYNC_STABLE' : 'SYNC_LAGGING';

    return (
        <>
            <FloatingControls
                timerActive={props.timerActive}
                timeLeft={props.timeLeft}
                timerMode={props.timerMode}
                setTimerActive={props.setTimerActive}
                setTimerMode={props.setTimerMode}
                setTimeLeft={props.setTimeLeft}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 py-12 relative"
            >
                {/* Background Grid Accent */}
                <div className="fixed inset-0 pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--cyber-cyan),0.1),transparent_70%)]" />
                </div>

                <motion.div variants={sectionVariants} className="mb-20">
                    <DashboardHeader
                        activeProject={activeProject}
                        progress={progress}
                        daysPassed={daysPassed}
                        timeProgress={timeProgress}
                        isAhead={isAhead}
                        statusColor={statusColor}
                        statusMessage={statusMessage}
                        isPreviewMode={isPreviewMode}
                    />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <VisionSection
                        activeProject={activeProject}
                        isEditingVision={props.isEditingVision}
                        visionDraft={props.visionDraft}
                        isExpandingVision={props.isExpandingVision}
                        handleEditVision={props.handleEditVision}
                        handleCancelEditVision={props.handleCancelEditVision}
                        handleSaveVision={props.handleSaveVision}
                        handleExpandVision={props.handleExpandVision}
                        setVisionDraft={props.setVisionDraft}
                    />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <CampaignSection
                        activeProject={activeProject}
                        selectedMonthIndex={props.selectedMonthIndex}
                        isCompressing={props.isCompressing}
                        isExtending={props.isExtending}
                        isAdjustingPlan={props.isAdjustingPlan}
                        setCompressModalOpen={props.setCompressModalOpen}
                        handleMonthClick={props.handleMonthClick}
                        handleExtendRoadmap={props.handleExtendRoadmap}
                        handleUpdateMonthGoal={props.handleUpdateMonthGoal}
                        triggerSmartAdjustment={props.triggerSmartAdjustment}
                        onOpenCampaignDetail={props.onOpenCampaignDetail}
                    />
                </motion.div>

                <motion.div variants={sectionVariants}>
                    <MissionSection
                        activeProject={activeProject}
                        activeMonthlyPlan={activeMonthlyPlan}
                        weeklyPlan={weeklyPlan}
                        isPreviewMode={isPreviewMode}
                        previewOptions={props.previewOptions}
                        previewIndex={props.previewIndex}
                        isGeneratingMonthDetail={props.isGeneratingMonthDetail}
                        selectedMonthIndex={props.selectedMonthIndex}
                        setPreviewIndex={props.setPreviewIndex}
                        handleGeneratePlanOptions={props.handleGeneratePlanOptions}
                        cancelPreview={props.cancelPreview}
                        confirmPreviewPlan={props.confirmPreviewPlan}
                        toggleTask={props.toggleTask}
                        updateTaskText={props.updateTaskText}
                        onAbandonQuest={props.onAbandonQuest}
                    />
                </motion.div>

                {/* Modals with Cyberpunk Aesthetics */}
                <AnimatePresence>
                    {props.compressModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6 backdrop-blur-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, rotateX: 20 }}
                                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                exit={{ scale: 0.95, opacity: 0, rotateX: 20 }}
                                className="glass-panel border-2 border-red-500 max-w-lg w-full p-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden skew-x-[-2deg]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px]" />
                                <div className="skew-x-[2deg]">
                                    <div className="flex items-center justify-between mb-8 border-b border-red-500/20 pb-6">
                                        <h3 className="text-3xl font-cyber font-black flex items-center gap-4 text-red-400 tracking-tighter italic drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                            <Flame className="animate-pulse text-red-500" fill="currentColor" size={32} /> HARDCORE_MODE
                                        </h3>
                                        <div className="px-3 py-1 bg-red-500 text-black font-cyber font-black text-[10px] uppercase tracking-widest shadow-red-500 shadow-sm">
                                            DANGER
                                        </div>
                                    </div>

                                    <p className="text-white/60 mb-10 font-mono text-sm leading-relaxed uppercase tracking-tight">
                                        PROTOCOL_INITIALIZATION: Condense timeline. Force-multiplier applied. <br />
                                        WARNING: STRUCTURAL STABILITY MAY BE COMPROMISED. CANNOT BE UNDONE.
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-10">
                                        {[2, 3, 4].map(months => (
                                            <motion.button
                                                key={months}
                                                whileHover={{ scale: 1.05, backgroundColor: "rgba(239,68,68,0.1)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => props.onCompressRoadmap(months)}
                                                className="group p-6 border-2 border-white/5 bg-black hover:border-red-500 transition-all flex flex-col items-center gap-2"
                                            >
                                                <span className="text-4xl font-cyber font-black text-white group-hover:text-red-500 transition-colors">{months}</span>
                                                <span className="text-[10px] font-cyber font-black text-white/20 uppercase tracking-widest">MONTHS</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => props.setCompressModalOpen(false)}
                                        className="w-full py-4 text-[10px] font-cyber font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em]"
                                    >
                                        ABORT_SEQUENCE
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {props.adjustmentModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6 backdrop-blur-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="glass-panel border-2 border-cyber-cyan max-w-lg w-full p-10 shadow-neon-cyan relative overflow-hidden skew-x-[-2deg]"
                            >
                                <div className="skew-x-[2deg]">
                                    <div className="flex items-center justify-between mb-8 border-b border-cyber-cyan/20 pb-6">
                                        <h3 className="text-3xl font-cyber font-black flex items-center gap-4 text-cyber-cyan uppercase tracking-tighter italic">
                                            <Cpu className="animate-pulse" size={32} /> RECALIBRATE
                                        </h3>
                                        <div className="px-3 py-1 bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest shadow-neon-cyan shadow-sm">
                                            SYSTEM
                                        </div>
                                    </div>

                                    <p className="text-white/60 mb-10 font-mono text-sm leading-relaxed uppercase tracking-tight">
                                        The AI Core is ready to adjust neural quest parameters. Re-calculating weekly difficulty factors...
                                    </p>

                                    <div className="grid gap-6 mb-10">
                                        {[
                                            { id: Difficulty.EASY, label: 'CHILL_MODE', icon: '🧘', desc: 'STABLE VELOCITY. MINIMAL FRICTION.', color: 'text-cyber-yellow', border: 'hover:border-cyber-yellow', bg: 'hover:bg-cyber-yellow/5' },
                                            { id: Difficulty.NORMAL, label: 'STARTUP_MODE', icon: '🏃', desc: 'STANDARD OP-SPEED. BALANCED GRIND.', color: 'text-cyber-cyan', border: 'hover:border-cyber-cyan', bg: 'hover:bg-cyber-cyan/5' },
                                            { id: Difficulty.HARD, label: 'CRUNCH_MODE', icon: '🔥', desc: 'MAXIMUM OVERDRIVE. SYSTEM STRESS HIGH.', color: 'text-red-500', border: 'hover:border-red-500', bg: 'hover:bg-red-500/5' },
                                        ].map((diff) => (
                                            <motion.button
                                                key={diff.id}
                                                whileHover={{ scale: 1.02, x: 10 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => props.onConfirmAdjustment(diff.id as Difficulty)}
                                                className={`p-6 bg-black border-2 border-white/5 text-left transition-all group flex flex-col gap-2 ${diff.border} ${diff.bg}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className={`font-cyber font-black text-sm tracking-widest uppercase ${diff.color}`}>
                                                        {diff.icon} {diff.label}
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300">
                                                        <Activity className={diff.color} size={16} />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                                                    {diff.desc}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => props.setAdjustmentModalOpen(false)}
                                        className="w-full py-4 text-[10px] font-cyber font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em]"
                                    >
                                        CANCEL_RECALIBRATION
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
