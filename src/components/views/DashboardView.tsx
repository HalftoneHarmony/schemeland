import React from 'react';
import { Flame, BrainCircuit, Activity, AlertTriangle, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectScheme, WeeklyPlanOption, ThreeYearVision, Difficulty } from '../../types';

// Sub-components
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { DashboardStats } from '../dashboard/DashboardStats';
import { VisionSection } from '../dashboard/VisionSection';
import { CampaignSection } from '../dashboard/CampaignSection';
import { FloatingControls } from '../dashboard/FloatingControls';

interface DashboardViewProps {
    activeProject: ProjectScheme | null;
    selectedMonthIndex: number;
    previewOptions: WeeklyPlanOption[] | null;
    previewIndex: number;
    timerActive: boolean;
    timeLeft: number;
    timerMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    pomodoroCount: number;

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
    setTimerMode: (mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => void;
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
    handleUpdateMonthObjectives: (goals: string[]) => void;
    triggerSmartAdjustment: () => void;
    handleExtendRoadmap: () => void;

    onAbandonQuest: () => void;
    onOpenCampaignDetail: () => void;
    onSave: () => Promise<void>;
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

    const [compressingId, setCompressingId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (!props.isCompressing) {
            setCompressingId(null);
        }
    }, [props.isCompressing]);

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

    // Sprint (Month) Calculations
    const currentMonthStart = new Date(startDate);
    currentMonthStart.setDate(startDate.getDate() + (props.selectedMonthIndex * 30));
    const diffTimeSprint = Math.max(0, today.getTime() - currentMonthStart.getTime());
    const sprintDaysPassed = Math.floor(diffTimeSprint / (1000 * 60 * 60 * 24));
    const totalDaysInMonth = 30;
    const sprintProgress = Math.min(100, Math.round((sprintDaysPassed / totalDaysInMonth) * 100));

    // Global (Year) Calculations
    const diffTimeTotal = Math.max(0, today.getTime() - startDate.getTime());
    const yearDaysPassed = Math.floor(diffTimeTotal / (1000 * 60 * 60 * 24));
    const totalDaysInYear = 365;
    const yearProgress = Math.min(100, Math.round((yearDaysPassed / totalDaysInYear) * 100));

    const isAhead = progress >= sprintProgress;
    const statusColor = isAhead ? 'text-cyber-cyan shadow-neon-cyan' : 'text-red-500 shadow-neon-pink';
    const statusMessage = isAhead ? '동기화_안정' : '동기화_지연';

