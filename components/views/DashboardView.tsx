import React from 'react';
import { Flame, BrainCircuit } from 'lucide-react';
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
    isEditingMode: boolean;
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
    setIsEditingMode: (edit: boolean) => void;
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
}

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
    const statusColor = isAhead ? 'text-emerald-500 text-glow-accent' : 'text-red-500 text-glow';
    const statusMessage = isAhead ? 'BUFFED' : 'DEBUFFED';


    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative animate-slide-up">

            <FloatingControls
                timerActive={props.timerActive}
                timeLeft={props.timeLeft}
                timerMode={props.timerMode}
                isEditingMode={props.isEditingMode}
                setTimerActive={props.setTimerActive}
                setTimerMode={props.setTimerMode}
                setTimeLeft={props.setTimeLeft}
                setIsEditingMode={props.setIsEditingMode}
            />

            <DashboardHeader
                activeProject={activeProject}
                progress={progress}
                daysPassed={daysPassed}
                timeProgress={timeProgress}
                isAhead={isAhead}
                statusColor={statusColor}
                statusMessage={statusMessage}
                isEditingMode={props.isEditingMode}
                setIsEditingMode={props.setIsEditingMode}
                isPreviewMode={isPreviewMode}
            />

            <VisionSection
                activeProject={activeProject}
                isEditingMode={props.isEditingMode}
                isEditingVision={props.isEditingVision}
                visionDraft={props.visionDraft}
                isExpandingVision={props.isExpandingVision}
                handleEditVision={props.handleEditVision}
                handleCancelEditVision={props.handleCancelEditVision}
                handleSaveVision={props.handleSaveVision}
                handleExpandVision={props.handleExpandVision}
                setVisionDraft={props.setVisionDraft}
            />

            <CampaignSection
                activeProject={activeProject}
                selectedMonthIndex={props.selectedMonthIndex}
                isEditingMode={props.isEditingMode}
                isCompressing={props.isCompressing}
                isExtending={props.isExtending}
                isAdjustingPlan={props.isAdjustingPlan}
                setCompressModalOpen={props.setCompressModalOpen}
                handleMonthClick={props.handleMonthClick}
                handleExtendRoadmap={props.handleExtendRoadmap}
                handleUpdateMonthGoal={props.handleUpdateMonthGoal}
                triggerSmartAdjustment={props.triggerSmartAdjustment}
            />

            <MissionSection
                activeProject={activeProject}
                activeMonthlyPlan={activeMonthlyPlan}
                weeklyPlan={weeklyPlan}
                isPreviewMode={isPreviewMode}
                previewOptions={props.previewOptions}
                previewIndex={props.previewIndex}
                isGeneratingMonthDetail={props.isGeneratingMonthDetail}
                isEditingMode={props.isEditingMode}
                selectedMonthIndex={props.selectedMonthIndex}
                setPreviewIndex={props.setPreviewIndex}
                handleGeneratePlanOptions={props.handleGeneratePlanOptions}
                cancelPreview={props.cancelPreview}
                confirmPreviewPlan={props.confirmPreviewPlan}
                toggleTask={props.toggleTask}
                updateTaskText={props.updateTaskText}
                onAbandonQuest={props.onAbandonQuest}
            />

            {/* Modals - Keeping them here or moving them out? User didn't ask, but they are relatively small. */}
            {/* Compress Timeline Modal */}
            {props.compressModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-scale-in">
                    <div className="glass-panel rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                        <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-white">
                            <Flame className="text-red-500 animate-pulse" fill="currentColor" size={28} /> HARDCORE MODE
                        </h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Condense your timeline. Increase difficulty. <br />
                            Warning: This action cannot be undone.
                        </p>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[2, 3, 4].map(months => (
                                <button
                                    key={months}
                                    onClick={() => props.onCompressRoadmap(months)}
                                    className="group p-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <span className="block text-3xl font-black text-white group-hover:text-red-500 transition-colors">{months}</span>
                                    <span className="text-xs text-zinc-500 font-bold uppercase">Months</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => props.setCompressModalOpen(false)} className="w-full py-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors">CANCEL</button>
                    </div>
                </div>
            )}

            {/* Adjustment Modal */}
            {props.adjustmentModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-scale-in">
                    <div className="glass-panel rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-white">
                            <BrainCircuit className="text-primary" /> ADJUST DIFFICULTY
                        </h3>
                        <p className="text-zinc-400 mb-8">
                            The AI Game Master will recalibrate your weekly quests based on your new goal.
                        </p>
                        <div className="grid gap-4 mb-8">
                            <button onClick={() => props.onConfirmAdjustment('EASY')} className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-700 hover:border-accent hover:bg-accent/10 text-left transition-all group">
                                <div className="font-bold text-accent mb-1 group-hover:text-glow-accent">🧘 Chill Mode</div>
                                <div className="text-xs text-zinc-500">Steady pace. Low stress. High quality.</div>
                            </button>
                            <button onClick={() => props.onConfirmAdjustment('NORMAL')} className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-700 hover:border-primary hover:bg-primary/10 text-left transition-all group">
                                <div className="font-bold text-primary mb-1 group-hover:text-glow">🏃 Startup Mode</div>
                                <div className="text-xs text-zinc-500">Standard velocity. Balanced grind.</div>
                            </button>
                            <button onClick={() => props.onConfirmAdjustment('HARD')} className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-700 hover:border-red-500 hover:bg-red-500/10 text-left transition-all group">
                                <div className="font-bold text-red-500 mb-1 group-hover:text-glow">🔥 Hardcore Mode</div>
                                <div className="text-xs text-zinc-500">Maximum effort. Sleep is optional.</div>
                            </button>
                        </div>
                        <button onClick={() => props.setAdjustmentModalOpen(false)} className="w-full py-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors">CANCEL</button>
                    </div>
                </div>
            )}
        </div>
    );
}