    return (
        <>
            <FloatingControls
                timerActive={props.timerActive}
                timeLeft={props.timeLeft}
                timerMode={props.timerMode}
                pomodoroCount={props.pomodoroCount}
                setTimerActive={props.setTimerActive}
                setTimerMode={props.setTimerMode}
                setTimeLeft={props.setTimeLeft}
                onSave={props.onSave}
            />


            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 py-8 relative"
            >
                {/* Premium Cyberpunk Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Deep gradient base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#050510] to-[#000a0f]" />

                    {/* Animated gradient orbs */}
                    <motion.div
                        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyber-pink/10 blur-[150px]"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyber-cyan/8 blur-[120px]"
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-purple-500/6 blur-[100px]"
                        animate={{
                            x: [0, 60, 0],
                            y: [0, -40, 0],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Grid pattern with fade */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                    </div>

                    {/* Subtle diagonal lines */}
                    <div className="absolute inset-0 opacity-[0.015] bg-[repeating-linear-gradient(45deg,transparent,transparent_100px,rgba(255,255,255,0.5)_100px,rgba(255,255,255,0.5)_101px)]" />

                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />

                    {/* Top light beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyber-cyan/5 via-transparent to-transparent blur-[80px]" />

                    {/* Animated scanline */}
                    <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent"
                        animate={{ y: ['-100vh', '100vh'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <motion.div variants={sectionVariants} className="mb-8">
                    <DashboardHeader
                        activeProject={activeProject}
                        isPreviewMode={isPreviewMode}
                        onAbandonQuest={props.onAbandonQuest}
                    />
                </motion.div>

                <div className="flex flex-col gap-12">
                    <div className="flex flex-col xl:flex-row gap-8">
                        <motion.div variants={sectionVariants} className="flex-1 min-w-0">
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

                        <motion.div
                            variants={sectionVariants}
                            className="w-full xl:w-80 shrink-0"
                        >
                            <DashboardStats
                                progress={progress}
                                sprintDaysPassed={sprintDaysPassed}
                                sprintProgress={sprintProgress}
                                yearDaysPassed={yearDaysPassed}
                                yearProgress={yearProgress}
                                isAhead={isAhead}
                            />
                        </motion.div>
                    </div>

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
                            handleUpdateMonthObjectives={props.handleUpdateMonthObjectives}
                            triggerSmartAdjustment={props.triggerSmartAdjustment}
                            onOpenCampaignDetail={props.onOpenCampaignDetail}
                        />
                    </motion.div>
                </div>

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
                                            <Flame className="animate-pulse text-red-500" fill="currentColor" size={32} /> 하드코어_모드
                                        </h3>
                                        <div className="px-3 py-1 bg-red-500 text-black font-cyber font-black text-[10px] uppercase tracking-widest shadow-red-500 shadow-sm">
                                            위험
                                        </div>
                                    </div>

                                    <p className="text-white/60 mb-10 font-mono text-sm leading-relaxed uppercase tracking-tight">
                                        프로토콜_초기화: 타임라인 압축. 효율 승수 적용됨. <br />
                                        경고: 구조적 안정성이 훼손될 수 있습니다. 취소 불가능.
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-10">
                                        {[2, 3, 4].map(months => {
                                            const isSelected = compressingId === months;
                                            return (
                                                <motion.button
                                                    key={months}
                                                    whileHover={!props.isCompressing ? { scale: 1.05, backgroundColor: "rgba(239,68,68,0.1)" } : {}}
                                                    whileTap={!props.isCompressing ? { scale: 0.9 } : {}}
                                                    animate={isSelected ? {
                                                        scale: 0.98,
                                                        backgroundColor: "rgba(239,68,68,1)",
                                                        borderColor: "rgba(239,68,68,1)"
                                                    } : {
                                                        opacity: props.isCompressing ? 0.3 : 1
                                                    }}
                                                    onClick={() => {
                                                        if (props.isCompressing) return;
                                                        setCompressingId(months);
                                                        props.onCompressRoadmap(months);
                                                    }}
                                                    disabled={props.isCompressing}
                                                    className={`group p-6 border-2 border-white/5 bg-black hover:border-red-500 transition-all flex flex-col items-center gap-2 ${isSelected ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}`}
                                                >
                                                    {isSelected ? (
                                                        <div className="flex flex-col items-center gap-2 py-2">
                                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-[10px] font-cyber font-black text-white uppercase tracking-widest animate-pulse">COMPRESSING...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-4xl font-cyber font-black text-white group-hover:text-red-500 transition-colors">{months}</span>
                                                            <span className="text-[10px] font-cyber font-black text-white/20 uppercase tracking-widest">개월</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => props.setCompressModalOpen(false)}
                                        className="w-full py-4 text-[10px] font-cyber font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em]"
                                    >
                                        중단_시퀀스
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
                                            <Cpu className="animate-pulse" size={32} /> 시스템_재보정
                                        </h3>
                                        <div className="px-3 py-1 bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest shadow-neon-cyan shadow-sm">
                                            시스템
                                        </div>
                                    </div>

                                    <p className="text-white/60 mb-10 font-mono text-sm leading-relaxed uppercase tracking-tight">
                                        AI 코어가 뉴럴 퀘스트 파라미터를 조정할 준비가 되었습니다. 주간 난이도 요소 재계산 중...
                                    </p>

                                    <div className="grid gap-6 mb-10">
                                        {[
                                            { id: Difficulty.EASY, label: '휴식_모드', icon: '🧘', desc: '안정적인 속도. 최소한의 마찰.', color: 'text-cyber-yellow', border: 'hover:border-cyber-yellow', bg: 'hover:bg-cyber-yellow/5' },
                                            { id: Difficulty.NORMAL, label: '스타트업_모드', icon: '🏃', desc: '표준 운영 속도. 균형 잡힌 몰입.', color: 'text-cyber-cyan', border: 'hover:border-cyber-cyan', bg: 'hover:bg-cyber-cyan/5' },
                                            { id: Difficulty.HARD, label: '크런치_모드', icon: '🔥', desc: '최대 오버드라이브. 시스템 부하 매우 높음.', color: 'text-red-500', border: 'hover:border-red-500', bg: 'hover:bg-red-500/5' },
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
                                        재보정_취소
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
